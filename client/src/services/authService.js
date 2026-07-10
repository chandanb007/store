import api from "./api";

export const login = (email,password) => {
    return api.post("/auth", { email, password });
};

export const register = (user) => {
  return api.post("/auth/register", user);
};

export const logout = () => {
  localStorage.removeItem("token");
};
