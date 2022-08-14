import React, { useState, useEffect } from "react";
import axios from "axios";
import { database, storage } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import UserProfile from "../Components/UserProfile.js";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  update,
  onChildChanged,
} from "firebase/database";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

const USERSTATS_FOLDER_NAME = "users";

const MainPage = (props) => {
  const currUser = props.currUser;
  const userRef = dbRef(database, `${USERSTATS_FOLDER_NAME}/${currUser}`);
  const [userStats, setUserStats] = useState({
    username: "",
    gamesPlayed: 0,
    gamesWon: 0,
    winRate: 0,
    mostUsed: "",
  });

  // During first sign up and log in, we need to upload user data and initialise the above stats into firebase database using set.

  // same as ComponentdidMount. Obtain user profile/stats from firebase database and set state for userStats. Pass the info to Userprofile.js to render. Only set once whenever the stats in firebase database are changed.
  useEffect(() => {
    onChildChanged(userRef, (data) => {
      if (data !== null) {
        setUserStats(() => {
          console.log(data.val);
          // gamesPlayed: data.val.
          // { key: data.key, val: data.val() }
        });
      }
    });
  }, []);

  const handleConfirmPokemon = (e) => {
    console.log(e);
  };

  const [playerArray, setPlayerArray] = useState([]);
  console.log(playerArray);

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

        //IGNORE THESE. JUST HERE FOR REFERENCE IF WE WANT TO DO THIS METHOD.
        // moves
        //   .filter((_, index) => index < 4)
        //   .forEach((move) => {
        //     fetchPokemonMove(move.move.url);
        //   });

        const newStats = {
          pokemonName: name,
          pokemonHP: pokemonHP,
          pokemonType: pokemonType,
          pokemonMoves: pokemonMoves,
          pokemonMovesURL: pokemonMovesURL,
          pokemonImageBack: pokemonImageBack,
          pokemonImageFront: pokemonImageFront,
        };

        const doesntContainObject = (obj, list) => {
          var i;
          for (i = 0; i < list.length; i++) {
            if (list[i].pokemonName === obj.pokemonName) {
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
  //IGNORE THESE. JUST HERE FOR REFERENCE IF WE WANT TO DO THIS METHOD.
  // const [pokemonMoveSet, setPokemonMoveSet] = useState([]);
  // const [pokemonFinalSet, setPokemonFinalSet] = useState([]);

  // const fetchPokemonMove = (url) => {
  //   axios.get(url).then((move) => {
  //     const { name, power } = move.data;
  //     const namePower = [name, power];
  //     const doesntContainMove = (obj, list) => {
  //       var i;
  //       for (i = 0; i < list.length; i++) {
  //         if (list[i][0] === obj[0]) {
  //           return false;
  //         }
  //       }

  //       return true;
  //     };

  //     if (doesntContainMove(namePower, pokemonMoveSet)) {
  //       setPokemonMoveSet([...pokemonMoveSet, namePower]);
  //     }
  //   });
  // };

  // pokemonSelection.map((pokemon) => {
  //   const movePower = [];
  //   let i = 0;
  //   while (i < 4) {
  //     let j = 0;
  //     while (j < pokemonMoveSet.length) {
  //       if (pokemonMoveSet[j][0] === pokemon.pokemonMoves[i]) {
  //         movePower.push(pokemonMoveSet[j][1]);
  //         break;
  //       }
  //       j++;
  //     }
  //     i++;
  //   }

  //   const newPokemonSet = {
  //     pokemonName: pokemon.pokemonName,
  //     pokemonHP: pokemon.pokemonHP,
  //     pokemonType: pokemon.pokemonType,
  //     pokemonMoves: pokemon.pokemonMoves,
  //     pokemonMovesPower: movePower,
  //     pokemonImageBack: pokemon.pokemonImageBack,
  //     pokemonImageFront: pokemon.pokemonImageFront,
  //   };

  //   const doesntContainObject = (obj, list) => {
  //     var i;
  //     for (i = 0; i < list.length; i++) {
  //       if (list[i].pokemonName === obj.pokemonName) {
  //         return false;
  //       }
  //     }

  //     return true;
  //   };

  //   if (
  //     pokemonFinalSet.length < 9 &&
  //     doesntContainObject(newPokemonSet, pokemonFinalSet) &&
  //     newPokemonSet.pokemonMovesPower.length === 4
  //   ) {
  //     setPokemonFinalSet([...pokemonFinalSet, newPokemonSet]);
  //   }
  //   return pokemonFinalSet;
  // });

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

  return (
    <div>
      {/* Mainpage will need to get currUser as props from App.js. App.js need to
      get profile from users -> user1 (identify by name?) 
                                user name: name @login 
                                games played: 
                                games won: 
                                win rate: 
                                mostUsed: 
                                chosenPokemon: object
                                currGameMoves: array 
                                gameHistory: array of objects. 
                                            [0]: Game 1 etc.
                                            
                             -> user2... */}
      <UserProfile currUser={props.currUser} userStats={userStats} />
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
    </div>
  );
};
export default MainPage;
