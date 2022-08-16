import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../DB/firebase";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Register = (props) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.name === "emailInputValue") {
      props.setEmailInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      props.setPasswordInputValue(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      props.setEmailInputValue("");
      props.setPasswordInputValue("");
      setIsNewUser(true);
      navigate("/");
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
          alert("You have registered! Please login");
          console.error(error);
          // Return the user a graceful error message
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        props.emailInputValue,
        props.passwordInputValue
      )
        .then(closeAuthForm)
        .catch((error) => {
          console.error(error);
          alert("You have not registered! Please register or sign in");
          // Return the user a graceful error message
        });
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      <Typography>
        <p>Register</p>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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
          />
          <br />
          <Button variant="link" onClick={toggleNewOrReturningAuth}>
            {isNewUser
              ? "Already have an account? Sign in"
              : "If you are a new user, click here to create account"}
          </Button>
        </Box>
        <Button onClick={() => navigate("/")}>Go back</Button>
        <footer>
          <br />
        </footer>
      </Typography>
    </div>
  );
};

export default Register;
