import React, { useEffect, useRef, useState } from "react";
import { Button, Grid } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const AddImageBtn = ({
  register,
  onFileChange,
  previewImage,
  fileKey,
  containerStyle = {},
  buttonStyle = {},
  previewStyle = {},
}) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null); 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file, fileKey);
    }
  };

  const handleFileRemove = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Сбрасываем значение поля input
    }
    onFileChange(null, fileKey); // Удаляем файл из родительского компонента
  };

  return (
    <Grid
      sx={{ ...containerStyle }}
      item
      xs={12}
      md={6}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      {previewImage && (
        <Grid
          item
          sx={{
            ...previewStyle,
            position: "relative",
            textAlign: "center",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleFileRemove}
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              backgroundColor: "#fff",
              border: "none",
              color: "#000",
              borderRadius: "0",
              "&:hover": {
                backgroundColor: "#c1121f",
                color: "#fff",
              },
            }}
          >
            Delete
          </Button>
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxHeight: "350px",
              objectFit: "contain",
            }}
          />
        </Grid>
      )}
      <Grid item display={"flex"} justifyContent={"center"}>
        <input
          type="file"
          id={`fileInput-${fileKey}`}
          {...register(fileKey)}
          onChange={handleFileChange}
          style={{ display: "none" }}
          ref={fileInputRef} 
        />
        <Button
          variant="contained"
          component="span"
          sx={{
            backgroundColor: "#fff",
            border: "none",
            color: "#000",
            borderRadius: "0",
            "&:hover": {
              backgroundColor: "#000",
              color: "#fff",
            },
            ...buttonStyle,
          }}
          onClick={() =>
            document.getElementById(`fileInput-${fileKey}`).click()
          } // открываем диалог выбора файла
        >
          <AttachFileIcon sx={{ marginRight: 1 }} />
          {fileName
            ? fileName.length > 15
              ? `${fileName.slice(0, 10)}...${fileName.slice(
                  fileName.lastIndexOf(".")
                )}`
              : fileName
            : "select picture"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddImageBtn;
