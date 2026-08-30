import api from "./api";
const resourceBaseUrl = "admin/category"
export const getCategories = (filters) => {
  const queryString = new URLSearchParams(filters).toString(); 
  return api.get(`/${resourceBaseUrl}?${queryString}`);
};

export const createCategory = (data) => {
  return api.post(`${resourceBaseUrl}`, data);
};

export const getCategoryById = (id) => {
  return api.get(`/${resourceBaseUrl}/${id}`);
};

export const updateCategoryStatus = (id, status) => {
  return api.post(`/${resourceBaseUrl}/${id}/status`, { isEnabled: status });
};

export const updateCategoryData = (id, data) => {
  return api.put(`/${resourceBaseUrl}/${id}`, data);
};
export const deleteTheCategory = (id) => {
  return api.delete(`/${resourceBaseUrl}/${id}`);
};

export const restoreCategory = (id) => {
  return api.put(`/${resourceBaseUrl}/${id}/restore`);
};
