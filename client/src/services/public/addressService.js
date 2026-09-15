import api from "../api";
const resourceBaseUrl = "addresses"
export const getUserAddresses = () => {
  return api.get(`/${resourceBaseUrl}`);
};

export const addAddress = (data) => {
  return api.post(`/${resourceBaseUrl}`,data);
};
export const deleteAddress = (id) => {
  return api.delete(`/${resourceBaseUrl}/${id}`);
};
export const updateAddress = (id, data) => {
  return api.put(`/${resourceBaseUrl}/${id}`,data);
};

