import { Backdrop, Button, Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addArticle } from "../store/slices/articlesSlice";

const EditArticleForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();

  const onSaveHandler = async (data) => {
    console.log(data);
    
    try {
    dispatch(addArticle(data));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);
  return (
    <Backdrop open={true} onClick={onClose} sx={{ zIndex: 1000 }}>
      <Paper
        sx={{ p: 4, borderRadius: "0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSaveHandler)}>
          <Grid container spacing={4} justifyContent={"center"}>
            {previewImage && (
              <Grid item width={"100%"}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "400px",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            )}
            <Grid item width={"100%"}>
              <input
                type="file"
                id="fileInput"
                {...register("file")}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item width={"100%"}>
              <TextField
                label="Name"
                sx={{ width: "100%" }}
                {...register("name", {
                  required: "Name is  required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item width={"100%"}>
              <TextField
                label="Price"
                type="text"
                sx={{ width: "100%" }}
                {...register("price", {
                  required: "Price is  required",
                })}
                multiline
                rows={4}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid item>
              <Button type={"submit"} variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
