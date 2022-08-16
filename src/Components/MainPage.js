import React, { useState, useEffect } from "react";
import axios from "axios";
import { database } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import UserProfile from "../Components/UserProfile.js";
import { ref as dbRef, onChildChanged } from "firebase/database";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

const USERSTATS_FOLDER_NAME = "users";

const MainPage = (props) => {
  const currUser = props.nameInputValue;
  console.log("name", props.nameInputValue);
  const userRef = dbRef(database, `${USERSTATS_FOLDER_NAME}/${currUser}`);
  const [userStats, setUserStats] = useState({
    username: "",
    gamesPlayed: 0,
    gamesWon: 0,
    winRate: 0,
    mostUsed: "",
  });

  // During first sign up and log in, we need to upload user data and
  //initialise the above stats into firebase database using set.

  // same as ComponentdidMount.
  //Obtain user profile/stats from firebase database and
  //set state for userStats.
  //Pass the info to Userprofile.js to render.
  //Only set once whenever the stats in firebase database are changed.
  useEffect(() => {
    onChildChanged(userRef, (data) => {
      if (data !== null) {
        setUserStats(() => {
          console.log("Data.val", data.val);
        });
      }
    });
  }, []);

  const handleConfirmPokemon = (e) => {
    console.log(e);
  };

  const [playerArray, setPlayerArray] = useState([]);
  console.log("playerArray: ", playerArray);

  //Pokedex portion
  const [pokemonSelection, setPokemonSelection] = useState([]);

  useEffect(() => {
    const promises = [];
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/1"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/4"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/7"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/25"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/29"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/37"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/50"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/77"));
    promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/92"));
    console.log("promises", promises);

    Promise.all(promises).then((results) =>
      results.map((pokemonData) => {
        const { name, stats, types, sprites, moves } = pokemonData.data;
        const pokemonHP = Math.floor(
          ((stats[0].base_stat + 50) * 60) / 50 + 10
        );
        const pokemonType = types.map((element) => element.type.name);
        const pokemonImageBack = sprites.back_default;
        const pokemonImageFront = sprites.front_default;
        const pokemonMoves = moves.map((move) => move.move.name).slice(0, 4);
        const pokemonMovesURL = moves.map((move) => move.move.url).slice(0, 4);

        const newStats = {
          pokemonName: name,
          pokemonHP: pokemonHP,
          pokemonType: pokemonType,
          pokemonMoves: pokemonMoves,
          pokemonMovesURL: pokemonMovesURL,
          pokemonImageBack: pokemonImageBack,
          pokemonImageFront: pokemonImageFront,
        };
        console.log("newStats", newStats);

        const doesntContainObject = (obj, list) => {
          var i;
          for (i = 0; i < list.length; i++) {
            if (list[i].pokemonName === obj.pokemonName) {
              console.log("list", list[i]);
              console.log(obj);
              return false;
            }
          }

          return true;
        };

        if (
          pokemonSelection.length < 9 &&
          doesntContainObject(newStats, pokemonSelection)
        ) {
          setPokemonSelection([...pokemonSelection, newStats]);
        }
      })
    );
  }, [pokemonSelection]);

  let navigate = useNavigate();
  const [currPokemon, setCurrPokemon] = useState(0);
  const handleChoosePokemonClick = (e) => {
    setCurrPokemon(e.target.name);
    navigate("/selectpokemon").catch((error) => {
      console.log(error);
    });
  };

  const handleReselectPokemon = (e) => {
    setCurrPokemon();
    navigate("/").catch((error) => {
      console.log(error);
    });
  };

  const logout = () => {
    console.log("logout");
    props.setLoggedInUser(false);
    signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <UserProfile currUser={props.nameInputValue} userStats={userStats} />
      <br />
      <br />
      <Outlet />
      <Routes>
        <Route
          path="/"
          element={
            <Pokedex
              pokemonSelection={pokemonSelection}
              onChoosePokemonClick={(e) => handleChoosePokemonClick(e)}
              // onSubmit={(e, pokemonData) => handleSubmit(e, pokemonData)}
            />
          }
        />
        <Route
          path="/selectpokemon"
          element={
            <SelectPoke
              selectedPokemon={pokemonSelection[currPokemon]}
              onConfirmPokemon={(e) => handleConfirmPokemon(e)}
              onReselectPokemon={(e) => handleReselectPokemon(e)}
              setPlayerArray={(playerAttackArray) =>
                setPlayerArray(playerAttackArray)
              }
            />
          }
        />
      </Routes>

      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
export default MainPage;
