import React, { useState } from "react";
import {
  Button,
  Grid,
  Card,
  CardMedia,
  Typography,
  Checkbox,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ImageCarouselUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [imagesSelected, setImagesSelected] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log(selectedFiles);
    
    const newFiles = selectedFiles.map((file) => ({
    
      file,
      preview: URL.createObjectURL(file),
     
    }));
    console.log("newFiles",newFiles);
  
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      onFilesChange(updatedFiles); // Передаем обновленные файлы в родительский компонент
      return updatedFiles;
    });
    setImagesSelected(true);
    e.target.value = null;
  };


  const handleSelectImage = (index) => {
    setSelectedIndexes((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleRemoveSelectedImages = () => {
    const newFiles = files.filter(
      (_, index) => !selectedIndexes.includes(index)
    );
    selectedIndexes.forEach((index) => {
      if (files[index] && files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }
    });
    setFiles(newFiles);
    setSelectedIndexes([]);

    setImagesSelected(newFiles.length > 0);
    onFilesChange(newFiles);
  };
  const handleSelectAllImages = () => {
    if (selectedIndexes.length === files.length) {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(files.map((_, index) => index));
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput-carouselImages"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        onClick={() =>
          document.getElementById("fileInput-carouselImages").click()
        }
        sx={{
          boxSizing: "border-box",
          marginBottom: "20px",
          color: "#fff",
          backgroundColor: "#000",
          borderRadius: "0",
          boxShadow: "none",
          width: "100%",
          height: imagesSelected ? "10hv" : "275px",
          overflow: "hidden",
          "&:hover": {
            outline: "1px solid #000",

            transition: "color 0.2s",
            backgroundColor: "#fff",
            boxShadow: "none",
            color: "#000",
          },
        }}
      >
        Upload Carousel Images
      </Button>

      {files.length > 0 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSelectAllImages}
          sx={{
            margin: "0 10px 10px 0",
            boxSizing: "border-box",
            marginRight: "10px",
            color: "#fff",
            backgroundColor: "#000",
            borderRadius: "0",
            boxShadow: "none",
            overflow: "hidden",
            "&:hover": {
              outline: "1px solid #000",
              transition: "color 0.2s",
              backgroundColor: "#fff",
              boxShadow: "none",
              color: "#000",
            },
          }}
        >
          {selectedIndexes.length === files.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      )}
      {selectedIndexes.length > 0 && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRemoveSelectedImages}
          sx={{
            margin: "0 10px 10px 0",
            color: "#fff",
            backgroundColor: "#000",
            borderRadius: "0",
            boxShadow: "none",
            overflow: "hidden",
            "&:hover": {
              outline: "1px solid #000",
              transition: "color 0.2s",
              backgroundColor: "#fff",
              boxShadow: "none",
              color: "#000",
            },
          }}
          startIcon={<DeleteIcon />}
        >
          Remove Selected Images
        </Button>
      )}

      <Grid container spacing={2}>
        {files.map((img, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
                onClick={() => handleSelectImage(index)}
              >
                <Checkbox
                  checked={selectedIndexes.includes(index)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <CardMedia
                sx={{
                  borderRadius: "0",
                }}
                component="img"
                height="140"
                image={img.preview}
                alt={`Carousel ${index}`}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                style={{ padding: "8px" }}
              >
                Image {index + 1}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default ImageCarouselUploader;
