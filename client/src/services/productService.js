import api from "./api";

export const addProduct = (data) => {
  return api.post("/product",data);
};
export const getProducts = () => {
  return api.get("/product");
};
