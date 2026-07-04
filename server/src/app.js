const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishListRoutes = require("./routes/wishListRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Common routes
app.use("/api/auth",authRoutes);

//Admin and public routes
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.use("/api/order", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);

app.use("/api/admin/coupon", couponRoutes);

module.exports = app;
app.use(errorHandler);
