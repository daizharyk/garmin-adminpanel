import axios from "./axios";

export async function postRequest(url, body = {}) {
  try {
    const res = await axios.post(url, body);
    if (res.status !== 200 && res.status !== 201) {
      throw res;
    }
    return await res.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function putRequest(url, body = {}) {
  try {
    const res = await axios.put(url, body);
    if (res.status !== 200 && res.status !== 201) {
      throw res;
    }
    return await res.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function deleteRequest(url) {
  const res = await axios.delete(url);
  if (res.status !== 200 && res.status !== 201) {
    throw res;
  }
  return await res.data;
}
export async function getRequest(url, headers = {}) {
  try {
    const res = await axios.get(url, { headers });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Request failed with status: ${res.status}`);
    }
    return res.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
}

export async function patchRequest(url, body = {}) {
  try {
    const res = await axios.patch(url, body);
    return await res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
