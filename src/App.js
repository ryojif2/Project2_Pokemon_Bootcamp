import { onAuthStateChanged, getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register";
import MainPage from "./Screens/MainPage";
import Login from "./Components/Login";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import { auth } from "../src/DB/firebase";
// import SelectPoke from "./Components/SelectPoke";
// import BattlePage from "./Components/BattlePage";
// import Pokedex from "./Components/Pokedex";
import Navbar from "./Components/Navbar";
import Loginsound from "../src/Sounds/opening.mp3";
import button from "../src/Sounds/button.mp3";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [username, setUsername] = useState();
  const [userEmail, setUserEmail] = useState("");
  const [buttonSound, setButtonSound] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setLoggedInUser(true);
        setUsername(user);
        return;
      }
      // Else set logged-in user in state to null
      setLoggedInUser(null);
    });
  }, [auth]);

  // Initialise components to render in variables for organisational purposes
  const register = (
    <Register
      emailInputValue={emailInputValue}
      setEmailInputValue={setEmailInputValue}
      passwordInputValue={passwordInputValue}
      setPasswordInputValue={setPasswordInputValue}
      auth={auth}
      username={username}
      setUserName={setUsername}
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
      userEmail={userEmail}
    />
  );

  //Audio upon pressing button
  const buttonPress = () => {
    setButtonSound(true);
    console.log("pew");
  };

  const createAccountOrSignInButton = (
    <div>
      <button className="buttonR" onClick={() => buttonPress()}>
        <Link to="/register" className="buttonText" TransitionComponent="Grow">
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

  useEffect(() => {
    if (buttonSound !== false) {
      setTimeout(() => {
        setButtonSound(false);
      }, 2000);
    }
  }, [buttonSound]);

  return (
    <div className="App">
      {buttonSound === true ? (
        <audio autoPlay src={button}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <Navbar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        emailInputValue={emailInputValue}
        userEmail={userEmail}
        username={username}
        setEmailInputValue={setEmailInputValue}
        setPasswordInputValue={setPasswordInputValue}
      />
      {/* {loggedInUser !== true ? (
        <audio loop autoPlay src={Loginsound}>
          Your browser does not support the audio element.
        </audio>
      ) : null} */}

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
                // loggedInUser ? (
                //   <Navigate to="/mainpage" />
                // ) : (
                createAccountOrSignInButton
                // )
              }
            />
            <Route path="/register" element={register} />
            <Route path="/login" element={login} />
            <Route path="/mainpage/*" element={mainpage} />
          </Routes>
          {/* <Route path="/selectpokemon" element={<SelectPoke />} />
            <Route path="/battlepage" element={<BattlePage />} /> */}
        </header>
        <br />
      </Typography>
    </div>
  );
};

export default App;
