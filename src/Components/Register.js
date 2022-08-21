// import { auth } from "../DB/firebase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { database } from "../DB/firebase";
import { ref as dbRef, set, getDatabase, child } from "firebase/database";

//Define userStats folder in realtime database.
const USERSTATS_FOLDER_NAME = "users";

const Register = (props) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  // const db = getDatabase();
  const handleInputChange = (event) => {
    if (event.target.name === "emailInputValue") {
      props.setEmailInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      props.setPasswordInputValue(event.target.value);
    } else if (event.target.name === "username") {
      props.setUsername(event.target.value);
    }
  };

  //User stats for each user are created upon account registration.
  //Set email as ID in the database for each user, instead of the default randomly generated ID. This is so that we can identify which user folder to update whenever the stats change during game or after game.
  //Initiate the user stats in database.
  const pushUserData = (email, username) => {
    const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");
    const userDataRef = dbRef(database, USERSTATS_FOLDER_NAME);
    const newUserDataRef = child(userDataRef, emailWoSpecialChar);

    set(newUserDataRef, {
      email: emailWoSpecialChar,
      username: username,
      gamesPlayed: 0,
      gamesWon: 0,
      usedPokemon: [],
      mostUsed: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      props.setEmailInputValue("");
      props.setPasswordInputValue("");
      setIsNewUser(false);
    };

    // Authenticate user on submit
    if (isNewUser) {
      createUserWithEmailAndPassword(
        auth,
        props.emailInputValue,
        props.passwordInputValue
      )
        .then(pushUserData(props.emailInputValue, props.username))
        .then(closeAuthForm)
        .catch((error) => {
          console.error(error);
          alert("You have registered! Please sign in");
          // Return the user a graceful error message
        })
        .then(navigate("/login"));
    } else {
      signInWithEmailAndPassword(
        auth,
        props.emailInputValue,
        props.passwordInputValue
      )
        .then(closeAuthForm)
        .then(navigate("/mainpage"))
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  const logout = () => {
    console.log("back");
    signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <Typography>
        <h1>Register</h1>
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <span>Name: </span>
              <TextField
                // placeholder="username"
                name="username"
                value={props.username}
                onChange={handleInputChange}
                autoFocus
                sx={{ input: { color: "white" } }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <span>Email: </span>
              <TextField
                type="email"
                name="emailInputValue"
                value={props.emailInputValue}
                onChange={handleInputChange}
                autoFocus
                sx={{ input: { color: "white" } }}
              />
            </Grid>
            <br />
            <Grid item xs={12}>
              <span>Password: </span>
              <TextField
                type="password"
                name="passwordInputValue"
                value={props.passwordInputValue}
                onChange={handleInputChange}
                autoFocus
                sx={{ input: { color: "white" } }}
              />
            </Grid>
          </Grid>
          <br />
          <input
            type="submit"
            value={isNewUser ? "Create Account" : "Sign In"}
            // Disable form submission if email or password are empty
            disabled={!props.emailInputValue || !props.passwordInputValue}
            onClick={handleSubmit}
            onClick={handleSubmit}
          />
          <br />
          <Button variant="link" onClick={toggleNewOrReturningAuth}>
            {isNewUser
              ? "Already have an account? Sign in"
              : "If you are a new user, click here to create account"}
          </Button>
        </Box>
        <Button onClick={() => logout()}>Go back</Button>
      </Typography>
    </div>
  );
};

export default Register;
