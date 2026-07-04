const prisma = require("../config/prisma.js");
const AppError = require("../utils/appError.js");

const createOrUpdateWishList = async (userId, data) => {
    return await prisma.$transaction(async (tx) => {

        let wishList = await tx.wishList.findUnique({
            where: {
                userId: Number(userId)
            }
        });
        
        if (!wishList) {
            wishList = await tx.wishList.create({
                data: {
                    userId: Number(userId)
                }
            });
        }
        
        const existingItem = await tx.wishListItem.findUnique({
            where: {
                wishListId_productVariantId: {
                    wishListId: wishList.id,
                    productVariantId: Number(data.variantId)
                }
            }
        });
        
        if (existingItem) {
            throw new AppError("Item already exists in wishlist.", 400);
        }else{
        const wishlistItems = await tx.wishListItem.create({
            data: {
                wishListId : wishList.id,
                productVariantId: Number(data.variantId)
            }
        });
        return await tx.wishList.findUnique({
            where: {
                userId: Number(userId)
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
    }

    });
};  
const getWishList  = async (userId) => {
    return await prisma.wishList.findUnique({
            where: {
                userId: Number(userId)
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
}
const deleteWishListItem = async(userId,itemId) =>{
    return await prisma.$transaction(async (tx) => {
        const isWishListItemExists = await tx.wishListItem.findFirst({
            where : {id : Number(itemId),
                    wishList : {userId : Number(userId)}
            }
        })
        if(isWishListItemExists) {
            const res = await tx.wishListItem.delete({
                where : {id : Number(itemId)}
            })
        }
        return await tx.wishList.findUnique({
            where: {
                userId: Number(userId)
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
    });
}
module.exports = {
    createOrUpdateWishList,
    getWishList,
    deleteWishListItem
}