require("dotenv").config();

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.DEBUG === "TRUE"
  ? err.message
  : "Something went wrong, please try again later."
  });
};
module.exports = {
   errorHandler 
}