import { CircularProgress, Grid } from "@mui/material";
import React from "react";

const Spinner = ({ size = 20, color = "#000" }) => {
  return (
    <Grid justifyContent={"center"} alignItems={"center"}>
      <Grid item>
      <CircularProgress size={size} sx={{ color: color }} />
      </Grid>
    </Grid>
  );
};

export default Spinner;
