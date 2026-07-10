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
   const address = await validateAddressById(id, userId);
  if (!address) {
    throw new Error("Address not found");
  }
    return prisma.address.delete(
    {
      where: { id: parseInt(id),userId : userId },
    }
  )
}
const getAddress = async (id, userId) => {
  const address = await validateAddressById(id, userId);
  if (!address) {
    throw new Error("Address not found");
  }
  return prisma.address.findUnique({
    where: { id: Number(id), userId: Number(userId) },
  });
};

const validateAddressById = async (id,userId) => {
 
  const address = prisma.address.findUnique({
    where: { id: Number(id), userId: Number(userId) },
  });
  return address;
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getAddress,
};