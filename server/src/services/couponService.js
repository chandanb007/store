const prisma = require("../config/prisma.js");
const AppError = require("../utils/appError.js");

const addCoupon = async (coupon) => {
    return await prisma.$transaction(async (tx) => {
        const isCodeDuplicate = await tx.coupon.findUnique({
            where : {
                code : coupon.code
            }
        })
        if (!isCodeDuplicate) {
            return await tx.coupon.create({
                data : coupon
        })
        }else{
            throw new AppError("Duplicate coupon code.",400)
        }
    });
};
const assignCouponToUsers = async (id, userIds) => {

    couponId = Number(id);

    return await prisma.$transaction(async (tx) => {

        const coupon = await tx.coupon.findUnique({
            where: {
                id: couponId
            }
        });

        if (!coupon) {
            throw new AppError("Coupon not found.", 404);
        }

        const users = await tx.user.findMany({
            where: {
                id: {
                    in: userIds.map(Number)
                }
            },
            select: {
                id: true
            }
        });

        if (users.length !== userIds.length) {
            throw new AppError("One or more users do not exist.", 400);
        }

        await tx.couponAssignment.createMany({
            data: users.map(user => ({
                couponId,
                userId: user.id
            }))
        });
        return true

    });
};
const getCouponById = async(id) => {
    return await prisma.coupon.findFirst({
        where : {id : Number(id)}
    })
}
const getCoupon = async() => {
    return await prisma.coupon.findMany({
        orderBy : {id : 'desc'}
    })
}
const updateCoupon = async(id,couponData) => {
   return await prisma.$transaction(async (tx) => {
        ignoredFields = []
        const editableFields = [
            "name",
            "description",
            "isEnabled"
        ];
        couponExists = await tx.coupon.findUnique({
            where: {
                id: Number(id)
            }
        });
        if(!couponExists) {
            throw new AppError("Coupon does not exits", 400);
        }
        couponUsages  = await tx.couponUsage.findFirst({
            where : {couponId :  Number(id)}
        })
        
        if (couponUsages !== null) {
            ignoredFields = Object.keys(couponData).filter(
            field => !editableFields.includes(field)
            );
            await tx.coupon.update({
                where : {id : Number(id)},
                data : {
                    name : couponData.name,
                    description : couponData.description,
                    isEnabled : couponData.isEnabled
                }
            })            
        }else {
            await tx.coupon.update({
                where : {id : Number(id)},
                data : couponData
            })
        }
        return {
            message: ignoredFields.length
            ? "Coupon has already been used. Some fields were ignored."
            : "Coupon updated successfully.",
            ignoredFields : ignoredFields
        };
   })
}
const enableOrDisableCoupon = async (id, data) => {
    const coupon = await prisma.coupon.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!coupon) {
        throw new AppError("Coupon does not exist.", 404);
    }
    if (coupon.isEnabled === data.isEnabled) {
        throw new AppError(
            `Coupon is already ${coupon.isEnabled ? "enabled" : "disabled"}.`,
            400
        );
    }
    return await prisma.coupon.update({
        where: {
            id: Number(id)
        },
        data: {
            isEnabled: data.isEnabled
        }
    });
};
module.exports = {
    addCoupon,
    assignCouponToUsers,
    getCouponById,
    getCoupon,
    updateCoupon,
    enableOrDisableCoupon
}