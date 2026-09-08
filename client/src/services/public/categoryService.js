import api from "../api";
const resourceBaseUrl = "category"
export const getPublicCategories = (filters) => {
  const queryString = new URLSearchParams(filters).toString(); 
  return api.get(`/${resourceBaseUrl}?${queryString}`);
};