import React, { useState, useEffect } from "react";
import axios from "axios";
import { database, firestore, auth } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import BattlePage from "../Components/BattlePage";
import Results from "../Components/Results";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import gym from "../Sounds/gym.mp3";
import Lobby from "../Components/Lobby";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  arrayUnion,
  getDoc,
  deleteDoc,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";

const MainPage = (props) => {
  //Initialise state for userStats of each player. This is for userProfile.js.
  const [userStats, setUserStats] = useState({});
  const [victory, setVictory] = useState(false);
  const [loss, setLoss] = useState(false);
  const [battle, setBattle] = useState(false);
  //determine if next page is selected
  const [nextPage, setNextPage] = useState(false);
  const [gameType, setGameType] = useState();
  const [pveMode, setPveMode] = useState(false);
  const [pvpMode, setPvpMode] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [roomID, setRoomID] = useState("");
  const [playerArray, setPlayerArray] = useState([]);
  const [computerArray, setComputerArray] = useState([]);
  const [playerStrongType, setPlayerStrongType] = useState([]);
  const [playerWeakType, setPlayerWeakType] = useState([]);
  const [playerConfirmedPokemon, setPlayerConfirmedPokemon] = useState({});
  const [computerConfirmedPokemon, setComputerConfirmedPokemon] = useState({});
  //Pokedex portion, generate 9 chosen pokemon from their URL
  const [pokemonSelection, setPokemonSelection] = useState([]);

  //Initialise state for userStats of each player. This is for userProfile.js.
  const [bothConfirmed, setBothConfirmed] = useState(false);
  const [playerTurn, setPlayerTurn] = useState();
  const [computerTurn, setComputerTurn] = useState();
  //pastMoves is to record the entire history of the battle.
  const [pastMoves, setPastMoves] = useState([]);
  //recentMoves is to record only the moves of each turn. Player turn and computer turn. This is to render on the battlepage the 2 attacks that happened.
  const [recentMoves, setRecentMoves] = useState([]);
  const [otherPlayerTurn, setOtherPlayerTurn] = useState();
  const [otherPlayerConfirmedPokemon, setOtherPlayerConfirmedPokemon] =
    useState({});

  //render userstats here to follow DB updates
  useEffect(() => {
    if (props.loggedInUser) {
      const { email } = props.loggedInUser;
      console.log(email);
      const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");
      const usersRef = collection(firestore, "users");

      // Create a query against the collection.
      const q = query(usersRef, where("email", "==", emailWoSpecialChar));

      onSnapshot(q, (snapshot) => {
        setUserStats(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        props.setUserData(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        snapshot.docs.forEach((doc) => {
          console.log({ ...doc.data(), id: doc.id });
        });
      });
      console.log("aft on snapshot! userstat", userStats);
    }
  }, [props.loggedInUser]);

  const [otherPlayerExist, setOtherPlayerExist] = useState();

  // try to get otherPlayer ID and info!
  useEffect(() => {
    if (pvpMode === true) {
      const { email } = props.loggedInUser;
      console.log(email);
      const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");
      console.log("roomID", roomID, "useEFFECT SNAPSHOT", gameType, "gameType");
      const otherUserRef = collection(firestore, "rooms", roomID, "users");
      // Create a query against the collection.
      const q = query(otherUserRef, where("email", "!=", emailWoSpecialChar));

      onSnapshot(q, { includeMetaDataChanges: true }, (querySnapshot) => {
        const otherUserData = [];
        querySnapshot.forEach((doc) => {
          otherUserData.push(doc.data());
        });
        console.log(otherUserData, "otheruserData");
        setOtherPlayerConfirmedPokemon(otherUserData[0]);
        if (otherUserData.length > 0) {
          setOtherPlayerExist(true);
        } else {
          console.log("other userdont exist");
        }
      });
    }
  }, [pvpMode, gameType, playerConfirmedPokemon]);

  //OBTAIN ALL 9 POKEMON INFO
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
        const pokemonTypeURL = types.map((element) => element.type.url);
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
          pokemonTypeURL: pokemonTypeURL,
          pokemonMoves: pokemonMoves,
          pokemonMovesURL: pokemonMovesURL,
          pokemonImageBack: pokemonImageBack,
          pokemonImageFront: pokemonImageFront,
          pokemonImage: pokemonImage,
        };

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
  }, [pokemonSelection, gameType]);

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
  const handleReselectPokemon = async (e) => {
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
    // const computerPokemon = pokemonSelection[Math.floor(Math.random() * 8 + 1)];
    const computerPokemon =
      pokemonSelection[
        Math.floor(Math.random() * (pokemonSelection.length - 1) + 1)
      ];
    setComputerConfirmedPokemon(computerPokemon);
    console.log(computerPokemon);
    getComputerArray(computerPokemon.pokemonMovesURL);
  };

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
          // return power;
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
  const pushComputerPokemonData = async (
    computerPokemonData,
    computerArray
  ) => {
    const computerRef = doc(firestore, "rooms", roomID, "users", "computer");
    if (computerPokemonData && computerArray.length > 3 && pveMode === true) {
      console.log(computerPokemonData, "UPDATE FIRESTORE! computer poke data");
      await setDoc(computerRef, {
        pokemonName: computerPokemonData.pokemonName,
        pokemonHP: computerPokemonData.pokemonHP,
        pokemonAttacks: computerArray,
        confirmed: true,
      });
      setBothConfirmed(true);
    } else return;
  };

  useEffect(() => {
    if (
      Object.keys(computerConfirmedPokemon).length !== 0 &&
      computerArray.length > 3 &&
      pveMode === true
    ) {
      //push computer to firestore
      console.log(
        "hiiii! player and comp cfm pokemon, check DB if comp updated!"
      );
      pushComputerPokemonData(computerConfirmedPokemon, computerArray);
    }
  }, [computerArray]);

  const pushUserToFireStore = async (playerPokemonData) => {
    const userRef = doc(
      firestore,
      "rooms",
      roomID,
      "users",
      userStats[0].username
    );

    console.log(playerPokemonData, "USER DATA FIRESTORE UPDATED");

    await updateDoc(userRef, {
      pokemonName: playerPokemonData.pokemonName,
      pokemonHP: playerPokemonData.pokemonHP,
      pokemonType: playerPokemonData.pokemonType,
      pokemonImage: playerPokemonData.pokemonImage,
      confirmed: true,
    });
  };

  const [playerConfirmed, setPlayerConfirmed] = useState();
  const handleConfirmPokemon = async (confirmedPokemon) => {
    console.log(roomID, "roomID", userStats[0].username, "username");
    console.log(confirmedPokemon);
    //pass the confirmed pokemons to battlepage through state
    setPlayerConfirmedPokemon(confirmedPokemon);
    console.log(pveMode, "pveMode", gameType, "gameType");
    console.log("before select pokemon!!!");
    if (pveMode === true && gameType === "pve") {
      selectComputerPokemon(confirmedPokemon);
    }
    await pushUserToFireStore(confirmedPokemon);
    const roomRef = doc(firestore, "users", userStats[0].email);
    await updateDoc(roomRef, {
      usedPokemon: arrayUnion(confirmedPokemon.pokemonName),
    });
    setBattle(true);
    setNextPage(true);
    setPlayerConfirmed(true);
    console.log(otherPlayerConfirmedPokemon);

    navigate("battlepage");
    console.log("battle!");
  };

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

  //MULTIPLIER
  const [isPlayerStrong, setIsPlayerStrong] = useState(false);
  const [isComputerStrong, setIsComputerStrong] = useState(false);
  const [isOtherPlayerStrong, setIsOtherPlayerStrong] = useState(false);
  //When User clicks attack in battle page. Playerturn state is already true.
  const handleAttack = async (e) => {
    console.log("handle attack is running");
    if (pveMode === true) {
      if (playerTurn) {
        console.log("playerturn now");
        // Set the computerturn state to false.
        setComputerTurn(false);
        let critMultiplier = 1;
        if (
          computerConfirmedPokemon.pokemonType.length === 2 &&
          (playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !==
            -1 ||
            playerStrongType.indexOf(
              computerConfirmedPokemon.pokemonType[1]
            ) !== -1)
        ) {
          critMultiplier = 1.5;
        } else if (
          computerConfirmedPokemon.pokemonType.length === 1 &&
          playerStrongType.indexOf(computerConfirmedPokemon.pokemonType[0]) !==
            -1
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

        //ref player attack damage
        const playerAttack = Math.ceil(e.target.value * critMultiplier);
        const playerMove = e.target.name;
        // const playerAttack =
        //   playerArray[Math.floor(Math.random() * playerArray.length)];
        const roomRef = doc(firestore, "rooms", roomID);
        if (isPlayerStrong === true) {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({
              name: playerMove,
              power: playerAttack,
            }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}. It's super effective!!!`,
          });
        } else if (isComputerStrong === true) {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({ name: playerMove, power: playerAttack }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}. It's not very effective...`,
          });
        } else {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({ name: playerMove, power: playerAttack }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}.`,
          });
        }
        //Calculate the hp of computer after player attack.
        let newComputerHP = 0;
        //if player attack is more than computer HP
        if (playerAttack - computerConfirmedPokemon.pokemonHP >= 0) {
          newComputerHP = 0;
        } else {
          newComputerHP = computerConfirmedPokemon.pokemonHP - playerAttack;
        }
        console.log(newComputerHP, "newcompHP");
        // //Update the database with computer pokemon's new hp.
        const compRef = doc(firestore, "rooms", roomID, "users", "computer");
        await updateDoc(compRef, { pokemonHP: newComputerHP, turn: true });
        //Set playerTurn state to false.
        setPlayerTurn(false);
        //If computer pokemon's hp is not 0 with User's pokemon attack, go to computer turn & execute computer turn function.
        //If computer pokemon's hp is 0 with User's pokemon attack, battle ends. Update stats of user into the realtime database.
        if (newComputerHP > 0) {
          handleComputerAttack();
        } else {
          console.log("computer pokemon is dead");

          let mostUsedPokemon;
          if (
            userStats[0].usedPokemon &&
            userStats[0].usedPokemon.length !== 0
          ) {
            mostUsedPokemon = findMostUsed(userStats[0].usedPokemon);
          } else {
            mostUsedPokemon = "NA";
          }

          const userRef = doc(firestore, "users", userStats[0].email);
          await updateDoc(userRef, {
            gamesPlayed: userStats[0].gamesPlayed + 1,
            gamesWon: userStats[0].gamesWon + 1,
            mostUsed: mostUsedPokemon,
          });
        }
      }
    }
    if (pvpMode === true) {
      console.log(otherPlayerConfirmedPokemon);
      console.log(userStats);
      const otherPlayerRef = doc(
        firestore,
        "rooms",
        roomID,
        "users",
        otherPlayerConfirmedPokemon.username
      );
      const playerRef = doc(
        firestore,
        "rooms",
        roomID,
        "users",
        userStats[0].username
      );
      const userRef = doc(firestore, "users", userStats[0].email);
      const otherUserRef = doc(
        firestore,
        "users",
        otherPlayerConfirmedPokemon.email
      );
      const roomRef = doc(firestore, "rooms", roomID);
      let critMultiplier = 1;
      if (
        otherPlayerConfirmedPokemon.pokemonType.length === 2 &&
        (playerStrongType.indexOf(
          otherPlayerConfirmedPokemon.pokemonType[0]
        ) !== -1 ||
          playerStrongType.indexOf(
            otherPlayerConfirmedPokemon.pokemonType[1]
          ) !== -1)
      ) {
        critMultiplier = 1.5;
      } else if (
        otherPlayerConfirmedPokemon.pokemonType.length === 1 &&
        playerStrongType.indexOf(otherPlayerConfirmedPokemon.pokemonType[0]) !==
          -1
      ) {
        critMultiplier = 1.5;
      } else if (
        otherPlayerConfirmedPokemon.pokemonType.length === 2 &&
        (playerWeakType.indexOf(otherPlayerConfirmedPokemon.pokemonType[0]) !==
          -1 ||
          playerWeakType.indexOf(otherPlayerConfirmedPokemon.pokemonType[1]) !==
            -1)
      ) {
        critMultiplier = 0.5;
      } else if (
        otherPlayerConfirmedPokemon.pokemonType.length === 1 &&
        playerWeakType.indexOf(otherPlayerConfirmedPokemon.pokemonType[0]) !==
          -1
      ) {
        critMultiplier = 0.5;
      } else {
        critMultiplier = 1;
      }

      if (critMultiplier === 1.5) {
        setIsPlayerStrong(true);
        setIsOtherPlayerStrong(false);
      }
      if (critMultiplier === 0.5) {
        setIsPlayerStrong(false);
        setIsOtherPlayerStrong(true);
      }

      if (playerTurn) {
        //set other player turn false IN DB
        await updateDoc(otherPlayerRef, { turn: false });
        // calculate my attack damage and other player new HP

        const playerAttack = Math.ceil(e.target.value * critMultiplier);
        const playerMove = e.target.name;

        //Calculate the hp of computer after player attack.
        let newOtherPlayerHP = 0;
        //if player attack is more than computer HP
        if (playerAttack - otherPlayerConfirmedPokemon.pokemonHP >= 0) {
          newOtherPlayerHP = 0;
        } else {
          newOtherPlayerHP =
            otherPlayerConfirmedPokemon.pokemonHP - playerAttack;
        }
        // //Update the database with computer pokemon's new hp.
        setOtherPlayerTurn(true);
        await updateDoc(otherPlayerRef, {
          pokemonHP: newOtherPlayerHP,
          turn: true,
        });
        //Set playerTurn state to false.
        setPlayerTurn(false);

        await updateDoc(playerRef, {
          turn: false,
        });

        if (isPlayerStrong === true) {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({ name: playerMove, power: playerAttack }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}. It's super effective!!!`,
          });
        } else if (isOtherPlayerStrong === true) {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({ name: playerMove, power: playerAttack }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}. It's not so effective...`,
          });
        } else {
          await updateDoc(roomRef, {
            pastMoves: arrayUnion({ name: playerMove, power: playerAttack }),
            displayMsg: `${userStats[0].username}'s ${playerConfirmedPokemon.pokemonName} dealt a damage of ${playerAttack} with ${playerMove}`,
          });
        }
        //If other pokemon's hp is 0 with User's pokemon attack, battle ends. Update stats of user into the database.
        if (newOtherPlayerHP > 0) {
          console.log("wait fr other player move");
        } else {
          console.log("other player pokemon is dead");
          let mostUsedPokemon;
          if (
            userStats[0].usedPokemon &&
            userStats[0].usedPokemon.length !== 0
          ) {
            mostUsedPokemon = findMostUsed(userStats[0].usedPokemon);
          } else {
            mostUsedPokemon = "NA";
          }

          let otherPlayerMostUsedPokemon = findMostUsed(
            otherPlayerConfirmedPokemon.usedPokemon
          );
          await updateDoc(userRef, {
            gamesPlayed: userStats[0].gamesPlayed + 1,
            gamesWon: userStats[0].gamesWon + 1,
            mostUsed: mostUsedPokemon,
          });
          await updateDoc(otherUserRef, {
            gamesPlayed: otherPlayerConfirmedPokemon.gamesPlayed + 1,
            mostUsed: otherPlayerMostUsedPokemon,
          });
        }
      }
    }
    if (otherPlayerTurn) {
      console.log("other player Turn");
    }
  };

  // Computer turn function for battle page. This is executed if computer's hp is not 0 after player's turn.
  const handleComputerAttack = async () => {
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

    let newPlayerHP = 0;

    const roomRef = doc(firestore, "rooms", roomID);

    if (isComputerStrong === true) {
      await updateDoc(roomRef, {
        pastMoves: arrayUnion({ name: computerMove, power: computerAttack }),
        displayMsg: `Computer's ${computerConfirmedPokemon.pokemonName} dealt a damage of ${computerAttack} with ${computerMove}. It's super effective!!!`,
      });
    } else if (isPlayerStrong === true) {
      await updateDoc(roomRef, {
        pastMoves: arrayUnion({ name: computerMove, power: computerAttack }),
        displayMsg: `Computer's ${computerConfirmedPokemon.pokemonName} dealt a damage of ${computerAttack} with ${computerMove}. It's not so effective...`,
      });
    } else {
      await updateDoc(roomRef, {
        pastMoves: arrayUnion({ name: computerMove, power: computerAttack }),
        displayMsg: `Computer's ${computerConfirmedPokemon.pokemonName} dealt a damage of ${computerAttack} with ${computerMove}.`,
      });
    }

    //Calculate player's pokemon HP after computer attack.
    if (computerAttack - playerConfirmedPokemon.pokemonHP >= 0) {
      newPlayerHP = 0;
    } else {
      newPlayerHP = playerConfirmedPokemon.pokemonHP - computerAttack;
    }

    const playerRef = doc(
      firestore,
      "rooms",
      roomID,
      "users",
      userStats[0].username
    );
    await updateDoc(playerRef, { pokemonHP: newPlayerHP });
    //If User pokemon's hp is not 0 with computer's pokemon attack, set playerTurn state to true. Allow's player to click attack again.
    //If User pokemon's hp is 0 with computer's pokemon attack, battle ends. Update stats of user into the realtime database.
    if (newPlayerHP > 0) {
      setPlayerTurn(true);
    } else {
      console.log("player pokemon is dead");
      const mostUsedPokemon = findMostUsed(userStats[0].usedPokemon);
      const userRef = doc(firestore, "users", userStats[0].email);
      await updateDoc(userRef, {
        gamesPlayed: userStats[0].gamesPlayed + 1,
        mostUsed: mostUsedPokemon,
      });
    }
  };

  // for PVE MODE! GET COMPUTER STATE
  useEffect(() => {
    // const q = query(collection(db, "rooms"));
    if (roomID && bothConfirmed && pveMode === true) {
      // query(collection(db,'rooms'/roomID)) get the data of users array,
      // if user[0] == currUser ID , otherPlayer==user[1]

      if (playerTurn) {
        onSnapshot(
          doc(firestore, "rooms", roomID, "users", "computer"),
          (doc) => {
            console.log("COMP SNAPSHOT", doc.data());
            // setRooms(snapshot.docs.map((doc)=>({id:doc.id, data:doc.data()})))
            setComputerConfirmedPokemon((prevState) => {
              return { ...prevState, pokemonHP: doc.data().pokemonHP };
            });
          }
        );
      } else if (computerTurn) {
        onSnapshot(
          doc(firestore, "rooms", roomID, "users", userStats[0].username),
          (doc) => {
            console.log("PLAYER SNAPSHOT", doc.data());
            setPlayerConfirmedPokemon((prevState) => {
              return { ...prevState, pokemonHP: doc.data().pokemonHP };
            });
          }
        );
      }
      console.log(playerConfirmedPokemon, "player cfm pokemon on SNAPSHOT!");
      console.log(
        computerConfirmedPokemon,
        "computer cfm pokemon on SNAPSHOT!"
      );
    }
  }, [playerTurn, computerTurn]);

  // FOR PVP MODE, GET OTHER USER STATE
  useEffect(() => {
    console.log(bothConfirmed);
    // const q = query(collection(db, "rooms"));
    if (roomID && bothConfirmed && pvpMode === true) {
      if (playerTurn) {
        onSnapshot(
          doc(
            firestore,
            "rooms",
            roomID,
            "users",
            otherPlayerConfirmedPokemon.username
          ),
          { includeMetaDataChanges: true },
          (doc) => {
            console.log("OTHER PLAYER SNAPSHOT", doc.data());

            // setRooms(snapshot.docs.map((doc)=>({id:doc.id, data:doc.data()})))
            setOtherPlayerConfirmedPokemon((prevState) => {
              return {
                ...prevState,
                pokemonHP: doc.data().pokemonHP,
                turn: doc.data().turn,
              };
            });
            // setPlayerTurn(!doc.data().turn);
          }
        );
      } else if (otherPlayerTurn) {
        console.log("otherplayer turn runs update on my pokemonhp.");
        onSnapshot(
          doc(firestore, "rooms", roomID, "users", userStats[0].username),
          { includeMetaDataChanges: true },
          (doc) => {
            console.log("PLAYER SNAPSHOT", doc.data());
            setPlayerConfirmedPokemon((prevState) => {
              return {
                ...prevState,
                pokemonHP: doc.data().pokemonHP,
                turn: doc.data().turn,
              };
            });
            setPlayerTurn(doc.data().turn);
          }
        );
      }

      console.log(playerConfirmedPokemon, "player cfm pokemon on SNAPSHOT!");
      console.log(
        otherPlayerConfirmedPokemon,
        "computer cfm pokemon on SNAPSHOT!"
      );
    }
  }, [playerTurn, otherPlayerTurn]);

  const handleSummary = () => {
    navigate("results");
  };

  const handleNewBattle = async () => {
    navigate("/mainpage");
    setPvpMode(false);
    setPveMode(false);
    setBothConfirmed(false);
    setGameStart(false);
    if (gameType === "pvp") {
      await deleteDoc(doc(firestore, "rooms", roomID));
      setRoomID("");
    }
    setGameType("");
  };

  const startGame = (roomID, chosenGameType) => {
    setGameStart(true);
    setRoomID(roomID);
    if (chosenGameType === "pve") {
      setGameType("pve");
      setPveMode(true);
    } else if (chosenGameType === "pvp") {
      setGameType("pvp");
      setPvpMode(true);
    }
  };

  const exitGame = async () => {
    setGameStart(false);
    setRoomID("");
    await deleteDoc(doc(firestore, "rooms", roomID));
  };

  return (
    <div>
      <br />
      <br />
      {nextPage !== true ? (
        <audio loop autoPlay src={gym}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <Outlet />
      <Routes>
        <Route
          path="/"
          element={
            gameStart ? (
              <Pokedex
                exitGame={exitGame}
                pokemonSelection={pokemonSelection}
                onChoosePokemonClick={(e) => handleChoosePokemonClick(e)}
              />
            ) : (
              <Lobby
                startGame={startGame}
                currUser={userStats[0]}
                setGameStart={setGameStart}
                pokemonSelection={pokemonSelection}
              />
            )
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
              computerConfirmedPokemon={
                pveMode ? computerConfirmedPokemon : otherPlayerConfirmedPokemon
              }
              otherPlayerExist={otherPlayerExist}
              setPlayerStrongType={(strongType) =>
                setPlayerStrongType(strongType)
              }
              setPlayerWeakType={(weakType) => setPlayerWeakType(weakType)}
              gameType={gameType}
              nextPage={nextPage}
              setNextPage={setNextPage}
            />
          }
        />
        <Route
          path="/battlepage"
          element={
            <BattlePage
              //pass down loggedInUser here
              playerConfirmedPokemon={playerConfirmedPokemon}
              playerArray={playerArray}
              computerConfirmedPokemon={
                pveMode ? computerConfirmedPokemon : otherPlayerConfirmedPokemon
              }
              onAttack={(e) => handleAttack(e)}
              isPlayerTurn={playerTurn}
              setPlayerTurn={setPlayerTurn}
              setOtherPlayerTurn={setOtherPlayerTurn}
              isComputerTurn={computerTurn}
              historyMoves={recentMoves}
              onSummary={() => handleSummary()}
              battle={battle}
              setBattle={setBattle}
              setVictory={setVictory}
              victory={victory}
              setLoss={setLoss}
              loss={loss}
              currUser={userStats}
              bothConfirmed={bothConfirmed}
              setBothConfirmed={setBothConfirmed}
              gameType={gameType}
              roomID={roomID}
              userStats={userStats[0]}
              playerConfirmed={playerConfirmed}
              setPlayerConfirmedPokemon={setPlayerConfirmedPokemon}
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
              computerConfirmedPokemon={
                pveMode ? computerConfirmedPokemon : otherPlayerConfirmedPokemon
              }
              onNewBattle={handleNewBattle}
              roomID={roomID}
              gameType={gameType}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default MainPage;
