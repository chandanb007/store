import api from "./api";

export const getCategories = () => {
  return api.get("/category");
};

export const createCategory = (data) => {
  return api.post("/category", data);
};

export const getProductsByCategory = (id) => {
     return api.get(`/category/${id}/products`);
}