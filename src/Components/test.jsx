import { Backdrop, Box, Button, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addArticle } from "../store/slices/articlesSlice";
import axios from "axios";
import { selectToken } from "../store/slices/authSlice";
import AddImageBtn from "./addImageBtn";
import ImageCarouselUploader from "./ImageCarouselUploader";


const EditArticleForm = ({ onClose }) => {
  const token = useSelector(selectToken);

  
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Состояние для хранения файлов и их превью с разными ключами
  const [files, setFiles] = useState({
    carouselImage: [],
    bannerImage: { file: null, preview: null },
  });
  const onFilesChange = (newFiles) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      carouselImage: newFiles,
    }));
  };

  const onSaveHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("color", data.color);
      console.log("Отправляемые данные:", ...formData.entries());
      files.carouselImage.forEach((file) => {
        console.log("Файлы для карусели отсутствуют");
        formData.append("carouselImages", file.file);
        
      });
      if (files.bannerImage.file) {
        formData.append("bannerImage", files.bannerImage.file);

      }

      if (!token) {
        console.log("Токен не найден. Пожалуйста, войдите в систему.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3005/api/items",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(addArticle(response.data));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (file, key) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setFiles((prevFiles) => ({
        ...prevFiles,
        [key]: { file, preview },
      }));
    } else {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [key]: null,
      }));
    }
    const inputElement = document.getElementById(`fileInput-${key}`);
    if (inputElement) {
      inputElement.value = "";
    }
  };
  useEffect(() => {
    // Освобождаем ресурсы для всех изображений
    return () => {
      Object.values(files).forEach((file) => {
        if (file && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <Backdrop open={true} onClick={onClose} sx={{ zIndex: 1000 }}>
      <Paper
        sx={{
          p: 5,
          borderRadius: "0",
          maxHeight: "75vh",
          maxWidth: "90vw",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSaveHandler)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ImageCarouselUploader onFilesChange={onFilesChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                container
                spacing={2}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    "&:hover fieldset": {
                      borderColor: "black",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "black",
                    },
                  },
                }}
              >
                <Grid item width={"100%"}>
                  <TextField
                    label="Name"
                    sx={{ width: "100%" }}
                    {...register("name", {
                      required: "Name is required",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item width={"100%"}>
                  <TextField
                    label="Price"
                    type="text"
                    sx={{ width: "100%" }}
                    {...register("price", {
                      required: "Price is required",
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>
                <Grid item width={"100%"}>
                  <TextField
                    label="Color"
                    type="text"
                    sx={{ width: "100%" }}
                    {...register("color", {
                      required: "Color is required",
                    })}
                    error={!!errors.color}
                    helperText={errors.color?.message}
                  />
                </Grid>

                <Grid item width={"100%"}>
                  <TextField
                    label="Status"
                    type="text"
                    sx={{ width: "100%" }}
                    {...register("status")}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            item
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item sx={{ width: "100% " }}>
              <AddImageBtn
                register={register}
                previewImage={
                  files.carouselImage ? files.carouselImage.preview : null
                }
                onFileChange={(file) => handleFileChange(file, "carouselImage")}
                fileKey="carouselImage"
              />
            </Grid>
          </Grid>
          <Grid item marginTop={"50px"}>
            <Button
              sx={{
                backgroundColor: "#000",
                border: "none",
                color: "#fff",
                borderRadius: "0",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                },
              }}
              type={"submit"}
              variant="contained"
            >
              Save
            </Button>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
