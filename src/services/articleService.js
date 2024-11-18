
import { getRequest, postRequest, putRequest } from "./service";

const API_URL = "items";


export async function getAllArticles() {
  const articles = await getRequest(`${API_URL}`);
  return articles;
}
export async function getMyArticles() {
  const articles = await getRequest(`${API_URL}/my`);
  return articles;
}
export async function getArticleById(id) {
  const article = await getRequest(`${API_URL}/${id}`);
  return article;
}
export async function addArticle(data) {
  const article = await postRequest(`${API_URL}/`, data);
  return article;
}
export async function updateArticle(data, id) {
  const article = await putRequest(`${API_URL}/${id}/`, data);
  return article;
}