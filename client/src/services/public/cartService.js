import api from "../api";
const resourceBaseUrl = "cart"
export const addToCart = (cart) => {
  return api.post(`/${resourceBaseUrl}`,cart);
};
export const getUserCart = () => {
  return api.get(`/${resourceBaseUrl}`);
};

export const updateCartItemQty = (variantId,qty) => {
  return api.patch(`/${resourceBaseUrl}/${variantId}`,{ qty: qty });
}
export const removeItem = (itemId) => {
  return api.delete(`/${resourceBaseUrl}/${itemId}`);
}
export const deleteCart = () => {
  return api.delete(`/${resourceBaseUrl}`);
}