import React, { useEffect } from "react";
import ArticleList from "../Common/ArticleList";
import PageWrapper from "../Common/PageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { getAllArticles } from "../store/slices/articlesSlice";
import Spinner from "../Common/Spinnerr.jsx";

const AllArticles = () => {
  const dispatch = useDispatch();
  const { allArticles, loading } = useSelector((state) => state.articles);

  useEffect(() => {
    if (allArticles.length === 0) {
      dispatch(getAllArticles());
    }
  }, [dispatch]);

  return (
    <PageWrapper title={"All products"}>
      {loading && <Spinner />}
      <ArticleList items={allArticles} />
    </PageWrapper>
  );
};

export default AllArticles;
