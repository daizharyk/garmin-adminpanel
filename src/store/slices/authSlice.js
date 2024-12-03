import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register, update } from "../../services/userService";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
  loading: false,
};
export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const response = await login(data);
  return response;
});
export const registerUser = createAsyncThunk("auth/register", async (data) => {
  const response = await register(data);
  return response;
});
export const updateUser = createAsyncThunk("auth/update", async (data) => {
  const response = await update(data);
  return response;
});

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.loading = false;
      state.error = null;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});
export const { logout } = slice.actions;
export default slice.reducer;
export const selectToken = (state) => state.auth.user?.token;
