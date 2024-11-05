import axios from "./axios";

export async function postRequest(url, body = {}) {
  const res = await axios.post(url, body);
  if (res.status !== 200 && res.status !== 201) {
    throw res;
  }
  return await res.data;
}

export async function putRequest(url, body = {}) {
  const res = await axios.put(url, body);
  if (res.status !== 200 && res.status !== 201) {
    throw res;
  }
  return await res.data;
}

export async function deleteRequest(url) {
  const res = await axios.delete(url);
  if (res.status !== 200 && res.status !== 201) {
    throw res;
  }
  return await res.data;
}
export async function getRequest(url) {
  const res = await axios.get(url);
  if (res.status !== 200 && res.status !== 201) {
    throw res;
  }
  return await res.data;
}

