import React, { useState } from "react";
import { Button } from "@mui/material";

const CloseButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        color: "#8d0801",
        minWidth: "auto",
        padding: "0",
        transition: "transform 0.3s",
        transform: hovered ? "rotate(90deg)" : "rotate(0deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
      }}
    >
      &#10006;
    </Button>
  );
};

export default CloseButton;
