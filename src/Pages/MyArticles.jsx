import React, { useEffect, useState } from "react";
import ArticleList from "../Common/ArticleList";
import PageWrapper from "../Common/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { getMyArticles } from "../store/slices/articlesSlice";
import Spinner from "../Common/spinner";
import { Fab, Grid, Tooltip } from "@mui/material";
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
    < >
      <PageWrapper title={"MY PRODUCTS"}>
        {loading && <Spinner />}
        <ArticleList items={userArticles} isEdited={true} />
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
                borderRadius: "10px",
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
      {isEditFormOpen  && <EditArticleForm onClose={handleCloseForm} />}
    </>
  );
};

export default MyArticles;
