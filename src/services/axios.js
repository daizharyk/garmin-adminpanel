import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log(import.meta.env.VITE_API_URL); // Проверьте, что значение правильно подставляется
console.log(instance);


instance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
 if(token){
  config.headers["Authorization"] = `Bearer ${token}`;
 }
  return config;
});



export default instance;