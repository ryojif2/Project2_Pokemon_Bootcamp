import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register";
import Choose from "./Components/Choose";
import { auth } from "./DB/firebase";
import Login from "./Components/Login";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setLoggedInUser(user);
        return;
      }
      // Else set logged-in user in state to null
      setLoggedInUser(null);
    });
  }, []);

  // Initialise components to render in variables for organisational purposes
  const register = (
    <Register
      emailInputValue={emailInputValue}
      setEmailInputValue={setEmailInputValue}
      passwordInputValue={passwordInputValue}
      setPasswordInputValue={setPasswordInputValue}
    />
  );
  const login = (
    <Login
      emailInputValue={emailInputValue}
      setEmailInputValue={setEmailInputValue}
      passwordInputValue={passwordInputValue}
      setPasswordInputValue={setPasswordInputValue}
      setLoggedInUser={setLoggedInUser}
      loggedInUser={loggedInUser}
    />
  );
  //Enter the Pokemon selection page
  const choose = <Choose loggedInUser={loggedInUser} />;

  const createAccountOrSignInButton = (
    <div>
      <button className="buttonR">
        <Link to="register">Create account</Link>
      </button>
      <br />
      <button className="buttonL" textDecoration="none">
        <Link to="login">Login</Link>
      </button>
    </div>
  );

  //if user click registration, bring user to register
  //if user click login, bring user to login
  //else bring user to choosing page
  const choosingPage = (
    <div>{loggedInUser ? choose : createAccountOrSignInButton}</div>
  );

  return (
    <div className="App">
      <Typography>
        <header className="App-header">
          <img
            src="https://www.freepnglogos.com/uploads/pokemon-logo-png-0.png"
            alt="Pokemon"
            height="400px"
            width="400px"
          />
          <Routes>
            <Route path="/" element={choosingPage} />
            <Route path="register" element={register} />
            <Route path="login" element={login} />
            <Route path="choose" element={choose} />
          </Routes>
        </header>
        <br />
      </Typography>
    </div>
  );
};

export default App;
