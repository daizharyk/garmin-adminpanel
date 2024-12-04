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
  }, []);

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
            marginBottom: "20px",
            transition: "all 0.3s ease-in-out", 
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              transition: "all 0.3s ease-in-out", 
              "&:hover fieldset": {},
              "&.Mui-focused fieldset": {
                borderColor: "#003049", 
              },
              width: searchQuery.length > 0 ? "300px" : "190px", 
              transformOrigin: "center", 
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
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spinner color="#ffff" size={60} />
        </Box>
      )}
      <ArticleList items={filteredArticles} />
    </PageWrapper>
  );
};

export default AllArticles;
