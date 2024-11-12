import { Backdrop, Box, Button, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addArticle } from "../store/slices/articlesSlice";
import axios from "axios";
import { selectToken } from "../store/slices/authSlice";
import ImageCarouselUploader from "./ImageCarouselUploader";
import AddImageBtn from "./addImageBtn";

const EditArticleForm = ({ onClose }) => {
  const token = useSelector(selectToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [bannerImage, setBannerImage] = useState({
    main: null,
    adaptive: null,
  });
  const [videoSection, setVideoSection] = useState({
    thumbnail: null,
  });
  const [additionalImages, setAdditionalImages] = useState({
    addition_main: null,
    addition_adaptive: null,
  });

  const dispatch = useDispatch();

  const onSaveHandler = async (data) => {
    console.log("data", data);
    try {
      const formData = new FormData();
      carouselImages.forEach((file) => {
        formData.append("carouselImages", file.file); // Каждый файл в массив
      });

      if (bannerImage.main) {
        formData.append("mainBanner", bannerImage.main);
      }

      if (bannerImage.adaptive) {
        formData.append("adaptiveBanner", bannerImage.adaptive);
      }

      if (videoSection.thumbnail) {
        formData.append("videoThumbnail", videoSection.thumbnail);
      }

      if (additionalImages.addition_main) {
        formData.append("mainAdditionImg", additionalImages.addition_main);
      }

      if (additionalImages.addition_adaptive) {
        formData.append(
          "adaptiveAdditionImg",
          additionalImages.addition_adaptive
        );
      }

      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("color", data.color);
      formData.append("status", data.status);
      formData.append("banner_title", data.banner_text.title);
      formData.append("banner_text", data.banner_text.text);

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

  const handleFilesChange = (files) => {
    setCarouselImages(files); // Обновляем состояние файлов карусели
  };

  const handleBannerFileChange = (file, fileKey) => {
    setBannerImage((prevState) => ({
      ...prevState,
      [fileKey]: file,
    }));
  };

  const handleVideoThumbnailChange = (file) => {
    setVideoSection((prevState) => ({
      ...prevState,
      thumbnail: file,
    }));
  };
  const handleAdditionFileChange = (file, fileKey) => {
    setAdditionalImages((prevState) => ({
      ...prevState,
      [fileKey]: file,
    }));
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);
  return (
    <Backdrop open={true} onClick={onClose} sx={{ zIndex: 1000 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: "0",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSaveHandler)}>
          <Grid
            container
            spacing={4}
            sx={{
              paddingBottom: 2,
            }}
          >
            <Grid item xs={12} md={6}>
              <ImageCarouselUploader onFilesChange={handleFilesChange} />
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
            item
            xs={12}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor:"#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <Grid item margin={"10px 0"}>
              <AddImageBtn
                register={register}
                onFileChange={handleBannerFileChange}
                previewImage={
                  bannerImage?.main ? URL.createObjectURL(bannerImage.main) : ""
                }
                fileKey="main"
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between", // Распределяем контент равномерно
                  height: "100%",
                }}
                buttonStyle={{
                  width: "100%",
                  height: bannerImage?.main ? "60px" : "150px",
                }}
                buttonText="Upload Main Banner image"
              />
            </Grid>
            <Grid item margin={"10px 0"}>
              <AddImageBtn
                register={register}
                onFileChange={handleBannerFileChange}
                previewImage={
                  bannerImage?.adaptive
                    ? URL.createObjectURL(bannerImage.adaptive)
                    : ""
                }
                fileKey="adaptive"
                ъ
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",

                  justifyContent: "space-between", // Распределяем контент равномерно
                  height: "100%",
                }}
                buttonStyle={{
                  width: "100%",
                  height: bannerImage?.adaptive ? "60px" : "150px",
                }}
                buttonText="Upload Adaptive Banner image"
              />
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
                    label="Banner title"
                    type="text"
                    sx={{ width: "100%",backgroundColor:"#fff" }}
                    {...register("banner_text.title")}
                    error={!!errors.banner_text?.title}
                    helperText={errors.banner_text?.title?.message}
                  />
                </Grid>

                <Grid item width={"100%"}>
                  <TextField
                    label="Banner text"
                    type="text"
                    sx={{ width: "100%" ,backgroundColor:"#fff"}}
                    {...register("banner_text.text")}
                    error={!!errors.banner_text?.text}
                    helperText={errors.banner_text?.text?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor:"#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <Grid item xs={12}>
              <AddImageBtn
                register={register}
                onFileChange={handleVideoThumbnailChange}
                previewImage={
                  videoSection.thumbnail
                    ? URL.createObjectURL(videoSection.thumbnail)
                    : ""
                }
                fileKey="thumbnail"
                containerStyle={{ width: "100%" }}
                buttonStyle={{
                  width: "100%",
                  height: videoSection?.thumbnail ? "60px" : "150px",
                }}
                buttonText="Upload player cover"
              />
            </Grid>
            <Grid item width={"100%"}>
              <TextField
                label="Link to video"
                type="text"
                sx={{ width: "100%",
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
                  },width: "100%" , backgroundColor:"#fff"}}
                {...register("banner_text.text")}
                error={!!errors.banner_text?.text}
                helperText={errors.banner_text?.text?.message}
              />
            </Grid>
          </Grid>

          <Grid container width={"100%"}>
            <Grid item xs={12}>
              <AddImageBtn
                register={register}
                onFileChange={handleAdditionFileChange}
                previewImage={
                  additionalImages?.addition_main
                    ? URL.createObjectURL(additionalImages.addition_main)
                    : ""
                }
                fileKey="addition_main"
                containerStyle={{ width: "100%" }}
                buttonStyle={{ width: "100%" }}
                buttonText="Upload an additional main image"
              />
            </Grid>
            <Grid item xs={12}>
              <AddImageBtn
                register={register}
                onFileChange={handleAdditionFileChange}
                previewImage={
                  additionalImages?.addition_adaptive
                    ? URL.createObjectURL(additionalImages.addition_adaptive)
                    : ""
                }
                fileKey="addition_adaptive"
                containerStyle={{ width: "100%" }}
                buttonStyle={{ width: "100%" }}
                buttonText="Upload an additional adaptive image"
              />
            </Grid>
          </Grid>

          <Grid item>
            <Button type={"submit"} variant="contained">
              Save
            </Button>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
