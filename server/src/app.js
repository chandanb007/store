const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

module.exports = app;
app.use(errorHandler);
