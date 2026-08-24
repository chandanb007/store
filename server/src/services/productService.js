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

const getProducts = async (data) => {
  const where = {
    isEnabled: true,
    category: {
      deletedAt: null,
    },
  };
  if (data.search) {
    where.OR = [
      {
        title: {
          contains: data.search,
        },
      },
      {
        description: {
          contains: data.search,
        },
      },
      {
        material: {
          contains: data.search,
        },
      },
      {
        style: {
          contains: data.search,
        },
      },
    ];
  }
  if (data.category) {
    where.AND = [
      {
        categoryId: parseInt(data.category),
      },
    ];
  }
  if (data.minPrice || data.maxPrice) {
    where.price = {};
    if (data.minPrice) {
      where.price.gte = parseInt(data.minPrice);
    }
    if (data.maxPrice) {
      where.price.lte = parseInt(data.maxPrice);
    }
  }
  let orderBy = { id: "desc" };
  if (data.sort && (data.sort === "price_asc" || data.sort === "price_desc")) {
    let order = data.sort.split("_");
    orderBy = { price: order[1] };
  }
  const page = Number(data.page || 1);
  const pageSize = Number(data.pageSize || 20);
  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          name: true,
        },
      },
      productMedia: {
        where: {
          owner: "PRODUCT",
        },
        include: {
          media: true,
        },
      },
      variants: {
        include: {
          productMedia: {
            include: {
              media: true,
            },
          },
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
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  });
  const stockSummary = await productStockSummary(prisma);
  const priceSummary = await productPriceSummary(prisma);

  const stockMap = Object.fromEntries(
    stockSummary.map((item) => [item.productId, item._sum.qty ?? 0]),
  );
  const priceMap = Object.fromEntries(
    priceSummary.map((item) => [
      item.productId,
      {
        minPrice: Number(item._min.price).toFixed(2),
        maxPrice: Number(item._max.price).toFixed(2),
        minDiscountPrice: Number(item._min.discountedPrice).toFixed(2),
        maxDiscountPrice: Number(item._max.discountedPrice).toFixed(2),
      },
    ]),
  );
  return products.map((product) => {
    const primaryMedia = product.productMedia.find(
      (media) => media.isPrimary === true,
    );

    return {
      ...product,
      image: primaryMedia ? buildMediaUrl(primaryMedia.media.url) : null,
      ...priceMap[product.id],
      totalStock: stockMap[product.id] || 0,
    };
  });
};

