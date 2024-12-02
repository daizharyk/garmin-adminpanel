import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import React, { memo, useState } from "react";
import "../../src/styles.css";
import { Link } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditArticleForm from "./EditArticleForm";

const ArticleCard = memo(
  ({
    _id,
    name,
    text,
    image,
    price,
    status,
    color,
    banner_title,
    banner_text,
    video_url,
    watch_features,
    video_section,
    additional_images,
    carousel_images,
    isEdited,
    product_title,
    category,
    onDelete,
    isMyArticlesPage,
    onRestore,
    onDeletePermanently,
    isDeletedPage,
    loadingArticleId,
  }) => {
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const handleOpenForm = () => {
      setIsEditFormOpen(true);
    };
    const handleCloseForm = () => {
      setIsEditFormOpen(false);
    };

    const handleSoftDelete = () => {
      onDelete(_id);
    };
    const handleRestore = () => {
      onRestore(_id);
    };

    const handlePermanentDelete = () => {
      onDeletePermanently(_id);
    };

    const isLoading = loadingArticleId === _id;

    return (
      <>
        <Card
          sx={{
            borderRadius: "15px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {isMyArticlesPage && (
            <IconButton
              onClick={handleSoftDelete}
              sx={{
                borderRadius: "7px",
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#ef7674",
                color: "#fff",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease, background-color 0.1s ease",
                "&:hover": {
                  backgroundColor: "#d91e36",
                  color: "#fff",
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          )}
          {isLoading ? (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "45%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : (
            <CardMedia
              component={"img"}
              alt={name}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "250px",
                objectFit: "contain",
                overflow: "hidden",
              }}
              image={image}
              title={name}
            />
          )}
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography sx={{ padding: "10px 0" }} variant="h5" noWrap>
              {name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ flexGrow: 1 }}
            >
              {text}
            </Typography>
            <Typography sx={{ padding: "10px 0" }} variant="h6" color="primary">
              ${price}
            </Typography>
            {status && (
              <Typography
                sx={{
                  backgroundColor: status.includes("Sale")
                    ? "#e5383b"
                    : "#f5cb5c",
                  width: "fit-content",
                  padding: "4px 8px",
                  color: status.includes("Sale") ? "#fff" : "#000",
                }}
                variant="body2"
                color="secondary"
              >
                {status}
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            {!isDeletedPage && (
              <Button
                component={Link}
                to={`/article/${_id}`}
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #000",
                  borderRadius: "15px",
                  width: "100%",
                  padding: "10px 20px",
                  "&:hover": {
                    backgroundColor: "#212529",
                    color: "#fff",
                  },
                }}
                size="small"
              >
                Read
              </Button>
            )}
            {isEdited && (
              <Button
                onClick={handleOpenForm}
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #000",
                  borderRadius: "15px",
                  width: "100%",
                  padding: " 10px 20px",
                  "&:hover": {
                    backgroundColor: "#212529",
                    color: "#fff",
                  },
                }}
                size="small"
              >
                Edit
              </Button>
            )}
            {isDeletedPage && (
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                  <Button
                    onClick={handleRestore}
                    fullWidth
                    sx={{
                      backgroundColor: "#b7e4c7",
                      color: "#000",

                      padding: "10px 20px",
                      borderRadius: "15px",
                      height: "48px",
                      "&:hover": {
                        backgroundColor: "#74c69d",
                        color: "#fff",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    size="small"
                  >
                    Restore
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={handlePermanentDelete}
                    fullWidth
                    sx={{
                      backgroundColor: "#f4978e",
                      color: "#fff",

                      padding: "10px 20px",
                      height: "48px",
                      borderRadius: "15px",
                      "&:hover": {
                        backgroundColor: "#c1121f",
                        color: "#fff",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    size="small"
                  >
                    Delete Permanently
                  </Button>
                </Grid>
              </Grid>
            )}
          </CardActions>
        </Card>
        {isEditFormOpen && (
          <EditArticleForm
            onClose={handleCloseForm}
            article={{
              _id,
              name,
              text,
              image,
              price,
              status,
              color,
              banner_title,
              banner_text,
              video_url,
              watch_features,
              video_section,
              additional_images,
              carousel_images,
              product_title,
              category,
              onDelete,
            }}
          />
        )}
      </>
    );
  }
);

export default ArticleCard;
