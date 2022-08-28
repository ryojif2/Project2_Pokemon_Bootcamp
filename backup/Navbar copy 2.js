import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../src/DB/firebase";
import "../pokeball.css";
import UserProfile from "../src/Components/UserProfile";

const Navbar = (props) => {
  const {
    setEmailInputValue,
    setPasswordInputValue,
    loggedIn,
    setLoggedIn,
    setUserData,
    userData,
  } = props;

  let navigate = useNavigate();

  const logout = () => {
    setPasswordInputValue("");
    setEmailInputValue("");
    setLoggedIn(false);
    setUserData();
    navigate("/");
    signOut(auth);
  };

  //uncomment

  // const [isShown, setIsShown] = useState(false);

  // const handleClick = (event) => {
  //   setIsShown((current) => !current);
  // };

  //uncomment

  // useEffect(() => {
  //   if (isShown === true) {
  //     setTimeout(() => {
  //       setIsShown(false);
  //     }, 5000);
  //   }
  // }, [isShown]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "2C849C" }}>
        <Toolbar>
          {loggedIn === true ? (
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              style={{ background: "#ffff" }}
            >
              <UserProfile setUserData={setUserData} userData={userData} />
              {/* {isShown && (
                <div>
                  <UserProfile setUserData={setUserData} userData={userData} />
                </div>
              )} */}
            </IconButton>
          ) : null}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Hello {email.substr(0, email.indexOf("@"))} */}
            {/* {loggedIn !== true ? "Hello" : `Hello ${userData[0].username}`} */}
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
