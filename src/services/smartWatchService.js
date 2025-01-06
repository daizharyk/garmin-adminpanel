import { getRequest, postRequest } from "./service";

const API_URL = "smartwatch_models";

export async function getSmartwatchModels() {
  const smartwatchModels = await getRequest(`${API_URL}/models`);
  return smartwatchModels;
}
export async function creatSmartwatchModel(modelName) {
  const smartwatchModels = await postRequest(`${API_URL}/models`, {
    name: modelName,
  });
  return smartwatchModels;
}
