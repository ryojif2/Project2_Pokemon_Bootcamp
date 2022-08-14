import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../DB/firebase";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Login = (props) => {
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.name === "emailInputValue") {
      props.setEmailInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      props.setPasswordInputValue(event.target.value);
    }
  };

  //Upon submission, login the user
  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      props.setEmailInputValue("");
      props.setPasswordInputValue("");
    };

    signInWithEmailAndPassword(
      auth,
      props.emailInputValue,
      props.passwordInputValue
    )
      .then(closeAuthForm)
      .then(navigate("/"))
      .catch((error) => {
        alert("You have not registered! Please register");
        console.error(error);
        // Return the user a graceful error message
      });
  };

  return (
    <div>
      <Typography>
        <p>Sign in with this form to post.</p>
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
            value={"Sign In"}
            // Disable form submission if email or password are empty
            disabled={!props.emailInputValue || !props.passwordInputValue}
          />
          <br />
        </Box>
        <Button onClick={() => navigate(-1)}>go back</Button>
        <footer>
          <br />
          <br />
        </footer>
      </Typography>
    </div>
  );
};

export default Login;
