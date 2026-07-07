const prisma = require("../config/prisma.js");

const getCategories = async () => {
    return prisma.category.findMany();
};

const createCategory = async (data) => {
  return prisma.category.create({
    data
  });
};
const getCategory = async (id) => {
  const category =await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return prisma.category.findFirstOrThrow({
    where : {
        'id' : parseInt(id)
    }
  });
};

const updateCategory = async (id ,data) => {
  const category =await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return prisma.category.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
};

const deleteCategory = async (id ,data) => {
 const category =await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  
  return prisma.category.delete(
    {
      where: { id: parseInt(id) },
    }
  )
};

const validateCategoryById = async (id) => {
  await prisma.product.deleteMany({
    where: {
      categoryId: Number(id)
    }
  });
  const category = await prisma.category.findUnique({
    where: {
      id: Number(id)
    }
  });
  return category;
};


module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};