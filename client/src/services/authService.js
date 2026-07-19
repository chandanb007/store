import api from "./api";

export const login = (email,password) => {
    return api.post("/auth", { email: email, password: password });
};

export const register = (user) => {
  return api.post("/auth/register", user);
};
export const userByRole = () => {
  return api.get("/auth/user-by-role");
};

export const logout = () => {
  localStorage.removeItem("token");
};
