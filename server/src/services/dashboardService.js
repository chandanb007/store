
const prisma = require("../config/prisma.js");

const getStats = async() => {
    return [
    totalProducts,
    totalOrders,
    totalUsers
    ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count()
    ]);
    }

module.exports = {
    getStats
}