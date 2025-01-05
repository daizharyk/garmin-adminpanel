import { getRequest } from "./service";

const API_URL = "smartwatch_models";

export async function getSmartwatchModels() {
  const smartwatchModels = await getRequest(`${API_URL}/models`);
  return smartwatchModels;
}
