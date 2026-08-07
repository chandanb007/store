const { equal } = require("joi");
const prisma = require("../config/prisma.js");
const mediaService = require("../services/mediaService")
const productMediaService = require("../services/productMediaService");
const { buildMediaUrl } = require("../helpers/urlHelper.js");
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
          isPrimary: true,
        },
        include: {
          media: true,
        },
        take: 1,
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
  return products.map((product) => ({
    ...product,
    image:
      product.productMedia.length > 0
        ? buildMediaUrl(product.productMedia[0].media.url)
        : null,
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
      console.log(media);
      await productMediaService.saveProductMedia(tx, {
        productId: product.id,
        mediaId: media.id,
        owner: "PRODUCT",
        isPrimary: index === 0,
        sortOrder: index,
      });
    }
    let indexVariant = 0;
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
      const images = variantImages[indexVariant] || [];
      console.log("--------------------");
      console.log(images);
      console.log("--------------------");
      // Upload this variant's images
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
          productId: product.id,
          variantId: createdVariant.id,
          mediaId: media.id,
          owner: "VARIANT",
          isPrimary: false,
        });
      }
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
  });
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
const updateProduct = async (id, body) => {
  const productData = {
    title: body.title,
    categoryId: parseInt(body.categoryId),
    description: body.description,
  };
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id: parseInt(id) },
      data: productData,
    });
  });
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