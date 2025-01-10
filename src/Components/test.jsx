import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addArticle, updateArticle } from "../store/slices/articlesSlice";

import {
  creatModelEdition,
  creatSmartwatchModel,
  getEditionsByModelId,
  getModelById,
  getSmartwatchModels,
} from "../services/smartWatchService";

const EditArticleForm = ({ onClose, article }) => {
  console.log("Received article in EditArticleForm:", article);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const [openDialog, setOpenDialog] = useState(false);
  const [watchFeatures, setWatchFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelEditions, setModelEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState("");
  const [newEdition, setNewEdition] = useState("");



  const dispatch = useDispatch();

  useEffect(() => {
    if (article) {
      setValue("name", article.name || "");
      setValue("price", article.price || null);
      setValue("color", article.color || "");
      setValue("status", article.status || "");
      setValue("text", article.text || "");
      setValue("category", article.category || "");
      setValue("product_title", article.product_title || "");

      if (article.image) {
        setMainImage(article.image || null);
      }
      if (article.carousel_images) {
        setCarouselImages(article.carousel_images || []);
      }
      if (article.banner_text) {
        setValue("banner_text.title", article.banner_text.title || "");
        setValue("banner_text.text", article.banner_text.text || "");
        setBannerImage({
          main: article.banner_text.banner_images?.main_banner || null,
          adaptive: article.banner_text.banner_images?.adaptive_banner || null,
        });
      }
    }
  }, [article, setValue, getValues]);

  const onSaveHandler = async (data) => {
    console.log("Form data:", data);
    setLoading(true);
    try {
      const formData = new FormData();
      if (carouselImages && Array.isArray(carouselImages)) {
        carouselImages.forEach((file) => {
          if (file && file.file instanceof Blob) {
            formData.append("carouselImages", file.file); // Каждый файл в массив
          }
        });
      }

      formData.append("model", data.model);
      for (const [key, value] of Object.entries(features)) {
        formData.append(`features[${key}]`, value);
      }

      if (Array.isArray(watchFeatures)) {
        watchFeatures.forEach((feature, index) => {
          formData.append(`watch_features[${index}][title]`, feature.title);
          formData.append(
            `watch_features[${index}][description]`,
            feature.description
          );

          if (feature.file instanceof Blob) {
            formData.append(`watch_features_image_${index}`, feature.file);
          }
        });
      }

      const isEditMode = !!article?._id;
      if (isEditMode) {
        await dispatch(updateArticle({ data: formData, id: article._id }));
      } else {
        console.log("Creating a new article");
        await dispatch(addArticle(formData));
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const smartwatchModels = await getSmartwatchModels();
        setModels(smartwatchModels);

        if (article) {
          const modelData = await getModelById(article.model);
          console.log("modelData", modelData);

          setSelectedModel(modelData._id);
          setValue("model", modelData._id || "");
          setModelEditions(modelData.editions || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [article?.model, setValue]);

  const handleModelChange = async (modelId) => {
    setSelectedModel(modelId);
    setValue("model", modelId);
    const selectedModel = models.find((model) => model._id === modelId);
    if (selectedModel) {
      setModelEditions(selectedModel.editions);
    }
    try {
      const editions = await getEditionsByModelId(modelId);
      setModelEditions(editions);
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };

  const handleAddModel = async () => {
    if (newModel.trim()) {
      const addedModel = await creatSmartwatchModel(newModel.trim());
      setModels((prevModels) => [...prevModels, addedModel]);
      setNewModel("");
      setOpenDialog(false);
    }
  };

  const handleAddEdition = async () => {
    if (newEdition.trim() && selectedModel) {
      try {
        const addedEdition = await creatModelEdition(
          selectedModel,
          newEdition.trim()
        );
        console.log("Добавленное издание:", addedEdition);

        setModelEditions((prevEditions) => {
          const updatedEditions = [
            ...(Array.isArray(prevEditions) ? prevEditions : []),
            addedEdition,
          ];
          console.log("Обновленное состояние modelEditions:", updatedEditions);
          return updatedEditions;
        });
        setNewEdition("");
        setOpenDialog(false);
      } catch (error) {
        console.error("Ошибка при добавлении нового издания:", error);
      }
    }
  };

  return (
    <Backdrop open={true} onClick={onClose} sx={{ zIndex: 1000 }}>
      <Paper
        sx={{
          p: 2,
          borderRadius: "0",
          maxHeight: "78vh",
          maxWidth: {
            xs: "100%",
            sm: "80vw",
          },
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSaveHandler)}>
          <Grid
            width={"100%"}
            sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
          >
            <Grid item width={"100%"}>
              <FormControl fullWidth sx={{ backgroundColor: "#fff" }}>
                <InputLabel>Model</InputLabel>
                <Select
                  label="Model"
                  {...register("model", {
                    required: "Model is required",
                  })}
                  error={!!errors.model}
                  value={getValues("model") || ""}
                  onChange={(e) => {
                    handleModelChange(e.target.value);
                    // setValue("model", e.target.value);
                    // setSelectedModel(e.target.value);
                  }}
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {models.map((model) => (
                    <MenuItem
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                      key={model._id}
                      value={model._id}
                    >
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>

                {errors.model && (
                  <FormHelperText error>{errors.model.message}</FormHelperText>
                )}
              </FormControl>
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
              >
                Add Model
              </Button>
              <Dialog
                fullWidth
                open={openDialog}
                onClose={() => setOpenDialog(false)}
              >
                <DialogTitle>Add New Model</DialogTitle>
                <DialogContent sx={("margin: 10px", "padding: 10px")}>
                  <TextField
                    fullWidth
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    label="Model Name"
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenDialog(false)}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddModel} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item width={"100%"}>
              <FormControl fullWidth sx={{ backgroundColor: "#fff" }}>
                <InputLabel>Model edition</InputLabel>
                <Select
                  label="Model edition"
                  {...register("modelEdition")}
                  error={!!errors.modelEdition}
                  value={getValues("modelEdition") || ""}
                  onChange={(e) => {
                    setValue("modelEdition", e.target.value);
                    setSelectedEdition(e.target.value);
                  }}
                  sx={{
                    width: "100%",

                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {(modelEditions || []).map((edition) => (
                    <MenuItem
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                      key={edition._id}
                      value={edition._id}
                    >
                      {edition.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.modelEdition && (
                  <FormHelperText error>
                    {errors.modelEdition.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
              >
                Add Model edition
              </Button>
              <Dialog
                fullWidth
                open={openDialog}
                onClose={() => setOpenDialog(false)}
              >
                <DialogTitle>Add New Model Edition</DialogTitle>
                <DialogContent sx={("margin: 10px", "padding: 10px")}>
                  <TextField
                    fullWidth
                    value={newEdition}
                    onChange={(e) => setNewEdition(e.target.value)}
                    label="Edition Name"
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenDialog(false)}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddEdition} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
