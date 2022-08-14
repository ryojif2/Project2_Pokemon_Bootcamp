import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function Choose() {
  const navigate = useNavigate();

  const logout = () => {
    console.log("logout");
    signOut(auth);
  };

  return (
    <div>
      <Typography>
        CONTENT HERE
        <br />
        POKEMON SELECTION
        <br />
        <Button onClick={() => navigate(-1)}>go back</Button>
        <br />
        <Button onClick={() => logout()}>Logout</Button>
      </Typography>
    </div>
  );
}

export default Choose;
