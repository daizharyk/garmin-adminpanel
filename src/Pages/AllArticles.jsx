import React, { useEffect, useState } from "react";
import ArticleList from "../Common/ArticleList";
import PageWrapper from "../Common/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { getAllArticles } from "../store/slices/articlesSlice";
import Spinner from "../Common/Spinnerr.jsx";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AllArticles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { allArticles, loading } = useSelector((state) => state.articles);

  const filteredArticles = allArticles.filter((article) =>
    article.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (allArticles.length === 0) {
      dispatch(getAllArticles());
    }
  }, [dispatch]);

  return (
    <PageWrapper title={"All products"}>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
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
            width: "190px",
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </Box>
      ) : (
        <ArticleList items={filteredArticles} />
      )}
    </PageWrapper>
  );
};

export default AllArticles;
