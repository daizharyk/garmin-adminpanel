import React, { useEffect, useState } from "react";
import ArticleList from "../Common/ArticleList";
import PageWrapper from "../Common/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { getMyArticles } from "../store/slices/articlesSlice";
import Spinner from "../Common/spinner";
import { Fab, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditArticleForm from "../Components/EditArticleForm";

const MyArticles = () => {
  const dispatch = useDispatch();
  const { userArticles, loading } = useSelector((state) => state.articles);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  useEffect(() => {
    if (userArticles.length === 0) {
      dispatch(getMyArticles());
    }
  }, []);
  const handleOpenForm = () => {
    setIsEditFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsEditFormOpen(false);
  };

  return (
    <>
      <PageWrapper title={"My articles"}>
        {loading && <Spinner />}
        <ArticleList items={userArticles} />
        <Grid container justifyContent="end">
          <Fab color="primary" aria-lable="add" onClick={handleOpenForm}>
            <AddIcon />
          </Fab>
        </Grid>
      </PageWrapper>
      {isEditFormOpen && <EditArticleForm onClose={handleCloseForm} />}
    </>
  );
};

export default MyArticles;
