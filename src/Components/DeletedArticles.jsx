import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteForceArticle,
  getMyArticles,
  restoreArticle,
} from "../store/slices/articlesSlice";
import ArticleList from "../Common/ArticleList";
import SearchIcon from "@mui/icons-material/Search";
import PageWrapper from "../Common/PageWrapper";
import {
  Backdrop,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";

const DeletedArticles = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();
  const { userArticles, loading } = useSelector((state) => state.articles);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingArticleId, setLoadingArticleId] = useState(null);
  useEffect(() => {
    if (userArticles.length === 0) {
      dispatch(getMyArticles());
    }
  }, []);

  const handleRestore = async (articleId) => {
    setLoadingArticleId(articleId);
    await dispatch(restoreArticle(articleId));
    await dispatch(getMyArticles());
    setLoadingArticleId(null);
  };

  const handleDeletePermanently = async (articleId) => {
    setLoadingArticleId(articleId);
    await dispatch(deleteForceArticle(articleId));
    await dispatch(getMyArticles());
    setLoadingArticleId(null);
  };

  const deletedArticles = userArticles.filter(
    (article) =>
      article.isDeleted &&
      article.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      <Backdrop open={isOpen} onClick={handleClose} sx={{ zIndex: "2000" }}>
        <Paper
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "90%",
            height: "70%",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
            component="h2"
          >
            Deleted products
          </Typography>
          <Box
            sx={{
              display: "flex",
              
              alignItems: "center",
              marginBottom: "20px",
              "&:focus-within .MuiOutlinedInput-root": {
                width: "300px", 
              },
            }}
          >
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "150px", 
                transition: "width 0.2s ease-in-out", 
                marginBottom: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "&:hover fieldset": {},
                  "&.Mui-focused fieldset": {
                    borderColor: "#003049",
                  },
                  transition: "width 0.3s ease-in-out", 
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <ArticleList
            items={deletedArticles}
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
            isMyArticlesPage={false}
            isEdited={false}
            showDeleted={true}
            isDeletedPage={true}
            loadingArticleId={loadingArticleId}
          />
        </Paper>
      </Backdrop>
    </PageWrapper>
  );
};

export default DeletedArticles;
