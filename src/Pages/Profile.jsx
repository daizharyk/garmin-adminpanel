import React, { useEffect, useRef, useState } from "react";
import PageWrapper from "../Common/PageWrapper";
import { TextField } from "@mui/material";

const Profile = () => {
  const [name, setName] = useState("");
  const errorDiv = useRef();

  const onChangeHandler = (event) => {
    if (event.target.value.length < 3) {
      errorDiv.current.style.display = "block";
    } else {
      errorDiv.current.style.display = "none";
    }
    setName(event.target.value);
  };

  useEffect(() => {
    console.log("dsdsadas5da");

    // const intervalId = setInterval(() => {
    //   console.log("Get data .......");
    // }, 500);

    return () => {
      // clearInterval(intervalId);
      console.log("E boy");
    };
  }, []);

  useEffect(() => {
    console.log("Component was updated");
  }, [name]);

  return (
    <PageWrapper variant={"filled"} title={"Profile"}>
      <TextField value={name} onChange={onChangeHandler} />
      <div style={{ display: "none" }} ref={errorDiv}>
        Too small name
      </div>
    </PageWrapper>
  );
};

export default Profile;