const createProduct = async (data, files) => {
  const { variants, ...productData } = data;
  let parsedVariants = JSON.parse(variants);
  return await prisma.$transaction(
    async (tx) => {
      const product = await tx.product.create({
        data: productData,
      });
      const primaryImages =
        files?.filter((file) => file.fieldname === "primaryImages") || [];
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
          isPrimary: index === 0,
          sortOrder: index,
        });
      }
      //handle variant details and attribute creation
      let indexVariant = 0;
      for (const variant of parsedVariants) {
        const images = variantImages[indexVariant] || [];
        const variantObj = await createProductVariant(
          product.id,
          variant,
          images,
          tx,
        );
        // Upload this variant's images
        await uploadVariantImages(images, product.id, variantObj.id, tx);
        for (const attribute of variant.attributes) {
          await createAttribute(attribute, variantObj.id, tx);
        }
        indexVariant++;
      }
      return await tx.product.findUnique({
        where: { id: product.id },
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
    },
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
  return prisma.product.delete({
    where: { id: parseInt(id) },
  });
};
const updateProduct = async (id, body, files) => {
  const productId = Number(id);

  const productData = {
    title: body.title,
    categoryId: Number(body.categoryId),
    description: body.description,
  };

  // Handle both:
  // "1,2,3"
  // and JSON "[1,2,3]"
  let deletedProductMediaIds = [];

  if (body.deletedProductMediaIds) {
    try {
      deletedProductMediaIds = Array.isArray(body.deletedProductMediaIds)
        ? body.deletedProductMediaIds.map(Number)
        : JSON.parse(body.deletedProductMediaIds).map(Number);
    } catch {
      deletedProductMediaIds = body.deletedProductMediaIds
        .split(",")
        .map((id) => Number(id))
        .filter(Boolean);
    }
  }
  return await prisma.$transaction(
    async (tx) => {
      // 1. Update product
      const product = await tx.product.update({
        where: {
          id: productId,
        },
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
            id: {
              in: deletedProductMediaIds,
            },
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

        for (const productMedia of productMediaRecords) {
          // Delete ProductMedia relationship
          await tx.productMedia.delete({
            where: {
              id: productMedia.id,
            },
          });

          // Check whether Media is used anywhere else
          const mediaUsageCount = await tx.productMedia.count({
            where: {
              mediaId: productMedia.media.id,
            },
          });

          // Delete Media only if it is no longer referenced
          if (mediaUsageCount === 0) {
            await tx.media.delete({
              where: {
                id: productMedia.media.id,
              },
            });
            //Finally delete the physical file uploaded
            await mediaService.deleteMediaFile(productMedia.media.storageKey);
          }
        }
      }
      // Handle new upload primary images
      if (files) {
        const primaryImages =
          files?.filter((file) => file.fieldname === "primaryImages") || [];
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
          await productMediaService.saveProductMedia(tx, {
            productId: product.id,
            mediaId: media.id,
            owner: "PRODUCT",
            isPrimary: !existingPrimary && index === 0,
            sortOrder: sortOrder++,
          });
        }
      }
      //if change in primary image
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
      //Start :: handle if deleted in product Variants
      let deletedProductVariantIds = [];
      if (body.deletedVariantIds !== "null") {
        try {
          deletedProductVariantIds = Array.isArray(body.deletedVariantIds)
            ? body.deletedVariantIds.map(Number)
            : JSON.parse(body.deletedVariantIds).map(Number);
        } catch {
          deletedProductVariantIds = body.deletedVariantIds
            .split(",")
            .map((id) => Number(id))
            .filter(Boolean);
        }
        const filesToDelete = [];
        if (deletedProductVariantIds.length > 0) {
          const deletingVariants = await tx.productVariant.findMany({
            where: {
              id: {
                in: deletedProductVariantIds,
              },
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
                where: {
                  id: variant.id,
                },
                data: {
                  isEnabled: false,
                  deletedAt: new Date(),
                },
              });

              continue;
            }

            // 3. No history -> hard delete

            // Delete variant media
            for (const productMedia of variant.productMedia) {
              await tx.productMedia.delete({
                where: {
                  id: productMedia.id,
                },
              });

              const mediaUsageCount = await tx.productMedia.count({
                where: {
                  mediaId: productMedia.media.id,
                },
              });

              if (mediaUsageCount === 0) {
                await tx.media.delete({
                  where: {
                    id: productMedia.media.id,
                  },
                });

                filesToDelete.push(productMedia.media.storageKey);
              }
            }

            // Delete variant-value relationships
            await tx.productVariantValue.deleteMany({
              where: {
                variantId: variant.id,
              },
            });

            // Delete variant
            await tx.productVariant.delete({
              where: {
                id: variant.id,
              },
            });
            for (const filePath of filesToDelete) {
              await mediaService.deleteMediaFile(filePath);
            }
          }
        }
      }
      //Ends :: handle if deleted in product Variants

      //Handle update variants or add new variants
      if (body.variants.length > 0) {
        let variants = "";
        if (typeof body.variants == "string") {
          variants = JSON.parse(body.variants);
        } else {
          variants = body.variants;
        }
        if (variants.length > 0) {
          for (const variant of variants) {
            if (variant.hasOwnProperty("id")) {
              console.log("updating the existing variant : ", variant.id);
              const isVariantExists = product.variants.filter(
                (productVariant) => productVariant.id == variant.id,
              );
              if (isVariantExists) {
                await updateVariant(variant.id, variant, "", tx);
              }
            } else {
              console.log("New variant adding");
              await createProductVariant(productId, variant, "", tx);
            }
            //handle attributes add/update
            if (variant.attributes.length > 0) {
              for (const attribute of variant.attributes) {
                if (attribute.hasOwnProperty("id")) {
                  const currentAttribute =
                    await tx.productVariantValue.findUnique({
                      where: { id: Number(attribute.id) },
                      include: {
                        value: {
                          include: {
                            variantType : true,
                          },
                        },
                      },
                    });
                  await updateAttribute(
                    attribute.id,
                    currentAttribute,
                    attribute,
                    tx,
                    variant.id
                  );
                } else {
                  await createAttribute(attribute, variant.id, tx);
                }
              }
            }
          }
        }
      }
      return product;
    },
    {
      maxWait: 10000,
      timeout: 40000,
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
  return await tx.productVariant.create({
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
const updateVariant = async (id,variant,files,tx) => {
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
const updateAttribute = async (id,currentAttribute, newAttribute,tx,variantId) => {
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
          variantId,tx
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
  inventoryHistory
};