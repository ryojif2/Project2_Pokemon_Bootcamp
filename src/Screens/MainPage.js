import React, { useState, useEffect } from "react";
import axios from "axios";
// import { auth } from "../DB/firebase";
// import Button from "@mui/material/Button";
import { database } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import BattlePage from "../Components/BattlePage";
import UserProfile from "../Components/UserProfile";
import { push, ref as dbRef, set } from "firebase/database";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import gym from "../Sounds/gym.mp3";

// const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";
const MainPage = (props) => {
  const [playerArray, setPlayerArray] = useState([]);
  const [computerArray, setComputerArray] = useState([]);
  const [battle, setBattle] = useState(false);
  const { userEmail } = props;

  //determine if next page is selected
  const [nextPage, setNextPage] = useState(false);
  //   [10,20,30,40]
  //  playerAttack=playerArray[math.random()*playerArray.length]
  const [playerConfirmedPokemon, setPlayerConfirmedPokemon] = useState({});
  const [computerConfirmedPokemon, setComputerConfirmedPokemon] = useState({});
  //Pokedex portion, generate 9 chosen pokemon from their URL
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
      //map each pokemon result into a stats object
      results.map((pokemonData) => {
        //destructure from data
        const { name, stats, types, sprites, moves } = pokemonData.data;
        //HP based on level 60 bc level 1 is too low
        const pokemonHP = Math.floor(
          ((stats[0].base_stat + 50) * 60) / 50 + 10
        );
        //extracting the data out according to structure
        const pokemonType = types.map((element) => element.type.name);
        const pokemonImageBack = sprites.back_default;
        const pokemonImageFront = sprites.front_default;
        const pokemonImage = sprites.other.dream_world.front_default;
        //extracting first 4 moves
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
          pokemonImage: pokemonImage,
        };

        //if 9 chosen pokemon url is unique, is this redundant?
        //checking to make sure newStats to be placed is not inside already
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

  //when pokemon selected
  let navigate = useNavigate();
  const [currPokemon, setCurrPokemon] = useState(0);
  const handleChoosePokemonClick = (e) => {
    setCurrPokemon(e.target.name);
    console.log(e.target.name, "e.target.name name of pokemon");
    // console.log(pokemon,",data of pokemon")
    console.log("navigate to select pokemon");
    setNextPage(true);
    navigate("selectpokemon").catch((error) => {
      console.log(error);
    });
  };

  //user press back to pokedex
  const handleReselectPokemon = (e) => {
    console.log("reselect navigate back");
    setCurrPokemon();
    setNextPage(false);
    navigate("/mainpage").catch((error) => {
      console.log(error);
    });
  };

  //math random for computer pokemon
  const selectComputerPokemon = (playerPokemon) => {
    for (let i = 0; i < pokemonSelection.length; i++) {
      if (pokemonSelection[i].pokemonName === playerPokemon.pokemonName) {
        pokemonSelection.splice(i, 1);
      }
    }
    const computerPokemon = pokemonSelection[Math.floor(Math.random() * 8 + 1)];
    setComputerConfirmedPokemon(computerPokemon);
    getComputerArray(computerPokemon.pokemonMovesURL);
  };

  //async and await the axios request
  // let data = axios.get(url)
  //promise

  const getComputerArray = (pokemonMovesURL) => {
    const [move1, move2, move3, move4] = pokemonMovesURL;

    const promise2 = [];
    promise2.push(axios.get(move1));
    promise2.push(axios.get(move2));
    promise2.push(axios.get(move3));
    promise2.push(axios.get(move4));

    Promise.all(promise2)
      .then((results) => {
        const powerMoves = results.map((data) => {
          let { power } = data.data;
          if (power == null) {
            power = 1;
          }
          console.log(power);
          return power;
        });
        console.log(powerMoves);
        return powerMoves;
      })
      .then((powerMoves) => setComputerArray(powerMoves));
  };

  const pushPlayerPokemonData = (
    playerPokemonData,
    computerPokemonData,
    playerArray,
    computerArray
  ) => {
    console.log(
      playerPokemonData && computerPokemonData && computerArray.length > 3
    );
    if (playerPokemonData && computerPokemonData && computerArray.length > 3) {
      console.log(playerPokemonData, "player poke data");
      console.log(computerPokemonData, "computer poke data");

      const playerRef = dbRef(database, PLAYER_POKEMON);
      const newPlayerRef = push(playerRef);
      set(newPlayerRef, {
        pokemonName: playerPokemonData.pokemonName,
        pokemonHP: playerPokemonData.pokemonHP,
        pokemonAttacks: playerArray,
      });

      const computerRef = dbRef(database, COMPUTER_POKEMON);
      const newComputerRef = push(computerRef);
      set(newComputerRef, {
        pokemonName: computerPokemonData.pokemonName,
        pokemonHP: computerPokemonData.pokemonHP,
        pokemonAttacks: computerArray,
      });
    } else return;
  };

  useEffect(() => {
    if (
      Object.keys(playerConfirmedPokemon).length !== 0 &&
      Object.keys(computerConfirmedPokemon).length !== 0 &&
      computerArray.length > 3 &&
      playerArray.length > 3
    ) {
      //  if(playerConfirmedPokemon  && computerArray && computerConfirmedPokemon)
      console.log("hiiii! player and comp cfm pokemon");
      console.log(playerConfirmedPokemon, playerArray);
      console.log("COMP CFM POKEMON USE EFFECT", computerConfirmedPokemon);
      console.log(" USE EFFECT computer array", computerArray);
      pushPlayerPokemonData(
        playerConfirmedPokemon,
        computerConfirmedPokemon,
        playerArray,
        computerArray
      );
    }
  }, [
    playerConfirmedPokemon,
    computerConfirmedPokemon,
    playerArray,
    computerArray,
  ]);

  const handleConfirmPokemon = (confirmedPokemon) => {
    console.log(confirmedPokemon);
    //pass the confirmed pokemons to battlepage through state
    setPlayerConfirmedPokemon(confirmedPokemon);
    selectComputerPokemon(confirmedPokemon);
    setBattle(true);
    navigate("battlepage");
    console.log("battle!");
  };

  return (
    <div>
      <UserProfile userEmail={userEmail} battle={battle} />
      <br />
      <br />
      {/* {nextPage !== true ? (
        <audio loop autoPlay src={gym}>
          Your browser does not support the audio element.
        </audio>
      ) : null} */}
      <Outlet />
      <Routes>
        <Route
          path="/"
          element={
            <Pokedex
              pokemonSelection={pokemonSelection}
              onChoosePokemonClick={(e) => handleChoosePokemonClick(e)}
            />
          }
        />
        <Route
          path="/selectpokemon"
          element={
            <SelectPoke
              //just put pokemon directly here?
              selectedPokemon={pokemonSelection[currPokemon]}
              pokemonSelection={pokemonSelection}
              onConfirmPokemon={(confirmedPokemon) =>
                handleConfirmPokemon(confirmedPokemon)
              }
              onReselectPokemon={(e) => handleReselectPokemon(e)}
              setPlayerArray={(playerAttackArray) =>
                setPlayerArray(playerAttackArray)
              }
              nextPage={nextPage}
              setNextPage={setNextPage}
            />
          }
        />
        <Route
          path="/battlepage"
          element={
            <BattlePage
              playerConfirmedPokemon={playerConfirmedPokemon}
              computerConfirmedPokemon={computerConfirmedPokemon}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default MainPage;
