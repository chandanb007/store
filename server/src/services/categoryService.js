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
  return prisma.category.findFirstOrThrow({
    where : {
        'id' : parseInt(id)
    }
  });
};

const updateCategory = async (id ,data) => {
  return prisma.category.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
};

const deleteCategory = async (id ,data) => {
  return prisma.category.delete(
    {
      where: { id: parseInt(id) },
    }
  )
};

module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};