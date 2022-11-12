import { onAuthStateChanged, getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import "./pikachu.css";
import Register from "./Components/Register";
import MainPage from "./Screens/MainPage";
import Login from "./Components/Login";
import Typography from "@mui/material/Typography";
import Navbar from "./Components/Navbar";
import Loginsound from "../src/Sounds/opening.mp3";
import click from "../src/Sounds/click.mp3";
import charizard from "../src/pics/charizard.gif";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [buttonSound, setButtonSound] = useState(false);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState();
  const [pokemonSelection, setPokemonSelection] = useState([]);

  const auth = getAuth();

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
      setLoggedIn={setLoggedIn}
      loggedIn={loggedIn}
    />
  );
  //Enter the Pokemon selection page
  const mainpage = (
    <MainPage
      auth={auth}
      loggedInUser={loggedInUser}
      setLoggedInUser={setLoggedInUser}
      setLoggedIn={setLoggedIn}
      loggedIn={loggedIn}
      emailInputValue={emailInputValue}
      username={username}
      setUsername={setUsername}
      setUserData={setUserData}
      userData={userData}
      setPokemonSelection={setPokemonSelection}
      pokemonSelection={pokemonSelection}
    />
  );

  //Audio upon pressing button
  const buttonPress = () => {
    setButtonSound(true);
  };

  useEffect(() => {
    if (buttonSound !== false) {
      setTimeout(() => {
        setButtonSound(false);
      }, 1000);
    }
  }, [buttonSound]);

  const createAccountOrSignInButton = (
    <div>
      <button className="buttonR" onClick={() => buttonPress()}>
        <Link to="/register" className="buttonText">
          Create account
        </Link>
      </button>
      <br />

      <button className="buttonL" onClick={() => buttonPress()}>
        <Link to="/login" className="buttonText2">
          Login
        </Link>
      </button>
    </div>
  );

  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {buttonSound === true ? (
        <audio autoPlay src={click}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <Navbar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setLoggedIn={setLoggedIn}
        loggedIn={loggedIn}
        emailInputValue={emailInputValue}
        setEmailInputValue={setEmailInputValue}
        setPasswordInputValue={setPasswordInputValue}
        username={username}
        setUserData={setUserData}
        userData={userData}
      />
      {loggedIn !== true ? (
        <div className="charizard">
          <img alt="charizard" src={charizard} />
        </div>
      ) : null}
      {loggedIn !== true ? (
        <audio loop autoPlay src={Loginsound}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <Typography>
        <header className="App-header">
          {loggedIn === true ? null : (
            <img
              src="https://www.freepnglogos.com/uploads/pokemon-logo-png-0.png"
              alt="Pokemon"
              height="250px"
              className="pokemonImg"
            />
          )}
          <Routes>
            <Route path="/" element={createAccountOrSignInButton} />
            <Route path="/register" element={register} />
            <Route path="/login" element={login} />
            <Route path="/mainpage/*" element={mainpage} />
          </Routes>
        </header>
        {loggedIn !== true ? (
          <div class="pikachu">
            <img
              alt="pikachu"
              src="https://www.pkparaiso.com/imagenes/xy/sprites/animados/pikachu-5.gif"
            />
          </div>
        ) : null}
      </Typography>
    </div>
  );
};

export default App;
