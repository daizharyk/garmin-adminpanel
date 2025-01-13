import React, { useEffect } from "react";

import { Grid } from "@mui/material";
import ArticleCard from "../Components/ArticleCard";

const ArticleList = ({
  items,
  isEdited,
  onDelete,
  onRestore,
  onDeletePermanently,
  isMyArticlesPage,
  isDeletedPage,
  showDeleted,
  loadingArticleId,
}) => {
  if (!items || !Array.isArray(items)) {
    return <p>No articles available</p>;
  }

  const filteredItems = showDeleted
    ? items
    : items.filter((item) => !item.isDeleted);
  return (
    <Grid container spacing={4}>
      {filteredItems.map((article) => {
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={article._id}>
            <ArticleCard
              isMyArticlesPage={isMyArticlesPage}
              isDeletedPage={isDeletedPage}
              onRestore={onRestore}
              onDeletePermanently={onDeletePermanently}
              onDelete={onDelete}
              _id={article._id}
              name={article.name}
              case_size={article.case_size}
              text={article.text}
              image={article.image}
              price={article.price}
              status={article.status}
              model={article.model}
              model_edition={article.model_edition}
              model_version={article.model_version}
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
              showDeleted={article.showDeleted}
              loadingArticleId={loadingArticleId}
              features={article.features}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ArticleList;
