const createPayment = async (db, data) => {
  return db.payment.create({
    data,
  });
};

module.exports = {
  createPayment,
};