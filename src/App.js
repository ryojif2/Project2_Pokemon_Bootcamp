import { onAuthStateChanged, getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register";
import MainPage from "./Screens/MainPage";
import Login from "./Components/Login";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import { auth } from "../src/DB/firebase";
import SelectPoke from "./Components/SelectPoke";
import BattlePage from "./Components/BattlePage";
import Pokedex from "./Components/Pokedex";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [username, setUsername] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
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
      auth={auth}
      username={username}
      setUsername={setUsername}
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
      auth={auth}
    />
  );
  //Enter the Pokemon selection page
  const mainpage = (
    <MainPage
      loggedInUser={loggedInUser}
      auth={auth}
      setLoggedInUser={setLoggedInUser}
      username={username}
      setUserName={setUsername}
    />
  );

  const createAccountOrSignInButton = (
    <div>
      <button className="buttonR">
        <Link to="/register" className="buttonText">
          Create account
        </Link>
      </button>
      <br />
      <button className="buttonL">
        <Link to="/login" className="buttonText2">
          Login
        </Link>
      </button>
    </div>
  );

  //if user click registration, bring user to register
  //if user click login, bring user to login
  //else bring user to choosing page

  const choosingPage = loggedInUser ? mainpage : createAccountOrSignInButton;

  // useEffect(()=>{
  // },[])

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
            <Route
              path="/"
              element={
                loggedInUser ? (
                  <Navigate to="/mainpage/" />
                ) : (
                  createAccountOrSignInButton
                )
              }
            />
            <Route path="/register" element={register} />
            <Route path="/login" element={login} />
            <Route path="/mainpage/*" element={mainpage} />
            {/* <Route path="/pokedex" element={<Pokedex/>}/> */}
            {/* <Route path="/selectpokemon" element={<SelectPoke />} />
            <Route path="/battlepage" element={<BattlePage />} /> */}
          </Routes>
        </header>
        <br />
      </Typography>
    </div>
  );
};

export default App;
