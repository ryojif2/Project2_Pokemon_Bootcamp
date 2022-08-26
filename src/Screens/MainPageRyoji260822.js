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
  onValue,
} from "firebase/database";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";

const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";
const MainPage = (props) => {
  console.log(props.loggedInUser);

  //Initialise state for userStats of each player. This is for userProfile.js.
  const [userStats, setUserStats] = useState({});

  //After initial rendering, get a snapshot of the current user stats from the realtime database. Set as the data for userStats state.
  useEffect(() => {
    if (props.loggedInUser) {
      const { email } = props.loggedInUser;
      console.log(email);
      const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");

      const userDataRef = dbRef(
        database,
        USERSTATS_FOLDER_NAME + "/" + emailWoSpecialChar
      );
      onValue(userDataRef, (data) => {
        console.log(data.val());
        setUserStats(data.val());
      });
    }
  }, [props.loggedInUser]);

  console.log(userStats);

  const [playerArray, setPlayerArray] = useState([]);
  const [computerArray, setComputerArray] = useState([]);
  const [playerStrongType, setPlayerStrongType] = useState([]);
  const [playerWeakType, setPlayerWeakType] = useState([]);
  //   [10,20,30,40]
  //   [attack1: 10, attack2: 20, attack3: 30, attack4: 40]
  //  playerAttack=playerArray[math.random()*playerArray.length]
  const [playerConfirmedPokemon, setPlayerConfirmedPokemon] = useState({});
  const [computerConfirmedPokemon, setComputerConfirmedPokemon] = useState({});
  //Pokedex portion, generate 9 chosen pokemon from their URL
  const [pokemonSelection, setPokemonSelection] = useState([]);
  useEffect(() => {
    const promises = [];

    for (let i = 1; i <= 20; i++) {
      promises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }

    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/1"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/4"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/7"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/25"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/29"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/37"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/50"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/77"));
    // promises.push(axios.get("https://pokeapi.co/api/v2/pokemon/92"));

    Promise.all(promises).then((results) =>
      //map each pokemon result into a stats object
      results.map((pokemonData) => {
        //destructure from data
        const { name, stats, types, sprites, moves } = pokemonData.data;
        //HP based on level 60 bc level 1 is too low
        const pokemonHP = Math.floor(
          ((stats[0].base_stat + 50) * 60) / 50 + 10
        );
        // const pokemonSpeed = stats[5].base_stat;
        //extracting the data out according to structure
        const pokemonType = types.map((element) => element.type.name);
        const pokemonTypeURL = types.map((element) => element.type.url);
        const pokemonImageBack = sprites.back_default;
        const pokemonImageFront = sprites.front_default;
        //extracting first 4 moves
        let pokemonMoves;
        let pokemonMovesURL;
        if (moves.length >= 20) {
          pokemonMoves = moves.map((move) => move.move.name).slice(15, 19);
          pokemonMovesURL = moves.map((move) => move.move.url).slice(15, 19);
        } else {
          pokemonMoves = moves.map((move) => move.move.name).slice(0, 4);
          pokemonMovesURL = moves.map((move) => move.move.url).slice(0, 4);
        }
        const newStats = {
          pokemonName: name,
          pokemonHP: pokemonHP,
          pokemonType: pokemonType,
          pokemonTypeURL: pokemonTypeURL,
          // pokemonSpeed: pokemonSpeed,
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
          // pokemonSelection.length < 9 &&
          pokemonSelection.length < 20 &&
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
    const computerPokemon =
      pokemonSelection[
        //Math.floor(Math.random() * 8 + 1)
        Math.floor(Math.random() * (pokemonSelection.length - 1) + 1)
      ];
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
          let { name, power } = data.data;
          if (power == null) {
            power = 1;
          }
          console.log(power);
          // return {power}
          const movesWithPower = {
            name: name,
            power: power,
          };

          return movesWithPower;
        });
        console.log(powerMoves);
        return powerMoves;
      })
      .then((powerMoves) => setComputerArray(powerMoves));
  };

  //   Promise.all(promise2)
  //     .then((results) => {
  //       const powerMoves = results.map((data) => {
  //         let { power } = data.data;
  //         if (power == null) {
  //           power = 1;
  //         }
  //         console.log(power);
  //         return power;
  //       });
  //       console.log(powerMoves);
  //       return powerMoves;
  //     })
  //     .then((powerMoves) => setComputerArray(powerMoves));
  // };

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

    //When User clicks select pokemon, update the usedPokemon data within the realtime database. This is needed to calculate out most used pokemon for the user.
    if (userStats.usedPokemon && userStats.usedPokemon.length !== 0) {
      update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
        usedPokemon: [...userStats.usedPokemon, confirmedPokemon.pokemonName],
      });
    } else {
      update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
        usedPokemon: [confirmedPokemon.pokemonName],
      });
    }

    navigate("battlepage");
    console.log("battle!");
  };

  const [playerTurn, setPlayerTurn] = useState();
  const [computerTurn, setComputerTurn] = useState();
  //pastMoves is to record the entire history of the battle.
  const [pastMoves, setPastMoves] = useState([]);
  //recentMoves is to record only the moves of each turn. Player turn and computer turn. This is to render on the battlepage the 2 attacks that happened.
  const [recentMoves, setRecentMoves] = useState([]);

  //Helper function for finding the most used pokemon of each user based on usedPokemon array. This is run in useEffect.
  const findMostUsed = (usedPokemon) => {
    const tally = {};
    for (const pokemon of usedPokemon) {
      tally[pokemon] ? tally[pokemon]++ : (tally[pokemon] = 1);
    }

    let maxFreq = 0;
    let mostUsedPokemon;

    Object.keys(tally).forEach((pokemon) => {
      if (tally[pokemon] > maxFreq) {
        maxFreq = tally[pokemon];
        mostUsedPokemon = pokemon;
      }
    });

    return mostUsedPokemon;
  };

  //Set states to render effective/not effective statements in battlepage
  const [isPlayerStrong, setIsPlayerStrong] = useState(false);
  const [isComputerStrong, setIsComputerStrong] = useState(false);

  //When User clicks attack in battle page. Playerturn state is already true.
  const handleAttack = (e) => {
    console.log("this is running");
    if (playerTurn) {
      console.log("playerturn now");
      // Set the computerturn state to false.
      setComputerTurn(false);
      //ref player attack damage

      let critMultiplier = 1;
      if (
        computerConfirmedPokemon.pokemonType.length === 2 &&
        (playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !==
          -1 ||
          playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[1]) !==
            -1)
      ) {
        critMultiplier = 1.5;
      } else if (
        computerConfirmedPokemon.pokemonType.length === 1 &&
        playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !== -1
      ) {
        critMultiplier = 1.5;
      } else if (
        computerConfirmedPokemon.pokemonType.length === 2 &&
        (playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[0]) !==
          -1 ||
          playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[1]) !==
            -1)
      ) {
        critMultiplier = 0.5;
      } else if (
        computerConfirmedPokemon.pokemonType.length === 1 &&
        playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[0]) !== -1
      ) {
        critMultiplier = 0.5;
      } else {
        critMultiplier = 1;
      }

      if (critMultiplier === 1.5) {
        setIsPlayerStrong(true);
        setIsComputerStrong(false);
      }
      if (critMultiplier === 0.5) {
        setIsPlayerStrong(false);
        setIsComputerStrong(true);
      }
      const playerAttack = Math.ceil(e.target.value * critMultiplier);
      const playerMove = e.target.name;

      if (pastMoves === []) {
        // const playerAttack =
        //   playerArray[Math.floor(Math.random() * playerArray.length)];
        //Add the player attack damage to history of moves array state.
        // if (pastMoves === []) {
        //   setPastMoves([playerAttack]);
        // } else {
        //   setPastMoves((prevState) => [...prevState, playerAttack]);
        // }
        setPastMoves([{ name: playerMove, power: playerAttack }]);
      } else {
        setPastMoves((prevState) => [
          ...prevState,
          { name: playerMove, power: playerAttack },
        ]);
      }
      //Add the player attack damage to recent moves array state.
      // setRecentMoves([playerAttack]);
      setRecentMoves([{ name: playerMove, power: playerAttack }]);

      //Calculate the hp of computer after player attack.
      let newComputerHP = 0;

      if (playerAttack - computerConfirmedPokemon.pokemonHP >= 0) {
        newComputerHP = 0;
      } else {
        newComputerHP = computerConfirmedPokemon.pokemonHP - playerAttack;
      }

      //Update the database with computer pokemon's new hp.
      update(dbRef(database, COMPUTER_POKEMON + "/" + computerPokemonRefID), {
        pokemonHP: newComputerHP,
      });

      //Set playerTurn state to false.
      setPlayerTurn(false);

      //If computer pokemon's hp is not 0 with User's pokemon attack, go to computer turn & execute computer turn function.
      //If computer pokemon's hp is 0 with User's pokemon attack, battle ends. Update stats of user into the realtime database.
      if (newComputerHP > 0) {
        handleComputerAttack();
      } else {
        console.log("computer pokemon is dead");

        let mostUsedPokemon;
        if (userStats.usedPokemon && userStats.usedPokemon.length !== 0) {
          mostUsedPokemon = findMostUsed(userStats.usedPokemon);
        } else {
          mostUsedPokemon = "NA";
        }

        update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
          gamesPlayed: userStats.gamesPlayed + 1,
          gamesWon: userStats.gamesWon + 1,
          mostUsed: mostUsedPokemon,
        });
      }
    } else if (!playerTurn) {
      console.log("computerturn now");
    }
  };

  // Computer turn function for battle page. This is executed if computer's hp is not 0 after player's turn.
  const handleComputerAttack = () => {
    //May be redundant, but set playerTurn's state to false and computerTurn state to true to ensure.
    setPlayerTurn(false);
    setComputerTurn(true);
    console.log("yes myturn now");
    console.log(computerConfirmedPokemon);
    console.log(computerTurn);

    let critMultiplier = 1;
    if (
      computerConfirmedPokemon.pokemonType.length === 2 &&
      (playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !==
        -1 ||
        playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[1]) !==
          -1)
    ) {
      critMultiplier = 0.5;
    } else if (
      computerConfirmedPokemon.pokemonType.length === 1 &&
      playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !== -1
    ) {
      critMultiplier = 0.5;
    } else if (
      computerConfirmedPokemon.pokemonType.length === 2 &&
      (playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[0]) !== -1 ||
        playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[1]) !== -1)
    ) {
      critMultiplier = 1.5;
    } else if (
      computerConfirmedPokemon.pokemonType.length === 1 &&
      playerWeakType.indexOf(computerConfirmedPokemon.pokemonType[0]) !== -1
    ) {
      critMultiplier = 1.5;
    } else {
      critMultiplier = 1;
    }

    //ref computer attack dmg.
    const computerAttackObject =
      computerArray[Math.floor(Math.random() * computerArray.length)];
    const computerAttack = Math.ceil(
      computerAttackObject.power * critMultiplier
    );
    const computerMove = computerAttackObject.name;
    // computerArray[Math.floor(Math.random() * computerArray.length)];
    //[attack1: 10, attack2: 20]
    let newPlayerHP = 0;

    //Add the computer attack damage to history of moves array state.
    //Add the computer attack damage to recent moves array state.
    // setPastMoves((prevState) => [...prevState, computerAttack]);
    // setRecentMoves((prevState) => [...prevState, computerAttack]);
    setPastMoves((prevState) => [
      ...prevState,
      { name: computerMove, power: computerAttack },
    ]);
    setRecentMoves((prevState) => [
      ...prevState,
      { name: computerMove, power: computerAttack },
    ]);

    //Calculate player's pokemon HP after computer attack.
    if (computerAttack - playerConfirmedPokemon.pokemonHP >= 0) {
      newPlayerHP = 0;
    } else {
      newPlayerHP = playerConfirmedPokemon.pokemonHP - computerAttack;
    }

    //Update the database with player pokemon's new hp.
    update(dbRef(database, PLAYER_POKEMON + "/" + playerPokemonRefID), {
      pokemonHP: newPlayerHP,
    });

    //If User pokemon's hp is not 0 with computer's pokemon attack, set playerTurn state to true. Allow's player to click attack again.
    //If User pokemon's hp is 0 with computer's pokemon attack, battle ends. Update stats of user into the realtime database.
    if (newPlayerHP > 0) {
      setPlayerTurn(true);
    } else {
      console.log("player pokemon is dead");
      const mostUsedPokemon = findMostUsed(userStats.usedPokemon);

      update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
        gamesPlayed: userStats.gamesPlayed + 1,
        mostUsed: mostUsedPokemon,
      });
    }
  };

  console.log(playerTurn);
  console.log(pastMoves);

  //useEffect for updating the internal states of the computer pokemon and player pokemon during battle page. This useEffect is triggered by force every time there is a change in state for computerTurn and playerTurn.
  //useEffect is also triggered when the realtime database's data is updated for computer pokemon and player pokemon.
  //This allows the browser/app to render out the latest HP of each pokemon.
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
          pokemonType: computerConfirmedPokemon.pokemonType,
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
          pokemonType: playerConfirmedPokemon.pokemonType,
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
      <UserProfile currUser={userStats} pokemonSelection={pokemonSelection} />
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
                //When User confirms pokemon and is sent to battle page, playerTurn and computerTurn states are set to true.
                setPlayerTurn(true);
                setComputerTurn(true);
              }}
              onReselectPokemon={(e) => handleReselectPokemon(e)}
              setPlayerArray={(playerAttackArray) =>
                setPlayerArray(playerAttackArray)
              }
              //set internal state for player pokemon's strong & weak types. Affects crit multiplier
              setPlayerStrongType={(strongType) =>
                setPlayerStrongType(strongType)
              }
              setPlayerWeakType={(weakType) => setPlayerWeakType(weakType)}
            />
          }
        />
        <Route
          path="/battlepage"
          element={
            <BattlePage
              playerConfirmedPokemon={playerConfirmedPokemon}
              playerArray={playerArray}
              computerConfirmedPokemon={computerConfirmedPokemon}
              onAttack={(e) => handleAttack(e)}
              isPlayerTurn={playerTurn}
              isComputerTurn={computerTurn}
              historyMoves={recentMoves}
              onSummary={() => handleSummary()}
              isComputerStrong={isComputerStrong}
              isPlayerStrong={isPlayerStrong}
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
