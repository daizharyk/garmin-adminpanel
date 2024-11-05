import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Grid, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translate(0, -50%)",

        zIndex: 1,
        color: "#000",

        borderRadius: 0,
        height: "70px",
        width: "20px",
      
      }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translate(0, -50%)",

        zIndex: 1,
        color: "#000",

        borderRadius: 0,
        height: "70px",
        width: "20px",
      }}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
};

const ImageCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mainSliderRef = useRef(null);
  const thumbnailSliderRef = useRef(null);

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    asNavFor: thumbnailSliderRef.current,
    beforeChange: (current, next) => setCurrentImageIndex(next),
  };

  const thumbnailSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    focusOnSelect: true,
    asNavFor: mainSliderRef.current,
    arrows: false,
    beforeChange: (current, next) => {
      mainSliderRef.current.slickGoTo(next);
    },
  };
  useEffect(() => {
    if (mainSliderRef.current && thumbnailSliderRef.current) {
      mainSettings.asNavFor = thumbnailSliderRef.current;
      thumbnailSettings.asNavFor = mainSliderRef.current;
    }
  }, [mainSliderRef, thumbnailSliderRef]);
  return (
    <Grid
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid>
        <Slider ref={mainSliderRef} {...mainSettings}>
          {images.map((image, index) => (
            <Box
              component="img"
              src={image}
              alt={`Slide ${index}`}
              key={index}
              sx={{
                height: "auto",
                borderRadius: 2,
              }}
            />
          ))}
        </Slider>
      </Grid>

      <Grid>
        <Slider ref={thumbnailSliderRef} {...thumbnailSettings}>
          {images.map((image, index) => (
            <Grid
              component="img"
              src={image}
              alt={`Thumbnail ${index}`}
              key={index}
              sx={{
                width: "71px !important ", // Размер миниатюры
                height: "auto",
                padding: "0",
                cursor: "pointer",
                border:
                  currentImageIndex === index
                    ? "2px solid #333"
                    : "2px solid #ccc",
                borderRadius: 0,
                marginBottom: 1,
                "&:hover": {
                  border: "2px solid #333",
                  borderRadius: 0,
                },
              }}
            />
          ))}
        </Slider>
      </Grid>
    </Grid>
  );
};

export default ImageCarousel;
