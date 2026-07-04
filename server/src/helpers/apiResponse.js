const success = (res, message=null, data = null, statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta
  });
};

module.exports = {
  success
};