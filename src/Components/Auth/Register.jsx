import { Alert, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as userRegister } from "../../services/userService";
import { loginUser } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onRegisterHandler = async (data) => {
    try {
      const res = await userRegister(data);
      localStorage.setItem("user", JSON.stringify(res));
      const { email, password } = data;
      await dispatch(loginUser({ email, password }));
      navigate("/");
      console.log(res);
    } catch (error) {
      console.log(error?.response?.data);
      setErrorMessage(
        error?.response?.data?.message || "Регистрация не удалась"
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onRegisterHandler)}>
      {errorMessage && (
        <Grid item sx={{ margin: "20px 0" }} width={"100%"}>
          <Alert severity="error">{errorMessage}</Alert>
        </Grid>
      )}
      <Grid container spacing={4} justifyContent={"center"}>
        <Grid item width={"100%"}>
          <TextField
            label="User name"
            sx={{ width: "100%" }}
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
            sx={{ width: "100%" }}
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
            sx={{ width: "100%" }}
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
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Register;
