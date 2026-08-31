const { equal } = require("joi");
const prisma = require("../config/prisma.js");
const mediaService = require("../services/mediaService")
const productMediaService = require("../services/productMediaService");
const { buildMediaUrl } = require("../helpers/urlHelper.js");
const { hasInventoryHistory } = require("../helpers/inventoryHelper.js");
const { hasOrderHistory } = require("../helpers/orderHelper.js");
const fs = require("fs/promises");
const {
  productStockSummary,
  productPriceSummary,
} = require("../helpers/productVariantHelper.js");

const getProducts = async (data,isAdmin) => {
  const page = Math.max(Number(data?.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(data?.pageSize) || 5, 1), 100);
  const where = {
    category: {
      deletedAt: null,
    },
  };

  // Status
  if (data?.status === "inactive") {
    where.isEnabled = false;
  } else if (data?.status === "active") {
    where.isEnabled = true;
  }

  // Search
  if (data?.search?.trim()) {
    const search = data.search.trim();

    where.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  // Category
  if (data?.category) {
    where.categoryId = Number(data.category);
  }

  // Variant price filter
  const whereVariant = {};

  if (data?.minPrice !== undefined && data.minPrice !== "") {
    whereVariant.price = {
      ...(whereVariant.price || {}),
      gte: Number(data.minPrice),
    };
  }

  if (data?.maxPrice !== undefined && data.maxPrice !== "") {
    whereVariant.price = {
      ...(whereVariant.price || {}),
      lte: Number(data.maxPrice),
    };
  }

  /*
   * Important:
   * Filter PRODUCTS by their variants as well.
   *
   * Without this, filtering variants inside `include`
   * does not remove products that have no matching variants.
   */
  if (Object.keys(whereVariant).length > 0) {
    where.variants = {
      some: whereVariant,
    };
  }

  // Sorting
  let orderBy = {
    id: "desc",
  };

  if (data?.sort === "name_asc") {
    orderBy = {
      title: "asc",
    };
  } else if (data?.sort === "name_desc") {
    orderBy = {
      title: "desc",
    };
  } else if (data?.sort === "newest") {
    orderBy = {
      id: "desc",
    };
  } else if (data?.sort === "oldest") {
    orderBy = {
      id: "asc",
    };
  }

  /*
   * Get total count WITHOUT pagination.
   */
  const total = await prisma.product.count({
    where,
  });

  /*
   * Get paginated products.
   */
  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      description : true,
      ...(isAdmin && {
          isEnabled: true,
          deletedAt: true,          
        }
      ),
      category: {
        select: {
          name: true,
        },
      },
      productMedia: {
        where: {
          owner: "PRODUCT",
        },
        select: {
          productId :true,
          variantId :true,
          mediaId :true,
          isPrimary :true,
          sortOrder :true,
          owner: true,
          ...(isAdmin && {
            createdAt :true,
            updatedAt :true,
          }),
          media: {
            select: {
              id: true,
              type: true,
              storageKey: true,
              url: true,
              mimeType: true,
              altText: true,              
              ...(isAdmin && {
                fileName : true,
                fileSize : true,
                createdAt :true,
                updatedAt :true,
              })
            }
          },
        },
      },
      variants: {
        where: whereVariant,
        select: {
          id: true,
          productId : true,
          sku : true,
          price : true,
          discountedPrice : true,
          material  : true,
          style: true,
          ...(isAdmin && {
            qty: true,
            isEnabled: true,
            createdAt: true,
            updatedAt : true,
          }),
          productMedia: {
            select: {
              productId :true,
              variantId :true,
              mediaId :true,
              isPrimary :true,
              sortOrder :true,
              owner: true,
              ...(isAdmin && {
                createdAt :true,
                updatedAt :true,
              }),
              media: {
                select: {
                  id: true,
                  type: true,
                  storageKey: true,
                  url: true,
                  mimeType: true,
                  altText: true,              
                  ...(isAdmin && {
                    fileName : true,
                    fileSize : true,
                    createdAt :true,
                    updatedAt :true,
                  })
                }
              },
            },
          },
          variantValues: {
            include: {
              value: {
                select: {
                  value :true,
                  variantType: true,
                },
              },
            },
          },
        },
        },        
    },

    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  });

  /*
   * Calculate summaries.
   *
   * You can optimize these later to use only the
   * products returned by the current page.
   */
  const stockSummary = await productStockSummary(prisma);
  const priceSummary = await productPriceSummary(prisma);

  const stockMap = Object.fromEntries(
    stockSummary.map((item) => [
      item.productId,
      item._sum.qty ?? 0,
    ])
  );

  const priceMap = Object.fromEntries(
    priceSummary.map((item) => [
      item.productId,
      {
        minPrice:
          item._min.price != null
            ? Number(item._min.price).toFixed(2)
            : null,

        maxPrice:
          item._max.price != null
            ? Number(item._max.price).toFixed(2)
            : null,

        minDiscountPrice:
          item._min.discountedPrice != null
            ? Number(item._min.discountedPrice).toFixed(2)
            : null,

        maxDiscountPrice:
          item._max.discountedPrice != null
            ? Number(item._max.discountedPrice).toFixed(2)
            : null,
      },
    ])
  );

  const formattedProducts = products.map((product) => {
    const primaryMedia = product.productMedia.find(
      (media) => media.isPrimary === true
    );

    return {
      ...product,
       productMedia: product.productMedia.map(pm => ({
        ...pm,
        media: {
            ...pm.media,
            url: buildMediaUrl(pm.media?.url)
        }
    })),

      image: primaryMedia
        ? buildMediaUrl(primaryMedia.media.url)
        : null,

      ...priceMap[product.id],

      totalStock: stockMap[product.id] || 0,
      variants: product.variants.map(variant => ({
        ...variant,

        productMedia: variant.productMedia.map(pm => ({
            ...pm,
            media: {
                ...pm.media,
                url: buildMediaUrl(pm.media?.url)
            }
        }))
    }))
    };
  });

  const totalPages = Math.ceil(total / pageSize);
  return {
    products : formattedProducts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const createProduct = async (data, files) => {
  const { variants, ...productData } = data;

  const parsedVariants = JSON.parse(variants);

  return prisma.$transaction(
    async (tx) => {
      const product = await tx.product.create({
        data: productData,
      });

      const primaryImages =
        files?.filter(
          (file) => file.fieldname === "primaryImages"
        ) || [];

      const variantImages = {};

      files?.forEach((file) => {
        if (file.fieldname.startsWith("variantImages_")) {
          const index = Number(
            file.fieldname.replace("variantImages_", "")
          );

          if (!variantImages[index]) {
            variantImages[index] = [];
          }

          variantImages[index].push(file);
        }
      });

      for (const [index, file] of primaryImages.entries()) {
        const media = await mediaService.saveMedia(tx, {
          type: file.mimetype.startsWith("image/")
            ? "IMAGE"
            : "VIDEO",
          fileName: file.filename,
          storageKey: file.path.replace(/\\/g, "/"),
          url: file.path.replace(/\\/g, "/"),
          mimeType: file.mimetype,
          fileSize: file.size,
          altText: file.originalname,
        });

        await productMediaService.saveProductMedia(tx, {
          productId: product.id,
          mediaId: media.id,
          owner: "PRODUCT",
          isPrimary: index === 0,
          sortOrder: index,
        });
      }

      // Handle variant details and attribute creation
      for (const [index, variant] of parsedVariants.entries()) {
        const images = variantImages[index] || [];

        await createProductVariant(
          product.id,
          variant,
          images,
          tx
        );
      }

      return tx.product.findUnique({
        where: {
          id: product.id,
        },

        include: {
          variants: {
            include: {
              variantValues: {
                include: {
                  value: {
                    include: {
                      variantType: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
    {
      maxWait: 10000,
      timeout: 40000,
    }
  );
};
const getProductById = async (data) => {
  return prisma.product.findFirstOrThrow({
    where: {
      id: Number(data),
    },
    include: {
      variants: {
        include: {
          variantValues: {
            include: {
              value: {
                include: {
                  variantType: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
const deleteProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: parseInt(id) },
    data : {deletedAt: new Date(),isEnabled:false}
  });
};
const restoreProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: parseInt(id) },
    data : {deletedAt: null,isEnabled:true}
  });
};
// Helper: parses an id list that may arrive as an array, a JSON string "[1,2,3]",
// or a comma-separated string "1,2,3". Extracted to remove duplicated logic
// that previously appeared twice (deletedProductMediaIds / deletedVariantIds).
function parseIdList(value) {
  if (!value) return [];
  try {
    return Array.isArray(value)
      ? value.map(Number)
      : JSON.parse(value).map(Number);
  } catch {
    return value
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
  }
}

const updateProduct = async (id, body, files) => {
  const productId = Number(id);
  const productData = {
    title: body.title,
    categoryId: Number(body.categoryId),
    description: body.description,
    isEnabled : body.isEnabled == 'true' ? true : false,
  };
  console.log(productData);
  const deletedProductMediaIds = parseIdList(body.deletedProductMediaIds);

  return await prisma.$transaction(
    async (tx) => {
      // 1. Update product
      const product = await tx.product.update({
        where: { id: productId },
        data: productData,
        include: {
          variants: {
            include: {
              variantValues: {
                include: {
                  value: {
                    include: {
                      variantType: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 2. Delete selected product media
      if (deletedProductMediaIds.length > 0) {
        const productMediaRecords = await tx.productMedia.findMany({
          where: {
            id: { in: deletedProductMediaIds },
            productId: productId, // IMPORTANT: verify ownership
          },
          include: {
            media: {
              select: {
                id: true,
                storageKey: true,
              },
            },
          },
        });

        if (productMediaRecords.length > 0) {
          const productMediaIdsToDelete = productMediaRecords.map((pm) => pm.id);
          const mediaIds = [...new Set(productMediaRecords.map((pm) => pm.media.id))];

          // Delete all the ProductMedia relationships in one query
          await tx.productMedia.deleteMany({
            where: { id: { in: productMediaIdsToDelete } },
          });

          // Figure out, in one query, which of the referenced media are now orphaned
          const usageCounts = await tx.productMedia.groupBy({
            by: ["mediaId"],
            where: { mediaId: { in: mediaIds } },
            _count: { mediaId: true },
          });
          const stillUsedMediaIds = new Set(usageCounts.map((u) => u.mediaId));

          const seen = new Set();
          const orphanedMedia = productMediaRecords
            .map((pm) => pm.media)
            .filter((media) => {
              if (seen.has(media.id)) return false;
              seen.add(media.id);
              return !stillUsedMediaIds.has(media.id);
            });

          if (orphanedMedia.length > 0) {
            await tx.media.deleteMany({
              where: { id: { in: orphanedMedia.map((m) => m.id) } },
            });
            // Physical file deletion isn't part of the DB transaction; do it after
            for (const media of orphanedMedia) {
              await mediaService.deleteMediaFile(media.storageKey);
            }
          }
        }
      }
      //Start : Handle deletion of attribute if user select to delete
      const deletedVariantAttributes = parseIdList(body.deletedVariantAttributes);
      if (deletedVariantAttributes.length > 0) {
        const deletedAttributes = await tx.productVariantValue.findMany({
          where: {
             id: { in: deletedVariantAttributes },
          },
          include: {
            value: true,
          }
        });
        if (deletedAttributes.length > 0) {
          for (deletedAttribute of deletedAttributes) {
            const variantTypeIdUsedCount = await tx.variantValue.count({
                where : {variantTypeId : Number(deletedAttribute.value.variantTypeId)}
            })
            if (variantTypeIdUsedCount == 1) { //used only once hence we can delete it.
               await tx.productVariantValue.delete({
                where: { id: Number(deletedAttribute.id) }
              });
              await tx.variantValue.delete({
                where: { id: Number(deletedAttribute.valueId) }
              });
              await tx.variantType.delete({
                where: { id: Number(deletedAttribute.value.variantTypeId) }
              });
            } else {
              await tx.productVariantValue.delete({
                where: { id: Number(deletedAttribute.id) }
              });
            }
          }
        }
      }
      //Ends : Handle deletion of attribute if user select to delete
      // Handle new upload primary images
      if (files) {
        const primaryImages =
          files?.filter((file) => file.fieldname === "primaryImages") || [];

        if (primaryImages.length > 0) {
          // These only need to be fetched once, not once per file (see notes)
          const existingPrimary = await tx.productMedia.findFirst({
            where: {
              productId: product.id,
              owner: "PRODUCT",
              isPrimary: true,
            },
          });
          const maxSortOrder = await tx.productMedia.aggregate({
            where: {
              productId: product.id,
              owner: "PRODUCT",
            },
            _max: {
              sortOrder: true,
            },
          });
          let sortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

          for (const [index, file] of primaryImages.entries()) {
            const media = await mediaService.saveMedia(tx, {
              type: file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
              fileName: file.filename,
              storageKey: file.path.replace(/\\/g, "/"),
              url: file.path.replace(/\\/g, "/"),
              mimeType: file.mimetype,
              fileSize: file.size,
              altText: file.originalname,
            });

            await productMediaService.saveProductMedia(tx, {
              productId: product.id,
              mediaId: media.id,
              owner: "PRODUCT",
              isPrimary: !existingPrimary && index === 0,
              sortOrder: sortOrder++,
            });
          }
        }
      }

      // if change in primary image
      if (body.primaryMediaId !== "null") {
        const productPrimaryImage = await tx.productMedia.findFirst({
          where: { productId: product.id, isPrimary: true, owner: "PRODUCT" },
        });
        if (Number(productPrimaryImage?.id) !== Number(body.primaryMediaId)) {
          await tx.productMedia.update({
            where: { id: productPrimaryImage.id },
            data: { isPrimary: false },
          });
          await tx.productMedia.update({
            where: { id: Number(body.primaryMediaId) },
            data: { isPrimary: true },
          });
        }
      }

      // Start :: handle if deleted in product Variants
      if (body.deletedVariantIds !== "null") {
        const deletedProductVariantIds = parseIdList(body.deletedVariantIds);

        // BUG FIX: previously declared inside the variant loop and never cleared,
        // so files from earlier variants were re-deleted on every later iteration.
        // Now collected during the loop and deleted once, after the loop.
        const filesToDelete = [];

        if (deletedProductVariantIds.length > 0) {
          const deletingVariants = await tx.productVariant.findMany({
            where: {
              id: { in: deletedProductVariantIds },
              productId,
            },
            include: {
              productMedia: {
                include: {
                  media: true,
                },
              },
            },
          });

          for (const variant of deletingVariants) {
            // 1. Check history FIRST
            const hasHistory =
              (await hasInventoryHistory(tx, variant.id)) ||
              (await hasOrderHistory(tx, variant.id, productId));

            // 2. Soft delete if historical
            if (hasHistory) {
              await tx.productVariant.update({
                where: { id: variant.id },
                data: {
                  isEnabled: false,
                  deletedAt: new Date(),
                },
              });

              continue;
            }

            // 3. No history -> hard delete

            // Delete variant media (batched instead of one delete+count per media)
            if (variant.productMedia.length > 0) {
              const variantMediaRelIds = variant.productMedia.map((pm) => pm.id);
              const variantMediaIds = [
                ...new Set(variant.productMedia.map((pm) => pm.media.id)),
              ];

              await tx.productMedia.deleteMany({
                where: { id: { in: variantMediaRelIds } },
              });

              const usageCounts = await tx.productMedia.groupBy({
                by: ["mediaId"],
                where: { mediaId: { in: variantMediaIds } },
                _count: { mediaId: true },
              });
              const stillUsedMediaIds = new Set(usageCounts.map((u) => u.mediaId));
              const orphanedMediaIds = variantMediaIds.filter(
                (mid) => !stillUsedMediaIds.has(mid),
              );

              if (orphanedMediaIds.length > 0) {
                await tx.media.deleteMany({
                  where: { id: { in: orphanedMediaIds } },
                });

                const seen = new Set();
                for (const pm of variant.productMedia) {
                  if (
                    orphanedMediaIds.includes(pm.media.id) &&
                    !seen.has(pm.media.id)
                  ) {
                    seen.add(pm.media.id);
                    filesToDelete.push(pm.media.storageKey);
                  }
                }
              }
            }

            // Delete variant-value relationships
            await tx.productVariantValue.deleteMany({
              where: { variantId: variant.id },
            });

            // Delete variant
            await tx.productVariant.delete({
              where: { id: variant.id },
            });
          }
        }

        // Physical file deletion happens once, after all variants are processed
        for (const filePath of filesToDelete) {
          await mediaService.deleteMediaFile(filePath);
        }
      }
      // Ends :: handle if deleted in product Variants

      // Handle update variants or add new variants
      if (body.variants.length > 0) {
        const variants =
          typeof body.variants === "string" ? JSON.parse(body.variants) : body.variants;

        if (variants.length > 0) {
          const variantImages = {};
          files?.forEach((file) => {
            if (file.fieldname.startsWith("variantImages_")) {
              const index = Number(file.fieldname.replace("variantImages_", ""));
              if (!variantImages[index]) {
                variantImages[index] = [];
              }
              variantImages[index].push(file);
            }
          });

          let index = 0;
          for (const variant of variants) {
            if (variant.hasOwnProperty("id")) {
              console.log("updating the existing variant : ", variant.id);

              // BUG FIX: `.filter()` always returns an array (truthy even when empty),
              // so the previous `if (isVariantExists)` check was always true and the
              // "Variant does not exists" branch was unreachable. Use `.some()`.
              const isVariantExists = product.variants.some(
                (productVariant) => productVariant.id == variant.id,
              );

              if (isVariantExists) {
                await updateVariant(variant.id, variant, tx);
                if (variantImages[index] !== undefined) {
                  await uploadVariantImages(variantImages[index], productId, variant.id, tx);
                }
                // handle attributes add/update
                if (variant.attributes.length > 0) {
                  for (const attribute of variant.attributes) {
                    if (attribute.hasOwnProperty("id")) {
                      const currentAttribute = await tx.productVariantValue.findUnique({
                        where: { id: Number(attribute.id) },
                        include: {
                          value: {
                            include: {
                              variantType: true,
                            },
                          },
                        },
                      });
                      await updateAttribute(attribute.id, currentAttribute, attribute, tx);
                    } else {
                      await createAttribute(attribute, variant.id, tx);
                    }
                  }
                }
              } else {
                console.log("Variant does not exists,", variant.id);
              }
            } else {
              console.log("New variant adding");
              await createProductVariant(productId, variant, variantImages[index], tx);
            }
            index++;
          }
        }
      }

      return product;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
};
const inventoryHistory = async (id) => {
  return prisma.inventoryTransaction.findMany({
  where: {
    productId: Number(id)
  },
  orderBy: {
    createdAt: "desc"
  }
});
};
const createProductVariant = async (productId, variant, images, tx) => {
   const newVariant = await tx.productVariant.create({
    data: {
      productId: productId,
      sku: variant.sku,
      price: Number(variant.price),
      discountedPrice: Number(variant.discountedPrice),
      qty: Number(variant.qty),
      material: variant.material,
      style: variant.style,
      isDefault: variant.isDefault,
    },
   });
  if (images.length > 0) {
    await uploadVariantImages(images,productId,newVariant.id,tx);
  }
  if (variant.attributes.length > 0) {
    for (attribute of variant.attributes) {
        await createAttribute(attribute,newVariant.id,tx);
    }
   }
};
const uploadVariantImages = async (images,productId,variantId,tx) => {
  for (const file of images) {
    const media = await mediaService.saveMedia(tx, {
      type: file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO",
      fileName: file.filename,
      storageKey: file.path.replace(/\\/g, "/"),
      url: file.path.replace(/\\/g, "/"),
      mimeType: file.mimetype,
      fileSize: file.size,
      altText: file.originalname,
    });
    await productMediaService.saveProductMedia(tx, {
      productId: productId,
      variantId: variantId,
      mediaId: media.id,
      owner: "VARIANT",
      isPrimary: false,
    });
  }
};
const updateVariant = async (id,variant,tx) => {
  const updatedVariant = await tx.productVariant.update({
      where : {id},
      data: {
        sku: variant.sku,
        price: Number(variant.price),
        discountedPrice: Number(variant.discountedPrice),
        qty: Number(variant.qty),
        material: variant.material,
        style: variant.style,
        isDefault: variant.isDefault,
      },
    });
}
const createAttribute = async (attribute,variantId, tx) => {
     // Find or create VariantType
    let variantType = await tx.variantType.findUnique({
      where: {
        name: attribute.variantType,
      },
    });
    if (!variantType) {
      variantType = await tx.variantType.create({
        data: {
          name: attribute.variantType,
        },
      });
    }
    // Find or create VariantValue
    let variantValue = await tx.variantValue.findFirst({
      where: {
        variantTypeId: variantType.id,
        value: attribute.variantValue,
      },
    });
    if (!variantValue) {
      variantValue = await tx.variantValue.create({
        data: {
          variantTypeId: variantType.id,
          value: attribute.variantValue,
        },
      });
    }
    // Link Variant ↔ Value
    await tx.productVariantValue.create({
      data: {
        variantId: variantId,
        valueId: variantValue.id,
      },
    });
};
const updateAttribute = async (id,currentAttribute, newAttribute,tx) => {
    //if updating value of the attribute 
    // we can update with no issue but if change the attribute name 
    // then we need check if the attribute type is used in other product or not if not used then we can update it
    // else will create new one
  if (currentAttribute) {
    const isAttributeNameChanged = currentAttribute.value.variantType.name !== newAttribute.variantType;
    if (isAttributeNameChanged) { //if name changed
      const checkIfAttributeAlreadyUsed = await tx.variantValue.count({
        where: { variantTypeId: Number(currentAttribute.value.variantType.id) },
      });
      if (checkIfAttributeAlreadyUsed > 1) {
        await createAttribute(
          {
            variantType: newAttribute.variantType,
            variantValue: newAttribute.variantValue,
          },
          currentAttribute.variantId,tx
        );
        //delete the old product variant attribute type
        await tx.productVariantValue.delete({
          where: {
            variantId: variantId,
            valueId: currentAttribute.value,
          },
        });
      } else {
        await tx.variantType.update({
          where: { id: Number(currentAttribute.value.variantType.id) },
          data: { name: newAttribute.variantType },
        });
      }
    }
    await tx.variantValue.update({
      where: {
        id: Number(currentAttribute.value.id),
      },
      data: {
        value: newAttribute.variantValue,
      },
    });
  } else {
    console.log("No attribute found with the id :",id);
  }
} 

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  inventoryHistory,
  restoreProduct
};