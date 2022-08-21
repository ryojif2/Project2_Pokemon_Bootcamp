import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";

const Navbar = (props) => {
  const {
    loggedInUser,
    setLoggedInUser,
    setCurrPage,
    emailInputValue,
    setEmailInputValue,
    setPasswordInputValue,
  } = props;
  console.log(emailInputValue);
  let navigate = useNavigate();

  // var user = emailInputValue.substr(0, emailInputValue.indexOf("@"));

  // if (loggedInUser === true) {
  //   var username = emailInputValue.substr(0, emailInputValue.indexOf("@"));
  // } else return;

  const logout = () => {
    console.log("logout");
    setLoggedInUser(false);
    signOut(auth);
    setCurrPage(false);
    navigate("/");
    setPasswordInputValue("");
    setEmailInputValue("");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#2E3B55" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            style={{ background: "#ffff" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello {emailInputValue.substr(0, emailInputValue.indexOf("@"))}
          </Typography>
          {loggedInUser === true ? (
            <Button color="inherit" onClick={() => logout()}>
              Logout
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Navbar;
