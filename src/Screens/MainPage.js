import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
import { database, storage } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import BattlePage from "../Components/BattlePage";
import Results from "../Components/Results";
import UserProfile from "../Components/UserProfile";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  update,
  onChildChanged,
  child,
} from "firebase/database";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";

// const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";
const MainPage = (props) => {
  const [playerArray, setPlayerArray] = useState([]);
  const [computerArray, setComputerArray] = useState([]);
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
    navigate("selectpokemon").catch((error) => {
      console.log(error);
    });
  };

  //user press back to pokedex
  const handleReselectPokemon = (e) => {
    console.log("reselect navigate back");
    setCurrPokemon();
    navigate("/").catch((error) => {
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

  const [computerPokemonRefID, setComputerPokemonRefID] = useState("");
  const [playerPokemonRefID, setPlayerPokemonRefID] = useState("");

  const pushPlayerPokemonData = (
    playerPokemonData,
    computerPokemonData,
    playerArray,
    computerArray
  ) => {
    if (playerPokemonData && computerPokemonData && computerArray.length > 3) {
      console.log(playerPokemonData, "player poke data");
      console.log(computerPokemonData, "computer poke data");
      const playerRef = dbRef(database, PLAYER_POKEMON);
      const newPlayerRef = push(playerRef);

      const playerRefID = newPlayerRef.key;
      setPlayerPokemonRefID(playerRefID);

      set(newPlayerRef, {
        pokemonName: playerPokemonData.pokemonName,
        pokemonHP: playerPokemonData.pokemonHP,
        pokemonAttacks: playerArray,
      });
      const computerRef = dbRef(database, COMPUTER_POKEMON);
      const newComputerRef = push(computerRef);
      // const { key, val } = newComputerRef;
      const computerRefID = newComputerRef.key;
      setComputerPokemonRefID(computerRefID);
      set(newComputerRef, {
        pokemonName: computerPokemonData.pokemonName,
        pokemonHP: computerPokemonData.pokemonHP,
        pokemonAttacks: computerArray,
      });
    } else return;
  };

  useEffect(() => {
    if (
      // Object.keys(playerConfirmedPokemon).length !== 0 &&
      // Object.keys(computerConfirmedPokemon).length !== 0 &&
      computerArray.length > 3 &&
      playerArray.length > 3
    ) {
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
    // playerConfirmedPokemon,
    // computerConfirmedPokemon,
    playerArray,
    computerArray,
  ]);

  const handleConfirmPokemon = (confirmedPokemon) => {
    console.log(confirmedPokemon);
    //pass the confirmed pokemons to battlepage through state
    setPlayerConfirmedPokemon(confirmedPokemon);
    selectComputerPokemon(confirmedPokemon);
    navigate("battlepage");
    console.log("battle!");
  };

  const [playerTurn, setPlayerTurn] = useState();
  const [computerTurn, setComputerTurn] = useState();
  const [pastMoves, setPastMoves] = useState([]);
  const [recentMoves, setRecentMoves] = useState([]);

  const handleAttack = () => {
    console.log("this is running");
    if (playerTurn) {
      console.log("playerturn now");
      setComputerTurn(false);
      //ref player attack damage
      const playerAttack =
        playerArray[Math.floor(Math.random() * playerArray.length)];

      if (pastMoves === []) {
        setPastMoves([playerAttack]);
      } else {
        setPastMoves((prevState) => [...prevState, playerAttack]);
      }

      setRecentMoves([playerAttack]);

      let newComputerHP = 0;

      if (playerAttack - computerConfirmedPokemon.pokemonHP >= 0) {
        newComputerHP = 0;
      } else {
        newComputerHP = computerConfirmedPokemon.pokemonHP - playerAttack;
      }
      update(dbRef(database, COMPUTER_POKEMON + "/" + computerPokemonRefID), {
        pokemonHP: newComputerHP,
      });

      //ref computer DB and minus the HP
      //toggle to !PlayerTurn and auto call func again
      setPlayerTurn(false);

      if (newComputerHP > 0) {
        handleComputerAttack();
      } else {
        console.log("computer pokemon is dead");
      }
      // handleAttack();
    } else if (!playerTurn) {
      console.log("computerturn now");
      //ref computer attack damage
      //ref player DB and minus the HP
      //toggle to playerTurn
    }
  };

  const handleComputerAttack = () => {
    setPlayerTurn(false);
    setComputerTurn(true);
    console.log("yes myturn now");
    console.log(computerConfirmedPokemon);
    console.log(computerTurn);

    const computerAttack =
      computerArray[Math.floor(Math.random() * computerArray.length)];

    let newPlayerHP = 0;
    setPastMoves((prevState) => [...prevState, computerAttack]);
    setRecentMoves((prevState) => [...prevState, computerAttack]);
    if (computerAttack - playerConfirmedPokemon.pokemonHP >= 0) {
      newPlayerHP = 0;
    } else {
      newPlayerHP = playerConfirmedPokemon.pokemonHP - computerAttack;
    }
    update(dbRef(database, PLAYER_POKEMON + "/" + playerPokemonRefID), {
      pokemonHP: newPlayerHP,
    });

    if (newPlayerHP > 0) {
      setPlayerTurn(true);
    } else {
      console.log("player pokemon is dead");
    }
  };

  console.log(playerTurn);
  console.log(pastMoves);

  useEffect(() => {
    if (playerTurn) {
      console.log("playerTurn is true but onChildChanged is not running");
      const computerRef = dbRef(database, COMPUTER_POKEMON);
      onChildChanged(computerRef, (data) => {
        console.log(data.val());
        console.log("this is running3");
        const { pokemonHP } = data.val();

        const newComputerStats = {
          pokemonName: computerConfirmedPokemon.pokemonName,
          pokemonHP: pokemonHP,
          pokemonImageBack: computerConfirmedPokemon.pokemonImageBack,
          pokemonImageFront: computerConfirmedPokemon.pokemonImageFront,
        };

        setComputerConfirmedPokemon(newComputerStats);
        console.log("this is running2");
      });
    }

    if (computerTurn) {
      console.log("computer turn is running");
      const playerRef = dbRef(database, PLAYER_POKEMON);
      onChildChanged(playerRef, (data) => {
        console.log(data.val());
        console.log("this is running3");
        const { pokemonHP } = data.val();

        const newPlayerStats = {
          pokemonName: playerConfirmedPokemon.pokemonName,
          pokemonHP: pokemonHP,
          pokemonImageBack: playerConfirmedPokemon.pokemonImageBack,
          pokemonImageFront: playerConfirmedPokemon.pokemonImageFront,
        };

        setPlayerConfirmedPokemon(newPlayerStats);
        console.log("this is running2");
      });
    }
  }, [playerTurn, computerTurn]);

  console.log(computerConfirmedPokemon);

  const handleSummary = () => {
    navigate("results");
  };

  const handleNewBattle = () => {
    navigate("/");
  };

  const logout = () => {
    console.log("logout");
    props.setLoggedInUser(false);
    signOut(auth);
    navigate("/");
  };
  return (
    <div>
      <UserProfile />
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
              //just put pokemon directly here?
              selectedPokemon={pokemonSelection[currPokemon]}
              onConfirmPokemon={(confirmedPokemon) => {
                handleConfirmPokemon(confirmedPokemon);
                setPlayerTurn(true);
                setComputerTurn(true);
              }}
              onReselectPokemon={(e) => handleReselectPokemon(e)}
              setPlayerArray={(playerAttackArray) =>
                setPlayerArray(playerAttackArray)
              }
            />
          }
        />
        <Route
          path="/battlepage"
          element={
            <BattlePage
              playerConfirmedPokemon={playerConfirmedPokemon}
              computerConfirmedPokemon={computerConfirmedPokemon}
              onAttack={() => handleAttack()}
              isPlayerTurn={playerTurn}
              isComputerTurn={computerTurn}
              historyMoves={recentMoves}
              onSummary={() => handleSummary()}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              playerConfirmedPokemon={playerConfirmedPokemon}
              computerConfirmedPokemon={computerConfirmedPokemon}
              historyMoves={pastMoves}
              onNewBattle={handleNewBattle}
            />
          }
        />
      </Routes>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
export default MainPage;
