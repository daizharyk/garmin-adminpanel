import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
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

  const [watchFeatures, setWatchFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSaveHandler = async (data) => {
    setLoading(true);
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
      formData.append("video_url", data.video_section.video_url);

      watchFeatures.forEach((feature, index) => {
        console.log("Feature before formData append:", feature);
        console.log("Feature File:------", feature.file);
        console.log("Feature File Type:", feature.file instanceof File);
        formData.append(`watch_features[${index}][title]`, feature.title);
        formData.append(
          `watch_features[${index}][description]`,
          feature.description
        );
        formData.append(`watch_features_image_${index}`, feature.file);
      });

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
      console.log("Response", response);
      dispatch(addArticle(response.data));
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = (files) => {
    setCarouselImages(files);
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

  const handleAddFeature = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setWatchFeatures([
        ...watchFeatures,
        { image: imageUrl, title: "", description: "", file },
      ]);
      event.target.value = null;
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = watchFeatures.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setWatchFeatures(updatedFeatures);
  };

  const handleChangeImage = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updatedFeatures = watchFeatures.map((feature, i) =>
        i === index ? { ...feature, image: imageUrl, file } : feature
      );
      setWatchFeatures(updatedFeatures);
    }
  };

  const handleDeleteFeature = (index) => {
    const updatedFeatures = watchFeatures.filter((_, i) => i !== index);
    setWatchFeatures(updatedFeatures);
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
            item
            xs={12}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
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
                  <Grid container gap={"10px"}>
                    <Grid item width={"100%"}>
                      <TextField
                        label="Name"
                        sx={{ width: "100%", backgroundColor: "#fff" }}
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
                        sx={{ width: "100%", backgroundColor: "#fff" }}
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
                        sx={{ width: "100%", backgroundColor: "#fff" }}
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
                        sx={{ width: "100%", backgroundColor: "#fff" }}
                        {...register("status")}
                        error={!!errors.status}
                        helperText={errors.status?.message}
                      />
                    </Grid>
                  </Grid>
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
              backgroundColor: "#edf2f4",
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
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
              }}
              item
              xs={12}
              md={6}
              gap={"10px"}
            >
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
                    sx={{ width: "100%", backgroundColor: "#fff" }}
                    {...register("banner_text.title")}
                    error={!!errors.banner_text?.title}
                    helperText={errors.banner_text?.title?.message}
                  />
                </Grid>

                <Grid item width={"100%"}>
                  <TextField
                    label="Banner text"
                    type="text"
                    sx={{ width: "100%", backgroundColor: "#fff" }}
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
              backgroundColor: "#edf2f4",
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

                  backgroundColor: "#fff",
                }}
                {...register("video_section.video_url")}
                error={!!errors.video_section?.video_url}
                helperText={errors.video_section?.video_url?.message}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
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
                buttonStyle={{
                  width: "100%",
                  height: additionalImages?.addition_main ? "60px" : "150px",
                }}
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
                buttonStyle={{
                  width: "100%",
                  height: additionalImages?.addition_adaptive
                    ? "60px"
                    : "150px",
                }}
                buttonText="Upload an additional adaptive image"
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                style={{ textTransform: "uppercase" }}
              >
                Adding watch characteristics
              </Typography>

              {watchFeatures.map((feature, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={feature.image}
                        alt={`Feature ${index + 1}`}
                        style={{
                          width: "170px",
                          height: "auto",
                          objectFit: "cover",
                          marginBottom: "10px",
                          borderRadius: "45px",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                      />

                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          width: "100%",
                          backgroundColor: "#000",

                          color: "#fff",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#fff",
                            color: "#000",
                          },
                        }}
                      >
                        Change Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleChangeImage(index, e)}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          mt: 1,
                          width: "100%",
                          backgroundColor: "#000",

                          color: "#ffff",
                          borderRadius: "5px",
                          "&:hover": {
                            backgroundColor: "#c1121f",
                            color: "#fff",
                          },
                        }}
                        onClick={() => handleDeleteFeature(index)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
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
                    <TextField
                      sx={{
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                        mb: 1,
                        width: "100%",
                      }}
                      label="Title"
                      value={feature.title}
                      onChange={(e) =>
                        handleFeatureChange(index, "title", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      sx={{
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#fff",
                      }}
                      label="Description"
                      value={feature.description}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="contained"
                component="label"
                sx={{
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "none",
                  color: "#000",
                  borderRadius: "0",
                  "&:hover": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                  height: "150px",
                }}
              >
                Add an image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleAddFeature}
                />
              </Button>
            </Box>
          </Grid>
          <Grid item display={"flex"} justifyContent={"center"}>
            <Button
              sx={{
                backgroundColor: "#fff",
                border: "none",
                color: "#000",
                borderRadius: "15px",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
              type={"submit"}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
