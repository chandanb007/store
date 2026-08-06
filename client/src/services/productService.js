import api from "./api";

export const addProduct = (data) => {
  return api.post("/product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getProducts = () => {
  return api.get("/product");
};
