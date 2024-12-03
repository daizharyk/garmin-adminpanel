import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
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

import ImageCarouselUploader from "./ImageCarouselUploader";
import AddImageBtn from "./AddImageBtn";

const EditArticleForm = ({ onClose, article }) => {
  console.log("Received article in EditArticleForm:", article);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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
  console.log(additionalImages.addition_main);
  const [mainImage, setMainImage] = useState(null);
  // console.log(mainImage);

  const [watchFeatures, setWatchFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
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

      setWatchFeatures(article.watch_features || []);

      if (article.video_section) {
        setValue(
          "video_section.video_url",
          article.video_section.video_url || ""
        );
        setVideoSection({
          thumbnail: article.video_section.thumbnail || null,
          video_url: article.video_section.video_url || "",
        });
      }

      if (article.additional_images) {
        setAdditionalImages({
          addition_main: article.additional_images.main_image || null,
          addition_adaptive: article.additional_images.adaptive_image || null,
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
      if (mainImage instanceof Blob) {
        formData.append("mainImage", mainImage);
      }
      if (bannerImage.main instanceof Blob) {
        formData.append("mainBanner", bannerImage.main);
      }

      if (bannerImage.adaptive instanceof Blob) {
        formData.append("adaptiveBanner", bannerImage.adaptive);
      }

      if (videoSection.thumbnail instanceof Blob) {
        formData.append("videoThumbnail", videoSection.thumbnail);
      }

      if (additionalImages.addition_main instanceof Blob) {
        formData.append("mainAdditionImg", additionalImages.addition_main);
      }

      if (additionalImages.addition_adaptive instanceof Blob) {
        formData.append(
          "adaptiveAdditionImg",
          additionalImages.addition_adaptive
        );
      }

      formData.append("category", data.category);
      formData.append("text", data.text);
      formData.append("product_title", data.product_title);
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("color", data.color);
      formData.append("status", data.status);
      formData.append("banner_title", data.banner_text.title);
      formData.append("banner_text", data.banner_text.text);
      formData.append("video_url", data.video_section.video_url);

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

  const handleFilesChange = (files) => {
    setCarouselImages(files);
  };

  const handleBannerFileChange = (file, fileKey) => {
    setBannerImage((prevState) => ({
      ...prevState,
      [fileKey]: file,
    }));
  };
  const handlerCardImage = (file, fileKey) => {
    if (fileKey === "mainImage") {
      setMainImage(file);
    }
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
          p: 2,
          borderRadius: "0",
          maxHeight: "80vh",
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
            item
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#edf2f4",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <Grid display={"flex"} justifyContent={"center"} item>
              <AddImageBtn
                register={register}
                onFileChange={handlerCardImage}
                previewImage={
                  mainImage instanceof Blob
                    ? URL.createObjectURL(mainImage)
                    : mainImage || ""
                }
                fileKey="mainImage"
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  height: "100%",
                }}
                buttonStyle={{
                  width: "100%",
                  height: mainImage ? "60px" : "150px",
                }}
                buttonText={
                  mainImage ? "Change card image" : "Upload card image"
                }
              />
            </Grid>
            <Grid container gap={"10px"}>
              <Grid item width={"100%"}>
                <TextField
                  label="Product title"
                  type="product_title"
                  sx={{ width: "100%", backgroundColor: "#fff" }}
                  {...register("product_title", {
                    required: "Produc title is required",
                  })}
                  error={!!errors.product_title}
                  helperText={errors.product_title?.message}
                />
              </Grid>
              <Grid item width={"100%"}>
                <FormControl fullWidth sx={{ backgroundColor: "#fff" }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    error={!!errors.category}
                    defaultValue={article?.category}
                  >
                    <MenuItem value="Smartwatche">Smartwatche</MenuItem>
                  </Select>

                  {errors.category && (
                    <FormHelperText error>
                      {errors.category.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item width={"100%"}>
                <TextField
                  label="Text"
                  type="text"
                  sx={{ width: "100%", backgroundColor: "#fff" }}
                  {...register("text", {
                    required: "Text is required",
                  })}
                  error={!!errors.text}
                  helperText={errors.text?.message}
                  multiline
                  minRows={3}
                />
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
            <Grid
              container
              spacing={4}
              sx={{
                paddingBottom: 2,
              }}
            >
              <Grid item xs={12} md={6}>
                <ImageCarouselUploader
                  onFilesChange={handleFilesChange}
                  imageUrls={carouselImages}
                />
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
            <Grid
              justifyContent={"center"}
              display={"flex"}
              item
              margin={"10px 0"}
            >
              <AddImageBtn
                register={register}
                onFileChange={handleBannerFileChange}
                previewImage={
                  bannerImage?.main instanceof Blob
                    ? URL.createObjectURL(bannerImage.main)
                    : bannerImage?.main || ""
                }
                fileKey="main"
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  height: "100%",
                }}
                buttonStyle={{
                  width: "100%",
                  height: bannerImage?.main ? "60px" : "150px",
                }}
                buttonText={
                  bannerImage?.main
                    ? "Change main banner image"
                    : "Upload Main Banner image"
                }
              />
            </Grid>
            <Grid
              item
              margin={"10px 0"}
              justifyContent={"center"}
              display={"flex"}
            >
              <AddImageBtn
                register={register}
                onFileChange={handleBannerFileChange}
                previewImage={
                  bannerImage?.adaptive instanceof Blob
                    ? URL.createObjectURL(bannerImage.adaptive)
                    : bannerImage?.adaptive || ""
                }
                fileKey="adaptive"
                containerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",

                  justifyContent: "space-between",
                  height: "100%",
                }}
                buttonStyle={{
                  width: "100%",
                  height: bannerImage?.adaptive ? "60px" : "150px",
                }}
                buttonText={
                  bannerImage?.adaptive
                    ? "Change adaptive banner image"
                    : "Upload Adaptive Banner image"
                }
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
                    multiline
                    minRows={3}
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
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <AddImageBtn
                register={register}
                onFileChange={handleVideoThumbnailChange}
                previewImage={
                  videoSection.thumbnail instanceof Blob
                    ? URL.createObjectURL(videoSection.thumbnail)
                    : videoSection.thumbnail || ""
                }
                fileKey="thumbnail"
                containerStyle={{ width: "100%" }}
                buttonStyle={{
                  width: "100%",
                  height: videoSection?.thumbnail ? "60px" : "150px",
                }}
                buttonText={
                  videoSection?.thumbnail
                    ? "Change Cover"
                    : "Upload player cover"
                }
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
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <AddImageBtn
                register={register}
                onFileChange={handleAdditionFileChange}
                previewImage={
                  additionalImages?.addition_main instanceof Blob
                    ? URL.createObjectURL(additionalImages.addition_main)
                    : additionalImages?.addition_main || ""
                }
                fileKey="addition_main"
                containerStyle={{ width: "100%" }}
                buttonStyle={{
                  width: "100%",
                  height: additionalImages?.addition_main ? "60px" : "150px",
                }}
                buttonText={
                  additionalImages?.addition_main
                    ? "Change an additional main image"
                    : "Upload an additional main image"
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <AddImageBtn
                register={register}
                onFileChange={handleAdditionFileChange}
                previewImage={
                  additionalImages?.addition_adaptive instanceof Blob
                    ? URL.createObjectURL(additionalImages.addition_adaptive)
                    : additionalImages?.addition_adaptive || ""
                }
                fileKey="addition_adaptive"
                containerStyle={{ width: "100%" }}
                buttonStyle={{
                  width: "100%",
                  height: additionalImages?.addition_adaptive
                    ? "60px"
                    : "150px",
                }}
                buttonText={
                  additionalImages?.addition_main
                    ? "Change an additional adaptive image"
                    : "Upload an additional adaptive image"
                }
                fullWidth
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
                        alignItems: "center",
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
              {loading ? (
                <CircularProgress size={24} />
              ) : article ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
