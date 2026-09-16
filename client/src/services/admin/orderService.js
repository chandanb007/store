import api from "../api";
const resourceBaseUrl = "admin/orders"
export const getOrders = (filters) => {
  const queryString = filters ? new URLSearchParams(filters).toString() : ""; 
  return api.get(`/${resourceBaseUrl}?${queryString}`);
};