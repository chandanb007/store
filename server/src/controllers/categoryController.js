const categoryService = require("../services/categoryService");
const { success } = require("../helpers/apiResponse");

const getCategories = async (req, res) => {
  const categories = await categoryService.getCategories();
  return success(res, "Category list", categories, 200);
};

const createCategory = async (req, res, next) => {
  try {
    let body = req.body;
    let name = req.body.name.toLowerCase();
    body["slug"] = name.replaceAll(" ", "-");
    const category = await categoryService.createCategory(body);
    return success(res, "Category created", category, 201);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res) => {
  const categories = await categoryService.getCategory(req.params.id);
  return success(res, "Category fetched successfully.", categories, 200);
};
const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
  );
  return success(res, "Category updated", category, 200);
};

const deleteCategory = async (req, res) => {
  const response = await categoryService.deleteCategory(req.params.id);
  if (!response) {
    throw new Error("Category not found");
  }
  return success(res, "Category deleted successfully.", response, 200);
};
const getProductByCategory = async (req, res) => {
  const response = await categoryService.getProductByCategory(req.params.id);
  if (!response) {
    throw new Error("Category not found");
  }
  return success(res, "Category deleted successfully.", response, 200);
};
const updateCategoryStatus = async (req, res) => {
  const response = await categoryService.updateCategory(req.params.id, {
    isEnabled: req.body.isEnabled,
  });
  return success(res, "Category updated successfully.", response);
};

module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getProductByCategory,
  updateCategoryStatus,
};