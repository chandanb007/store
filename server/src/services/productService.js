const { equal } = require("joi");
const prisma = require("../config/prisma.js");

const getProducts = async (data) => {
    const where = {isEnabled: true};
    if (data.search) {
      where.OR = [
        {
          title: {
            contains: data.search
          }
        },
        {
          description: {
            contains: data.search
          }
        },
        {
          material: {
            contains: data.search
          }
        },
         {
          style: {
            contains: data.search
          }
        }
      ];
    }
    if (data.category) {
      where.AND = [
        {
          categoryId : parseInt(data.category)
        }
      ]
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
    const page = Number(data.page || 1);
    const pageSize = Number(data.pageSize || 20);
    console.log(where)
    return prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc"
      }
    });
};
const createProduct = async(data) => {
    return prisma.product.create({
        data
    })
};
const getProduct = async(data) => {
    return prisma.product.findFirstOrThrow({ where : {
        id : data['id']
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
  return prisma.product.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
};
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
};