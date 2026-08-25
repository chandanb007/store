import api from "./api";

export const getTestimonials = () => {
  return api.get("/admin/patron-testimonials");
};

export const createCategory = (data) => {
  return api.post("/category", data);
};

export const getCategoryById = (id) => {
  return api.get(`/category/${id}`);
};

export const updateCategoryStatus = (id, status) => {
  return api.post(`/category/${id}/status`, { isEnabled: status });
};

export const updateCategoryData = (id, data) => {
  return api.put(`/category/${id}`, data);
};
