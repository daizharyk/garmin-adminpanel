import React, {  useRef, useState } from "react";
import { Button, Grid } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const AddImageBtn = ({
  register,
  onFileChange,
  previewImage,
  buttonText,
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
      fileInputRef.current.value = ""; 
    }
    onFileChange(null, fileKey); 
  };

  return (
    <Grid
      sx={{ ...containerStyle }}
      item
      xs={12}
      md={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginBottom={"10px"}
    >
      {previewImage && (
        <Grid
          item
          sx={{
            ...previewStyle,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            width: "100%",
          }}
        >
          <img
            xs={12}
            md={6}
            src={previewImage}
            alt="Preview"
            style={{
              objectFit: "contain",
              width: "350px",
              height: "auto",
              maxWidth: "100%",
            }}
          />
          <Button
            variant="outlined"
            onClick={handleFileRemove}
            sx={{
              margin: "10px 0",
              backgroundColor: "#000",
              border: "none",
              color: "#fff",
              borderRadius: "0",
              "&:hover": { backgroundColor: "#c1121f", color: "#fff" },
              marginBottom: "10px",
            }}
          >
            Delete
          </Button>
        </Grid>
      )}
      <Grid item display={"flex"} width={"100%"} justifyContent={"center"}>
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
            width: "100%",
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
          }
        >
          <AttachFileIcon sx={{ marginRight: 1 }} />
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddImageBtn;
