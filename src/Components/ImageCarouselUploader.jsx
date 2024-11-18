import React, { useEffect, useState } from "react";
import { Button, Grid, Card, CardMedia, Checkbox } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ImageCarouselUploader = ({ article, onFilesChange, imageUrls = [] }) => {
  const [files, setFiles] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [imagesSelected, setImagesSelected] = useState(false);

  useEffect(() => {
    const initialFiles = imageUrls.map((url) => ({
      preview: url, // URL изображения
      file: null, // Это URL, а не локальный файл
    }));
    setFiles((prevFiles) => [
      ...prevFiles.filter((item) => item.file === null || item.file),
      ...initialFiles,
    ]);
    console.log("Initial Files:", initialFiles);
  }, [imageUrls]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("selectedFiles", selectedFiles);

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Создаем URL для превью
    }));

    // Добавляем новые файлы без вложенности
    setFiles((prevFiles) => {
      const updatedFiles = [
        ...prevFiles.filter((item) => item.file === null || item.file), // Убедимся, что не добавляем вложенные объекты
        ...newFiles,
      ];
      onFilesChange(updatedFiles);
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
      if (
        files[index] &&
        files[index].preview &&
        files[index].file instanceof Blob
      ) {
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
        {imagesSelected ? "Add Images" : "Upload Carousel Images"}
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

      <Grid container spacing={1}>
        {files.map((img, index) => (
          <Grid item xs={3} sm={2} md={2} key={index}>
            <Card
              style={{
                position: "relative",
                maxWidth: "100%",
              }}
            >
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
                    pointerEvents: "none",
                  }}
                />
              </div>
              <CardMedia
                sx={{
                  borderRadius: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                component="img"
                height="100%"
                image={
                  img.preview || (img.file && URL.createObjectURL(img.file))
                }
                alt={`Carousel ${index}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default ImageCarouselUploader;
