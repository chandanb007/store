const { equal } = require("joi");
const prisma = require("../config/prisma.js");

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
  return prisma.product.findMany({
    where,
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
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  });
};
const createProduct = async (data) => {
  const { variants, ...productData } = data;
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: productData,
    });
    const parsedVariants = JSON.parse(variants);
    for (const variant of parsedVariants.variants) {
      const createdVariant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: variant.price,
          discountedPrice: variant.discountedPrice,
          qty: variant.qty,
          material: variant.material,
          style: variant.style,
          isDefault: variant.isDefault,
        },
      });
      for (const [typeName, valueName] of Object.entries(variant.attributes)) {
        // Find or create VariantType
        let variantType = await tx.variantType.findUnique({
          where: {
            name: typeName,
          },
        });
        if (!variantType) {
          variantType = await tx.variantType.create({
            data: {
              name: typeName,
            },
          });
        }
        // Find or create VariantValue
        let variantValue = await tx.variantValue.findFirst({
          where: {
            variantTypeId: variantType.id,
            value: valueName,
          },
        });
        if (!variantValue) {
          variantValue = await tx.variantValue.create({
            data: {
              variantTypeId: variantType.id,
              value: valueName,
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