import { Grid, Typography } from "@mui/material";

const PageWrapper = ({ title, children }) => {
  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={4}>
      <Grid item container justifyContent={"center"}>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      <Grid container  justifyContent={"center"} alignItems={"center"} item>
        {children}
      </Grid>
    </Grid>
  );
};

export default PageWrapper;
