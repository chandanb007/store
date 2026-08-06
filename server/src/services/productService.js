const { equal } = require("joi");
const prisma = require("../config/prisma.js");
const mediaService = require("../services/mediaService")
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
  return products.map((product) => ({
    ...product,
    ...priceMap[product.id],
    totalStock: stockMap[product.id] || 0,
  }));
};

const createProduct = async (data, files) => {
  const { variants, ...productData } = data;
  let parsedVariants = JSON.parse(variants);
  return await prisma.$transaction(async (tx) => {
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
    }) || [];
    if (files.length > 0) {
      files.forEach((file) => {
        const secondaryMedia = await mediaService.saveMedia({
          type: "IMAGE", //TODO : make it dynamic if image was uploaded then type will be IMAGE, if video then VIDEO
          fileName: file.filename,
          storageKey: file.path,
          url: file.path,
          mimeType: file.mimetype,
          fileSize: file.size,
          altText: "primaryImages"
        });
      })
    }
    if (primaryImages.length > 0) {
      files.forEach((file) => {
        await productMediaService.saveProductMedia({
          productId: product.id,
          mediaId: secondaryMedia.id,
          isPrimary: false,
          sortOrder: i + 2,
        });
      })
    }
    // const secondaryFiles = req.files?.secondaryImages || [];
    // for (let i = 0; i < secondaryFiles.length; i++) {
    //   const secondaryFile = secondaryFiles[i];
    //   const secondaryMedia = await mediaService.saveMedia({
    //     fileName: secondaryFile.filename,
    //     filePath: secondaryFile.path,
    //     mimeType: secondaryFile.mimetype,
    //     fileSize: secondaryFile.size,
    //   });
    //   await productMediaService.saveProductMedia({
    //     productId: product.id,
    //     mediaId: secondaryMedia.id,
    //     isPrimary: false,
    //     sortOrder: i + 2,
    //   });
    // }
    for (const variant of parsedVariants) {
      const createdVariant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: Number(variant.price),
          discountedPrice: Number(variant.discountedPrice),
          qty: Number(variant.qty),
          material: variant.material,
          style: variant.style,
          isDefault: variant.isDefault,
        },
      });
      for (const attribute of variant.attributes) {
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
            variantId: createdVariant.id,
            valueId: variantValue.id,
          },
        });
      }
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
  });
};
const getProductById = async(data) => {
    return prisma.product.findFirstOrThrow({ 
      where : {
        id : Number(data)
      },
      include: {
        variants: {
          include: {
            variantValues: {
              include: {
                value: {
                  include: {
                    variantType: true
                  }
                }
              }
            }
          }
        }
      }
    })
};
const deleteProduct = async (id ,data) => {
  return prisma.product.delete(
    {
      where: { id: parseInt(id) },
    }
  )
};
const updateProduct = async (id ,data) => {
  console.log(data)
  return prisma.product.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
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
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  inventoryHistory
};