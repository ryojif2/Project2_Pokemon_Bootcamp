import React, { useState, useEffect } from "react";
import axios from "axios";
import { database, storage } from "../DB/firebase";
import Pokedex from "../Components/Pokedex.js";
import SelectPoke from "../Components/SelectPoke";
import BattlePage from "../Components/BattlePage";
import UserProfile from "../Components/UserProfile";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  update,
  onChildChanged,
} from "firebase/database";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

// const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";
const MainPage = (props) => {
  // const currUser = props.currUser;
  // const userRef = dbRef(database, `${USERSTATS_FOLDER_NAME}/${currUser}`);
  // const [userStats, setUserStats] = useState({
  //   username: "",
  //   gamesPlayed: 0,
  //   gamesWon: 0,
  //   winRate: 0,
  //   mostUsed: "",
  // });

  // During first sign up and log in, we need to upload user data and initialise the above stats into firebase database using set.

  // same as ComponentdidMount. Obtain user profile/stats from firebase database and set state for userStats. Pass the info to Userprofile.js to render. Only set once whenever the stats in firebase database are changed.
  // useEffect(() => {
  //   onChildChanged(userRef, (data) => {
  //     if (data !== null) {
  //       // setUserStats(() => {
  //       //   console.log(data.val);
  //       //   // gamesPlayed: data.val.
  //       //   // { key: data.key, val: data.val() }
  //       // });
  //     }
  //   });
  // }, []);

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
    navigate("/selectpokemon").catch((error) => {
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
  // const selectComputerPokemon = (playerPokemon) => {
  //   for (let i = 0; i < pokemonSelection.length; i++) {
  //     if (pokemonSelection[i].pokemonName == playerPokemon.pokemonName) {
  //       pokemonSelection.splice(i, 1);
  //     }
  //   }
  //   const computerPokemonObject =
  //     pokemonSelection[Math.floor(Math.random() * 8 + 1)];

  //   getComputerArray(computerPokemonObject);
  // };

  // const getComputerArray = (pokeAPI) => {
  //   const { pokemonMovesURL } = pokeAPI;
  //   const compArray = [];
  //   pokemonMovesURL.map((url) => {
  //     axios.get(url).then(
  //       (response) => {
  //         const { name, power } = response.data;
  //         console.log(name);
  //         console.log(power);
  //         console.log(compArray, "compArray");
  //         console.log("hi running ");
  //         compArray.push(power);
  //       }
  //       // else {setComputerArray([power])
  //       // console.log("dun exist")}
  //     );
  //   });
  //   console.log("set comp array!");
  //   setComputerArray(compArray);
  // };

  const pushPlayerPokemonData = (playerPokemonData, computerPokemonData) => {
    console.log(playerPokemonData, "player poke data");
    console.log(computerPokemonData, "computer poke data");
    const playerRef = dbRef(database, PLAYER_POKEMON);
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, {
      pokemonName: playerPokemonData.pokemonName,
      pokemonHP: playerPokemonData.pokemonHP,
      pokemonAttacks: [playerArray],
    });

    const computerRef = dbRef(database, COMPUTER_POKEMON);
    const newComputerRef = push(computerRef);
    set(newComputerRef, {
      pokemonName: computerPokemonData.pokemonName,
      pokemonHP: computerPokemonData.pokemonHP,
      pokemonAttacks: [computerArray],
    });
    //consider to set into internal state
  };

  //user selected and press confirm
  const handleConfirmPokemon = (confirmedPokemon) => {
    console.log(confirmedPokemon);
    //route to battlepage here useNavigate
    navigate("/battlepage");
    console.log("battle!");
    //pass the confirmed pokemons to battlepage
    setPlayerConfirmedPokemon(confirmedPokemon);
    // setComputerConfirmedPokemon(selectComputerPokemon(confirmedPokemon));
    //push array of player and comp pokemon info to database
    pushPlayerPokemonData(
      confirmedPokemon,
      computerConfirmedPokemon
      // selectComputerPokemon(confirmedPokemon)
    );
    //push array of player and comp moves info to database
  };
  //math random for computer pokemon
  // const selectComputerPokemon = (playerPokemon) => {
  //   for (let i = 0; i < pokemonSelection.length; i++) {
  //     if (pokemonSelection[i].pokemonName == playerPokemon.pokemonName) {
  //       pokemonSelection.splice(i, 1);
  //     }
  //   }
  //   return pokemonSelection[Math.floor(Math.random() * 8 + 1)];
  // };

  // const getComputerArray = (pokeAPI) => {
  //   const { pokemonMovesURL } = pokeAPI;
  //   console.log(pokeAPI);
  //   console.log(pokemonMovesURL);
  //   const compArray = [];
  //   pokemonMovesURL.map((url) => {
  //     axios.get(url).then(
  //       (response) => {
  //         const { name, power } = response.data;
  //         console.log(name);
  //         console.log(power);
  //         console.log(compArray, "compArray");
  //         console.log("hi running ");
  //         compArray.push(power);
  //       }
  //       // else {setComputerArray([power])
  //       // console.log("dun exist")}
  //     );
  //   });
  //   console.log("set comp array!");
  //   // setComputerArray(compArray);

  //   //return compArray
  //   //Store as variable and use in promises
  //   //invoke function as the value of the variable.
  //   return compArray;
  // };

  // const pushPlayerPokemonData = (playerPokemonData, computerPokemonData) => {
  //   // console.log(playerPokemonData, "player poke data");
  //   // console.log(computerPokemonData, "computer poke data");
  //   console.log(playerConfirmedPokemon);
  //   if (
  //     Object.keys(playerConfirmedPokemon).length !== 0 &&
  //     Object.keys(computerConfirmedPokemon).length !== 0
  //   ) {
  //     const playerRef = dbRef(database, PLAYER_POKEMON);
  //     const newPlayerRef = push(playerRef);

  //     set(newPlayerRef, {
  //       pokemonName: playerPokemonData.pokemonName,
  //       pokemonHP: playerPokemonData.pokemonHP,
  //       pokemonAttacks: playerArray,
  //     });

  //     const computerRef = dbRef(database, COMPUTER_POKEMON);
  //     const newComputerRef = push(computerRef);
  //     set(newComputerRef, {
  //       pokemonName: computerPokemonData.pokemonName,
  //       pokemonHP: computerPokemonData.pokemonHP,
  //       pokemonAttacks: computerArray,
  //     });
  //   } else {
  //     console.log("first render");
  //   }
  //   //consider to set into internal state
  // };
  // const [isLoaded, setIsLoaded] = useState(false);
  // //user selected and press confirm
  // const handleConfirmPokemon = (confirmedPokemon) => {
  //   console.log(confirmedPokemon);
  //   //route to battlepage here useNavigate

  //   //pass the confirmed pokemons to battlepage

  //   setPlayerConfirmedPokemon(confirmedPokemon)
  //     .then(() => {
  //       return selectComputerPokemon(confirmedPokemon);
  //     })
  //     .then((data) => {
  //       setComputerConfirmedPokemon(data);
  //       getComputerArray(data);
  //     })
  //     .then(() => {
  //       if (isLoaded) {
  //         navigate("/battlepage");
  //       } else {
  //         console.log("loading in process");
  //       }
  //     });
  //   // const computerPokemonObject = selectComputerPokemon(confirmedPokemon);
  //   // selectComputerPokemon(confirmedPokemon)

  //   // setComputerConfirmedPokemon(computerPokemonObject);

  //   // getComputerArray(computerPokemonObject);

  //   // if (isLoaded) {
  //   //   navigate("/battlepage");
  //   // } else {
  //   //   console.log("loading in process");
  //   // }

  //   // const promise1 = [];
  //   // promise1.push(setPlayerConfirmedPokemon(confirmedPokemon));
  //   // promise1.push(
  //   //   setComputerConfirmedPokemon(selectComputerPokemon(confirmedPokemon))
  //   // );
  //   // Promise.all(promise1)
  //   // .then(() => {
  //   //   // if (playerConfirmedPokemon !== {}) {
  //   //   //   const computerPokemonObject = selectComputerPokemon(confirmedPokemon);
  //   //   //   return computerPokemonObject;
  //   //   // } else {
  //   //   //   setTimeout(() => {
  //   //   //     const computerPokemonObject =
  //   //   //       selectComputerPokemon(confirmedPokemon);
  //   //   //     return computerPokemonObject;
  //   //   //   }, 3000);
  //   //   // }
  //   //   const computerPokemonObject = selectComputerPokemon(confirmedPokemon);
  //   //   return computerPokemonObject;
  //   // })
  //   // .then((element) => {
  //   //   console.log(element);

  //   //   const promise3 = [];
  //   //   promise3.push(setComputerConfirmedPokemon(element));

  //   //   return [promise3, element];
  //   // })
  //   // .then((data) => {
  //   //   Promise.all(data[0]).then(console.log("promise3 done"));

  //   //   return data[1];
  //   // })
  //   // .then((element) => {
  //   //   console.log(element);
  //   //   return getComputerArray(element);
  //   //   // return element;
  //   //   //return data
  //   //   // return getComputerArray(element2);  <<< preferred method, we will try
  //   // })
  //   // .then(() => {
  //   //   if(isLoaded) {
  //   //   navigate("/battlepage");} else {console.log("loading in process")}
  //   // });
  //   //push array of player and comp moves info to database
  // };

  // useEffect(() => {
  //   if (
  //     Object.keys(playerConfirmedPokemon).length !== 0 &&
  //     Object.keys(computerConfirmedPokemon).length !== 0
  //   ) {
  //     pushPlayerPokemonData(playerConfirmedPokemon, computerConfirmedPokemon);
  //     setIsLoaded(true);
  //   } else {
  //     console.log("first render");
  //   }
  // }, [playerConfirmedPokemon, computerConfirmedPokemon]);

  // const [playerTurn,setPlayerTurn]=useState(true)

  // const handleAttack = ()=>{
  //   if(playerTurn){
  // //ref player attack damage
  // const playerAttack=playerArray[math.random()*playerArray.length]
  // //ref computer DB and minus the HP
  // //toggle to !PlayerTurn and auto call func again

  //   } else (playerTurn===false){
  // //ref computer attack damage
  // //ref player DB and minus the HP
  // //toggle to playerTurn
  //   }

  // }
  console.log("computerpokemon", computerConfirmedPokemon);
  console.log("playerpokemon", playerConfirmedPokemon);
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
              availablePokemon={pokemonSelection}
              // selectComputerPokemon={selectComputerPokemon}
              computerMovesState={(data) => setComputerArray(data)}
              computerPokemonState={(data) => setComputerConfirmedPokemon(data)}
              selectedPokemon={pokemonSelection[currPokemon]}
              onConfirmPokemon={(confirmedPokemon) =>
                handleConfirmPokemon(confirmedPokemon)
              }
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
            />
          }
        />
      </Routes>
    </div>
  );
};
export default MainPage;
