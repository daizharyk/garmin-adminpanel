import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllArticles as getAll,
  getMyArticles as getMy,
  getArticleById as getById,
  addArticle as add,
} from "../../services/articleService";

const initialState = {
  loading: false,
  allArticles: [],
  userArticles: [],
  readedArticle: null,
};
export const getAllArticles = createAsyncThunk("article/getAll", async () => {
  const response = await getAll();
  return response;
});

export const getMyArticles = createAsyncThunk("article/getMy", async () => {
  const response = await getMy();
  return response;
});
export const getMyArticleById = createAsyncThunk(
  "article/getById",
  async (id) => {
    const response = await getById(id);
    return response;
  }
);

export const addArticle = createAsyncThunk("article/add", async (data) => {
  const response = await add(data);
  return response;
});


export const slice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllArticles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMyArticles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMyArticleById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllArticles.fulfilled, (state, action) => {
      state.allArticles = action.payload;
      state.loading = false;
    });
    builder.addCase(getMyArticles.fulfilled, (state, action) => {
      state.userArticles = action.payload;
      state.loading = false;
    });
    builder.addCase(getMyArticleById.fulfilled, (state, action) => {
      state.readedArticle = action.payload;
      state.loading = false;
    });
    builder.addCase(addArticle.fulfilled, (state, action) => {
      state.userArticles = [...state.userArticles, action.payload];
    });
  },
});
export default slice.reducer;
