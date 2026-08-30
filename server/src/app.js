const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");

const categoryRoutes = require("./routes/admin/categoryRoutes");
const publicCategoryRoutes = require("./routes/public/categoryRoutes");
const adminProductRoutes = require("./routes/admin/adminProductRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishListRoutes = require("./routes/wishListRoutes");
const couponRoutes = require("./routes/couponRoutes");
const checkoutRoutes = require("./routes/checkout");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const publicProductRoutes = require("./routes/public/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Common routes
app.use("/api/auth", authRoutes);

//admin routes
app.use("/api/admin/product",adminProductRoutes);

app.use("/api/product",publicProductRoutes);



//
app.use("/api/admin/category", categoryRoutes);
app.use("/api/category", publicCategoryRoutes);


app.use("/api/order", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoutes);

app.use("/api/admin/coupon", couponRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;
app.use(errorHandler);
