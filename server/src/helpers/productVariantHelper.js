const formatVariantAttributes = (variantValues) => {
    console.log(variantValues);
  return variantValues
    .map(
      (variant) => `${variant.value.variantType.name}: ${variant.value.value}`,
    )
    .join(" | ");
};

const productStockSummary = async (prisma, productId) => {
  if (productId > 0) {
    return await prisma.productVariant.findUnique({
      where: { productId: Number(productId) },
      _sum: {
        qty: true,
      },
    });
  }
  return await prisma.productVariant.groupBy({
    by: ["productId"],
    _sum: {
      qty: true,
    },
  });
};

const productPriceSummary = async (prisma, productId) => {
  if (productId > 0) {
    return await prisma.productVariant.groupBy({
      where: { productId: Number(productId) },
      _min: {
        price: true,
        discountedPrice: true,
      },
      _max: {
        price: true,
        discountedPrice: true,
      },
    });
  }
  return await prisma.productVariant.groupBy({
    by: ["productId"],
    _min: {
      price: true,
      discountedPrice: true,
    },
    _max: {
      price: true,
      discountedPrice: true,
    },
  });
};

module.exports = {
  formatVariantAttributes,
  productStockSummary,
  productPriceSummary,
};
