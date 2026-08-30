const formatCategoryResponse = (categories) => {
    if (categories.map !== undefined) {
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
       ...(category?.deletedAt && {
             deletedAt: category.deletedAt,
        }), 
        slug: category.slug,
        ...((category.isEnabled == true || category.isEnabled ==  false)  && {
            status: category.isEnabled,
        }),        
        productCount: category._count.products      }));
    } else {
      return {
        id: categories.id,
        name: categories.name,
        description: categories.description,
        slug: categories.slug,
        ...(categories?.deletedAt && {
             deletedAt: category.deletedAt,
        }), 
        slug: categories.slug,
        ...((categories.isEnabled == true || categories.isEnabled ==  false) && {
            status: categories.isEnabled,
        }),    
        productCount: categories._count.products,
      };
    }
};

module.exports = {
  formatCategoryResponse,
};