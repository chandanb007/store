const categoryService = require("../../services/categoryService");
const { success } = require("../../helpers/apiResponse");
const isAdmin = false;

const getPublicCategories = async (req, res) => {
  const categories = await categoryService.getCategories(req.query,isAdmin);
  return success(res, "Category list", categories, 200);
};

module.exports = {
    getPublicCategories
}