import { Button, Grid, Typography } from "@mui/material";
import React from "react";

const NotFound = () => {
  const returnHandler = () => {
    window.history.back();
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
      flexDirection={"column"}
    >
      <Typography variant="h4">
        Ops! It seems like this page doesn't exist
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={returnHandler}
      >
        Go back
      </Button>
    </Grid>
  );
};

export default NotFound;
