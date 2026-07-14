const formatVariantAttributes = (variantValues) => {
    console.log(variantValues);
  return variantValues
    .map(
      (variant) => `${variant.value.variantType.name}: ${variant.value.value}`,
    )
    .join(" | ");
};

module.exports = { formatVariantAttributes };
