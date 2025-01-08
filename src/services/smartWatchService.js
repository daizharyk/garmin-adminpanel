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
export async function getModelById(modelId) {
  try {
    const model = await getRequest(`${API_URL}/models/${modelId}`); // Предполагается эндпоинт API

    return model;
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    return null;
  }
}
