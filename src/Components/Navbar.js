import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";
import "../pokeball.css";
import UserProfile from "../Components/UserProfile";

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
    setIsShown(false);
  };

  const [isShown, setIsShown] = useState(false);

  const handleClick = (event) => {
    setIsShown(true);
  };

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
              onClick={handleClick}
            >
              {isShown && (
                <div>
                  <UserProfile setUserData={setUserData} userData={userData} />
                </div>
              )}
            </IconButton>
          ) : null}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
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
