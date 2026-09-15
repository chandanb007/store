import api from "../api";
const resourceBaseUrl = "checkout"
export const placeOrder = (data) => {
  return api.post(`/${resourceBaseUrl}`,data);
};
