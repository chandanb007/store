
const createOrderStatusHistory = async (db, data) => {
    return await db.orderStatusHistory.create({
        data
    });
}

module.exports = {
  createOrderStatusHistory,
};