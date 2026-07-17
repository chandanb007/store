const formatCategoryResponse = (categories) => {
    if (categories.map !== undefined) {
        return categories.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          slug: category.slug,
          status: category.isEnabled,
          productCount: category._count.products,
        }));
    } else {
        return {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
          status: categories.isEnabled,
          productCount: categories._count.products,
        };
    }
};

module.exports = {
  formatCategoryResponse,
};