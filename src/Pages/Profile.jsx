import React, { useEffect, useState } from "react";
import PageWrapper from "../Common/PageWrapper";
import {
  Alert,
  Button,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/authSlice";
import Spinner from "../Common/Spinnerr";
const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { user, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDirty, setIsDerty] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user]);

  const currentName = watch("name");
  const currenEmail = watch("email");

  useEffect(() => {
    if (user && (currentName !== user.name || currenEmail !== user.email)) {
      setIsDerty(true);
    } else {
      setIsDerty(false);
    }
  }, [currentName, currenEmail, user]);

  const onUpdateHandler = async (data) => {
    try {
      const updatedUser = await dispatch(updateUser(data)).unwrap();
      setValue("name", updatedUser.name);
      setValue("email", updatedUser.email);
      setOpenSnackbar(true);
    } catch (error) {
      console.log("error");
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <PageWrapper variant={"filled"} title={"Profile"}>
      <Grid container justifyContent="center" alignItems="center">
        <form onSubmit={handleSubmit(onUpdateHandler)}>
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
                disabled={!isDirty || loading}
              >
                {loading ? <Spinner /> : "Update"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Updated
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default Profile;
