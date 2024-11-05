import React, { useState } from "react";
import PageWrapper from "../../Common/PageWrapper";
import { Button, Grid, Typography } from "@mui/material";
import Register from "./Register";
import Login from "./Login";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthWrapper = () => {
  const [type, setType] = useState("login");

  const typeChangeHandler = () => {
    setType((prev) => (prev === "login" ? "register" : "login"));
  };

  const user = useSelector((state) => state.auth.user);

  if(user){
    return <Navigate replace to="/"/>
  }

  return (
    <PageWrapper title={type === "login" ? "Login" : "Register"}>
      <Grid
        container
        item
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        spacing={4}
        xs={12}
        md={6}
        lg={4}
      >
        <Grid item width={"100%"}>
          {type === "login" ? <Login /> : <Register />}
        </Grid>
        <Grid container item flexDirection={"column"} alignItems={"center"}>
          <Grid item>
            <Typography variant="body2">
              {type === "login"
                ? "Don't have an account?"
                : "Already have an account"}
            </Typography>
          </Grid>
          <Grid item>
            <Button onClick={typeChangeHandler}>
              {type === "login" ? "Register" : "Login"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default AuthWrapper;
