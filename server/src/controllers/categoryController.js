const categoryService = require("../services/categoryService");

const getCategories = async (req, res) => {
  
  const categories = await categoryService.getCategories();
  res.json(categories);
};

const createCategory = async (req, res,next) => {
  console.log(req.body)
  try{
    let body = req.body;
    let name = (req.body.name).toLowerCase();
    body['slug'] =  name.replaceAll(' ','-');
    const category = await categoryService.createCategory(body);
    res.status(201).json(category);
    
  }catch(error){
    next(error)
  }
};

const getCategory = async (req, res) => {
  const categories = await categoryService.getCategory(req.params.id);
  res.json(categories); 
};
const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json(category); 
};

const deleteCategory = async(req, res) => {
  const response = await categoryService.deleteCategory(req.params.id);
  res.json(response)
};

module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};