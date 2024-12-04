import React, { useEffect, useState } from "react";
import ArticleList from "../Common/ArticleList";
import PageWrapper from "../Common/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  clearArticles,
  deleteArticle,
  getMyArticles,
} from "../store/slices/articlesSlice";
import { Box, Button, Fab, Grid, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditArticleForm from "../Components/EditArticleForm";
import DeletedArticles from "../Components/DeletedArticles";

const MyArticles = () => {
  const dispatch = useDispatch();
  const { userArticles, loading } = useSelector((state) => state.articles);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [loadingArticleId, setLoadingArticleId] = useState(null);

  useEffect(() => {
    if (userArticles.length === 0) {
      dispatch(getMyArticles());
    }
  }, [dispatch]);
  useEffect(() => {
    const clearData = async () => {
      if (!user) {
        await dispatch(clearArticles());
      }
    };
    dispatch(getMyArticles());
    clearData();
  }, [user, dispatch]);

  const handleOpenForm = () => {
    setIsEditFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsEditFormOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deletedArticles = userArticles.filter((article) => article.isDeleted);
  const handleDeleteArticle = async (_id) => {
    setLoadingArticleId(_id);
    await dispatch(deleteArticle(_id)).unwrap();
    await dispatch(getMyArticles());
    setLoadingArticleId(null);
  };

  return (
    <>
      <PageWrapper title={"MY PRODUCTS"}>
        <Grid
          position={"relative"}
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: "20px" }}
        >
          <Grid item>
            <Button
              onClick={handleOpenModal}
              sx={{
                borderRadius: "10px",
                padding: "12px",
                color: "#fff",
                backgroundColor: "#4a4e69",
                "&:hover": {
                  backgroundColor: "#22223b",
                  color: "#fff",
                },
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              View Deleted Items
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginLeft: "8px",
                }}
              >
                ({deletedArticles.length})
              </Box>
            </Button>
          </Grid>
        </Grid>
        <ArticleList
          isMyArticlesPage={true}
          onDelete={handleDeleteArticle}
          items={userArticles}
          isEdited={true}
          loadingArticleId={loadingArticleId}
        />
        <Grid container justifyContent="end">
          <Tooltip title="Add Product" sx={{ fontSize: "100px" }}>
            <Fab
              sx={{
                color: "#fff",
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid",
                },
                width: "50px",
                height: "70px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "15px",
                zIndex: "1",
              }}
              aria-lable="add"
              onClick={handleOpenForm}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Grid>
      </PageWrapper>
      {isModalOpen && (
        <DeletedArticles isOpen={isModalOpen} handleClose={handleCloseModal} />
      )}
      {isEditFormOpen && <EditArticleForm onClose={handleCloseForm} />}
    </>
  );
};

export default MyArticles;
