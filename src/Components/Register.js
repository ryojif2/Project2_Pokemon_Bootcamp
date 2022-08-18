// import { auth } from "../DB/firebase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ref, set, getDatabase } from "firebase/database";

const Register = (props) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
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
      setIsNewUser(false);
      navigate("/mainpage");
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
          alert("You have not registered! Please register");
          console.error(error);

          // Return the user a graceful error message
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        props.emailInputValue,
        props.passwordInputValue
      )
        .then((userCredential) => {
          set(ref(db, "users/" + userCredential.user.uid), {
            username: username,
          });
        })
        .then(closeAuthForm)
        .catch((error) => {
          console.error(error);
          console.log(username);
          alert("You have registered! Please sign in");
        });
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      <Typography>
        <h1>Register</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <span>Name: </span>
              <TextField
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
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
          />
          <br />
          <Button variant="link" onClick={toggleNewOrReturningAuth}>
            {isNewUser
              ? "Already have an account? Sign in"
              : "If you are a new user, click here to create account"}
          </Button>
        </Box>
        <Button onClick={() => navigate("/")}>Go back</Button>
      </Typography>
    </div>
  );
};

export default Register;
