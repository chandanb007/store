const prisma = require("../config/prisma.js");


const createAddress = async (data) => {
    const maxAddressLimit = 5;
    const userAddressCount = await prisma.address.count({
      where : {userId : data.userId, deletedAt: null}
    })
  if (userAddressCount < maxAddressLimit) {
    if (data.isDefault) {
        await prisma.address.updateMany({
          where: { userId: data.userId, isDefault: true },
          data : {isDefault : false}
      })
    } 
    return await prisma.address.create({
      data
    })
  } else {
    throw new Error(`Maximum ${maxAddressLimit} addresses are allowed for a user`);
  }
}

const updateAddress = async (data,id,userId) => {
  if (data.isDefault) {
        await prisma.address.updateMany({
          where: {
            userId: Number(data.userId)
          },
          data : {isDefault : false}
      })
    } 
     return prisma.address.update(
    {
      where: { id: parseInt(id) },
      data: data,
    }
  )
}
const getAddresses = async(userId)=> {
    return await prisma.address.findMany({
        where : {userId : userId, deletedAt : null}
    })
}
const deleteAddress = async (addressId,userId ) => {
  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: {
        id: Number(addressId),
        userId : Number(userId),
        deletedAt: null,
      },
    });

    if (!address) {
      throw new Error("Address not found.");
    }

    // Soft delete
    await tx.address.update({
      where: {
        id: address.id,
      },
      data: {
        deletedAt: new Date(),
        isDefault: false,
      },
    });

    // If deleted address was default,
    // find the oldest remaining address
    if (address.isDefault) {
      const nextDefaultAddress = await tx.address.findFirst({
        where: {
         userId : Number(userId),
          deletedAt: null,
          id: {
            not: address.id,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (nextDefaultAddress) {
        await tx.address.update({
          where: {
            id: nextDefaultAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }
    return true;
  });
};
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