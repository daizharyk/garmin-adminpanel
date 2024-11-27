import React from "react";

import { Grid } from "@mui/material";
import ArticleCard from "../Components/ArticleCard";

const ArticleList = ({ items, isEdited }) => {
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
              color={article.color}
              banner_title={article.banner_title}
              banner_text={article.banner_text}
              video_url={article.video_url}
              watch_features={article.watch_features}
              isEdited={isEdited}
              video_section={article.video_section}
              additional_images={article.additional_images}
              carousel_images={article.carousel_images}
              product_title={article.product_title}
              category={article.category}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ArticleList;
