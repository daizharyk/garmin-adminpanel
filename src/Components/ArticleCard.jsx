import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  createTheme,
  Typography,
} from "@mui/material";
import React from "react";
import "../../src/styles.css";
import { Link } from "react-router-dom";

const them = createTheme({
  palette: {
    primary: {
      main: "#fff",
      light: "#669bbc",
      dark: "#003049",
      contrastText: "#000",
    },
    secondary: {
      main: "#669bbc",
    },
  },
});
const ArticleCard = ({_id, name, text, image, price, status }) => {
  const baseImageUrl = "https://i.ibb.co.com/";
  return (
    <Card
      sx={{
        borderRadius: "0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component={"img"}
        alt={name}
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "250px",
          objectFit: "contain",
          overflow: "hidden",
        }}
        image={`${baseImageUrl}/${image}`}
        title={name}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography sx={{ padding: "10px 0" }} variant="h5" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
          {text}
        </Typography>
        <Typography sx={{ padding: "10px 0" }} variant="h6" color="primary">
          ${price}
        </Typography>
        {status && (
          <Typography
            sx={{
              backgroundColor: status.includes("Sale") ? "#e5383b" : "#f5cb5c",
              width: "fit-content",
              padding: "4px 8px",
              color: status.includes("Sale") ? "#fff" :"#000",
            }}
            variant="body2"
            color="secondary"
          >
            {status}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button component={Link} to={`/article/${_id}`}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            border: "1px solid #000",
            borderRadius: "0",
            width: "100%",
            padding: " 10px 20px",
            "&:hover": {
              backgroundColor: "#212529",
              color: "#fff",
            },
          }}
          size="small"
        >
          Read
        </Button>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
