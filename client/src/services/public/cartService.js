import api from "../api";
const resourceBaseUrl = "cart"
export const addToCart = (cart) => {
  return api.post(`/${resourceBaseUrl}`,cart);
};