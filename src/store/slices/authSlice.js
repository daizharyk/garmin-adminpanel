import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../services/userService";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};
export const loginUser = createAsyncThunk("auth/login", async (data) => {
  const response = await login(data);
  return response;
});
export const registerUser = createAsyncThunk("auth/register", async (data) => {
  const response = await register(data);
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
  
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});
export const { logout } = slice.actions;
export default slice.reducer;
export const selectToken = (state) => state.auth.user?.token;
