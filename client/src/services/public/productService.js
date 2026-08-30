import api from "../api";

export const getPublicProducts = (filters) => {
   const queryString = new URLSearchParams(filters).toString(); 
  return api.get(`/product?${queryString}`);
};