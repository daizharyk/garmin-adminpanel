import { postRequest } from "./service";


const API_URL = "users/";

export async function login(data) {
  const loginResponse = await postRequest(`${API_URL}login`, data);
  return loginResponse;
}

export async function register(data) {
  const registerResponse = await postRequest(`${API_URL}`, data);
  return registerResponse;
}
