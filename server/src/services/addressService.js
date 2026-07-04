const prisma = require("../config/prisma.js");


const createAddress = async (data) => {
    return await prisma.address.create({
        data
    })
}

const updateAddress = async (data,id) => {
     return prisma.address.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
}

const getAddresses = async(userId)=> {
    return await prisma.address.findMany({
        where : {userId : userId}
    })
}
const deleteAddress = async(id,userId)=> {
    return prisma.address.delete(
    {
      where: { id: parseInt(id),userId : userId },
    }
  )
}
const getAddress = async (id, userId) => {
  return prisma.address.findUnique({
    where: { id: Number(id), userId: Number(userId) },
  });
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getAddress,
};