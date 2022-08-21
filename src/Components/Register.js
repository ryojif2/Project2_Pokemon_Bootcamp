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
import "../App.css";

const Register = (props) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  //1. handle inputs
  const handleInputChange = (event) => {
    if (event.target.name === "username") {
      props.setUsername(event.target.value);
    } else if (event.target.name === "emailInputValue") {
      props.setEmailInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      props.setPasswordInputValue(event.target.value);
    }
    console.log(props.emailInputValue);
  };

  //2. authenticate user portion
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
    console.log(props.emailInputValue);
  };

  //3. toggle
  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  //4. if press back will go back to homepage
  const logout = () => {
    console.log("back");
    signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <Typography>
        <h1>Register</h1>
        <Box component="form" sx={{ mt: 3 }} borderColor="primary.main">
          <Grid container spacing={2}>
            <br />
            <Grid item xs={12}>
              <span>Email: </span>
              <TextField
                type="email"
                name="emailInputValue"
                value={props.emailInputValue}
                onChange={handleInputChange}
                autoFocus
                sx={{
                  input: { color: "white" },
                }}
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
