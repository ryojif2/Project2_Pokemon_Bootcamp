import React, { useState, useEffect } from "react";
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
import "../pokeball.css";
import UserProfile from "../Components/UserProfile";

const Navbar = (props) => {
  console.log(props);
  const {
    setEmailInputValue,
    setPasswordInputValue,
    loggedIn,
    setLoggedIn,
    loggedInUser,
    setLoggedInUser,
    emailInputValue,
  } = props;

  let navigate = useNavigate();
  var email = emailInputValue;

  const logout = () => {
    setPasswordInputValue("");
    setEmailInputValue("");
    setLoggedIn(false);
    navigate("/");
    signOut(auth);
  };

  const [isShown, setIsShown] = useState(false);

  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  useEffect(() => {
    if (isShown === true) {
      setTimeout(() => {
        setIsShown(false);
      }, 5000);
    }
  }, [isShown]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "2C849C" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            style={{ background: "#ffff" }}
            onClick={handleClick}
          >
            {isShown && (
              <div>
                <UserProfile />
              </div>
            )}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello {email.substr(0, email.indexOf("@"))}
          </Typography>
          {loggedIn === true ? (
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
