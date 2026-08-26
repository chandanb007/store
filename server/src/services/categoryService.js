const prisma = require("../config/prisma.js");
const { formatCategoryResponse } = require("../helpers/categoryHelper.js");
const AppError = require("../utils/appError");

const getCategories = async (data) => {
  const page = Math.max(Number(data?.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(data?.pageSize) || 5, 1), 100);
  const where = {};
   const total = await prisma.category.count({
    where,
  });
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      isEnabled: true,
      deletedAt: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: "desc" },
  });
  const totalPages = Math.ceil(total / pageSize);
  const pagination = {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
 return {
    categories: formatCategoryResponse(categories),
    pagination,
  };
};

const createCategory = async (data) => {
  try {
    await prisma.category.create({
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("Category name or slug already exists.", 400);
    }
    throw error;
  }
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
      deletedAt: true,
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
const restoreCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });
  if (!category) {
    throw new AppError("Category does not exists", 400);
  }
  return await prisma.$transaction(async (tx) => {
    await tx.category.update({
      where: { id: Number(id) },
      data: { deletedAt: null },
    });
  });
};
module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getProductByCategory,
  restoreCategory,
};