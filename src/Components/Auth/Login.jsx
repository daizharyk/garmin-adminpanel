import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import CloseButton from "../CloseButton";
import Spinner from "../../Common/Spinnerr";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const [showError, setShowError] = useState(true);
  const { loading, error } = useSelector((state) => state.auth);
  const onLoginHandler = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      setLoginError("");
      setShowError(true);
    } catch (error) {
      setLoginError("Incorrect username or password");
      setShowError(true);
    }
  };

  const handleClose = () => {
    setShowError(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        style={{
          width: "85%",
          maxWidth: "500px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid
          container
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          spacing={4}
          justifyContent={"center"}
        >
          {showError && loginError && (
            <Grid item width={"100%"}>
              <Paper
                sx={{
                  backgroundColor: "#fae0e4",
                  color: "#8d0801",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "0.5px solid #fcb9b2",
                  borderRadius: "4px", // Добавил скругленные углы
                  padding: "15px",
                  boxShadow: "none",
                }}
              >
                <Typography variant="body1" style={{ margin: 0 }}>
                  {loginError}
                </Typography>
                <CloseButton onClick={handleClose} />
              </Paper>
            </Grid>
          )}
          <Grid item width={"100%"}>
            <TextField
              label="Email"
              sx={{ width: "100%", backgroundColor: "#fffffc" }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  borderRadius: "4px", // Скругление углов
                },
              }}
            />
          </Grid>
          <Grid item width={"100%"}>
            <TextField
              label="Password"
              type="password"
              sx={{ width: "100%", backgroundColor: "#fffffc" }}
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: {
                  borderRadius: "4px", // Скругление углов
                },
              }}
            />
          </Grid>

          <Grid item>
            <Button
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                transition: "background-color 0.2s, color 0.2s",
                "&:hover": { backgroundColor: "#fff", color: "#000" },
              }}
              type={"submit"}
              variant="contained"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Login"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
