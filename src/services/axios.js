import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
export default instance;
