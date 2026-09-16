import api from "../api";
const resourceBaseUrl = "order"
export const getOrderData = (orderNumber) => {
  return api.get(`/${resourceBaseUrl}/details/${orderNumber}`);
};

export const getOrders = () => {
  return api.get(`/${resourceBaseUrl}`);
};
