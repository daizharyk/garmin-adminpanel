import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser, registerUser } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Common/Spinnerr";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loading, error, user } = useSelector((state) => state.auth);
  console.log("user", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onRegisterHandler = async (data) => {
    try {
      const registerResult = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(registerResult)) {
        const loginData = { email: data.email, password: data.password };
        const loginResult = await dispatch(loginUser(loginData));
        if (loginUser.fulfilled.match(loginResult)) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
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
        onSubmit={handleSubmit(onRegisterHandler)}
        style={{
          width: "85%",
          maxWidth: "600px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {error && (
          <Grid
            item
            container
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ padding: "20px" }}
          >
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid
          container
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          spacing={4}
          justifyContent={"center"}
        >
          <Grid item width={"100%"}>
            <TextField
              label="User name"
              sx={{ width: "100%", backgroundColor: "#fffffc" }}
              {...register("name", {
                required: "Name is  required",
                minLength: {
                  value: 5,
                  message: "Name must be at least 5 characters",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item width={"100%"}>
            <TextField
              label="Email"
              sx={{ width: "100%", backgroundColor: "#fffffc" }}
              {...register("email", {
                required: "Email is  required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item width={"100%"}>
            <TextField
              label="Password"
              type="password"
              sx={{ width: "100%", backgroundColor: "#fffffc" }}
              {...register("password", {
                required: "Password is  required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              {loading ? <Spinner /> : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Register;
