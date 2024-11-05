import React from "react";
import Article from "../Components/ArticleCard";
import { Grid } from "@mui/material";
import ArticleCard from "../Components/ArticleCard";

const ArticleList = ({ items }) => {
  if (!items || !Array.isArray(items)) {
    return <p>No articles available</p>; // Вариант отображения, если нет данных
  }
  return (
    <Grid container spacing={4}>
      {items.map((article) => {
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={article._id}>
            <ArticleCard
              _id={article._id}
              name={article.name}
              text={article.text}
              image={article.image}
              price={article.price}
              status={article.status}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ArticleList;
