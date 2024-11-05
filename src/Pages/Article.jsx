import React, { useEffect } from "react";
import PageWrapper from "../Common/PageWrapper";
import { Box, Grid, Grow, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyArticleById } from "../store/slices/articlesSlice";
import Spinner from "../Common/spinner";
import ImageCarousel from "../Components/ImageCarusel";

const Article = () => {
  const baseImageUrl = "https://i.ibb.co.com/";
  const { id } = useParams();
  const dispatch = useDispatch();
  const { readedArticle, loading } = useSelector((state) => state.articles);
  console.log(readedArticle);

  useEffect(() => {
    if (!readedArticle || readedArticle._id !== id) {
      dispatch(getMyArticleById(id));
    }
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (readedArticle) {
    return (
      <Grid sx={{ width: "100%" }}>
        <Grid
          sx={{ marginBottom: "50px" }}
          display={"flex"}
          container
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid item>
            {readedArticle?.carousel_images?.length > 0 ? (
              <ImageCarousel
                images={readedArticle.carousel_images.map(
                  (img) => `${baseImageUrl}${img}`
                )}
              />
            ) : null}
          </Grid>
          <Grid
            item
            alignSelf="flex-start"
            sx={{
              margin: "50px",
              display: "flex",
              flexDirection: { xs: "column", md: "column" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography variant="h3" sx={{ marginBottom: 2 }}>
              {readedArticle.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {" "}
              {readedArticle.color}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#0079be", fontWeight: "600" }}
            >
              ${readedArticle.price}
            </Typography>
          </Grid>
        </Grid>
        <Grid alignItems={"center"} flexDirection={"column"}>
          <Grid item xs={12} sm={8} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                }}
              >
                {readedArticle.banner_text?.title || ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  position: "absolute",
                  top: "60%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                }}
              >
                {readedArticle.banner_text?.text || ""}
              </Typography>
              <Box
                component="img"
                src={`${baseImageUrl}${readedArticle.banner_text?.banner_images.main_banner || ""}`}
                alt="Image 1"
                sx={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={6} sx={{ padding: 0, margin: 0 }}>
            <Box display="flex" justifyContent="center" sx={{ width: "100%" }}>
              <Box
                component="iframe"
                controls
                src={readedArticle.video_section?.video_url || ""}
                title="Video Content"
                sx={{
                  width: "100%",
                  maxHeight: "600px",
                  aspectRatio: "16/9",
                }}
                allowFullScreen
              />
            </Box>
          </Grid>

          {/* Третий блок с изображением */}
          <Grid item xs={12} sm={8} md={6}>
            <Box
              component="img"
              src={`${baseImageUrl}${readedArticle.additional_images?.main_image || ""}`}
              alt="Image 2"
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid container spacing={1}>
            {readedArticle.watch_features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    padding: 1, // Уменьшите padding для уменьшения размера
                  }}
                >
                  <Box
                    component="img"
                    src={`${baseImageUrl}${feature.image}`}
                    alt={feature.title}
                    sx={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "auto",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: 1, textAlign: "left" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ flexGrow: 1, textAlign: "left" }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default Article;
