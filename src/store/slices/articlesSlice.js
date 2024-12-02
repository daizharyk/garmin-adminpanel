import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllArticles as getAll,
  getMyArticles as getMy,
  getArticleById as getById,
  addArticle as add,
  updateArticle as update,
  deleteArticle as softDelete,
  restoreArticle as restore,
  deleteForceArticle as forceDelete,
} from "../../services/articleService";

const initialState = {
  loading: false,
  allArticles: [],
  userArticles: [],
  readedArticle: null,
};

export const clearArticles = createAction("article/clear");

export const getAllArticles = createAsyncThunk("article/getAll", async () => {
  const response = await getAll();
  return response;
});

export const getMyArticles = createAsyncThunk(
  "article/getMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMy();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
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

export const updateArticle = createAsyncThunk(
  "article/update",
  async ({ data, id }) => {
    const responce = await update(data, id);
    return responce;
  }
);
export const deleteArticle = createAsyncThunk("article/delete", async (id) => {
  const responce = await softDelete(id);
  return responce;
});
export const restoreArticle = createAsyncThunk(
  "article/restore",
  async (id) => {
    const response = await restore(id);
    return { id: response.id, isDeleted: false };
  }
);
export const deleteForceArticle = createAsyncThunk(
  "article/force",
  async (id) => {
    const response = await forceDelete(id);
    return response;
  }
);
export const slice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(clearArticles, (state) => {
      state.loading = false;

      state.userArticles = [];
      state.readedArticle = null;
    });
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
    builder
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.userArticles = state.userArticles.map((article) => {
          if (article._id === action.payload._id) {
            return action.payload;
          }
          return article;
        });
      })
      .addCase(updateArticle.rejected, (state) => {
        state.loading = false;
      });
    builder.addCase(deleteArticle.fulfilled, (state, action) => {
      state.userArticles = state.userArticles.map((article) => {
        if (article._id === action.payload.id) {
          return { ...article, isDeleted: action.payload.isDeleted };
        }
        return article;
      });
      state.loading = false;
    });

    builder.addCase(deleteArticle.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteArticle.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(restoreArticle.fulfilled, (state, action) => {
      state.userArticles = state.userArticles.map((article) => {
        if (article._id === action.payload.id) {
          return { ...article, isDeleted: action.payload.isDeleted };
        }
        return article;
      });
      state.loading = false;
    });
    builder.addCase(restoreArticle.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(restoreArticle.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteForceArticle.fulfilled, (state, action) => {
      state.userArticles = state.userArticles.filter(
        (article) => article._id !== action.payload._id
      );
    });
  },
});
export default slice.reducer;
