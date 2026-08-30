import api from "./api";

export const addProduct = (data) => {
  return api.post("/admin/product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateProduct = (id, data) => {
  return api.post("/admin/product/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getProducts = (filters) => {
   const queryString = new URLSearchParams(filters).toString(); 
  return api.get(`/admin/product?${queryString}`);
};
export const deleteProduct = (id) => {
  return api.delete(`/admin/product/${id}`);
};
export const restoreProduct = (id) => {
  return api.put(`/admin/product/${id}/restore`);
};
