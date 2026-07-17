const prisma = require("../config/prisma.js");
const { formatCategoryResponse } = require("../helpers/categoryHelper.js");

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      isEnabled: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  return formatCategoryResponse(categories);
};

const createCategory = async (data) => {
  return prisma.category.create({
    data,
  });
};
const getCategory = async (id) => {
  const category = await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  const categoryObj = await prisma.category.findFirstOrThrow({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      isEnabled: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  return formatCategoryResponse(categoryObj);
};

const updateCategory = async (id, data) => {
  const category = await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return prisma.category.update({
    where: { id: parseInt(id) },
    data: data,
  });
};

const deleteCategory = async (id, data) => {
  const category = await validateCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  await prisma.product.updateMany({
    where: {
      categoryId: Number(id),
    },
    data: {
      isEnabled: false,
    },
  });
  return prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      deletedAt: new Date(),
    },
  });
};

const validateCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });
  return category;
};
const getProductByCategory = async (id) => {
  return await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      products: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};
module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getProductByCategory,
};