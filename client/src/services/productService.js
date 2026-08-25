import api from "./api";

export const addProduct = (data) => {
  return api.post("/product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateProduct = (id, data) => {
  return api.post("/product/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getProducts = (filters) => {
   const queryString = new URLSearchParams(filters).toString(); 
  return api.get(`/product?${queryString}`);
};
export const deleteProduct = (id) => {
  return api.delete(`/product/${id}`);
};
export const restoreProduct = (id) => {
  return api.put(`/product/${id}/restore`);
};
