import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
import { database, firestore } from "../DB/firebase";
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
import Lobby from '../Components/Lobby';
import { collection, query, where, onSnapshot,getDocs,addDoc, arrayUnion,getDoc } from "firebase/firestore";
import { doc, setDoc,updateDoc} from "firebase/firestore"; 
const USERSTATS_FOLDER_NAME = "users";
const PLAYER_POKEMON = "playerpokemon";
const COMPUTER_POKEMON = "computerpokemon";
const MainPage = (props) => {


  //Initialise state for userStats of each player. This is for userProfile.js.
  const [userStats, setUserStats] = useState({});

  // //After initial rendering, get a snapshot of the current user stats from the realtime database. Set as the data for userStats state.
  // useEffect(() => {
  //   if (props.loggedInUser) {
  //     const { email } = props.loggedInUser;
  //     console.log(email);
  //     const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");

  //     const userDataRef = dbRef(
  //       database,
  //       USERSTATS_FOLDER_NAME + "/" + emailWoSpecialChar
  //     );
  //     onValue(userDataRef, (data) => {
  //       console.log(data.val());
  //       setUserStats(data.val());
  //     });
  //   }
  // }, [props.loggedInUser]);


  //render userstats here to follow DB updates
useEffect(()=>{


 if (props.loggedInUser) {
      const { email } = props.loggedInUser;
      console.log(email);
      const emailWoSpecialChar = email.replace(/[^a-zA-Z0-9 ]/g, "");
const usersRef = collection(firestore, "users");

// Create a query against the collection.
const q = query(usersRef, where("email", "==", emailWoSpecialChar));

onSnapshot(q,(snapshot)=>{
  setUserStats(snapshot.docs.map((doc)=>({id:doc.id, ...doc.data()})))
  snapshot.docs.forEach((doc)=>{
    console.log({...doc.data(), id:doc.id})
  }) 
})
console.log("aft on snapshot! userstat", userStats)
//   // const q = query(collection(db, "rooms"));
//  onSnapshot(doc(firestore,'users',emailWoSpecialChar), (snapshot) => {
//   console.log(snapshot.docs);
//   // snapshot.docs.map((doc)=>{console.log(doc.data())})
// // setUserStats(snapshot.docs.map((doc)=>({data:doc.data()})))
// })
}
},[props.loggedInUser])



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

  const pushComputerPokemonData = async (
    playerPokemonData,
    computerPokemonData,
    playerArray,
    computerArray
  ) => {

    // const userRef=doc(firestore,'rooms',roomID,'users',userStats[0].username)
    const computerRef=doc(firestore,'rooms',roomID,'users','computer')
    if (playerPokemonData && computerPokemonData && computerArray.length > 3) {
   
      console.log(computerPokemonData, "UPDATE FIRESTORE! computer poke data");
       await setDoc(computerRef, 
        { pokemonName: computerPokemonData.pokemonName,
         pokemonHP: computerPokemonData.pokemonHP,
         pokemonAttacks: computerArray,
        confirmed:true});

//query in the users where if confirmed == true , bothConfirmed 
//display curr user stats indicate it is (you), else other user is (other player)



      // await updateDoc(userRef, 
      //   { pokemonName: playerPokemonData.pokemonName,
      //   pokemonHP: playerPokemonData.pokemonHP,
      //   pokemonAttacks: playerArray});

      // const playerRef = dbRef(database, PLAYER_POKEMON);
      // const newPlayerRef = push(playerRef);

      // const playerRefID = newPlayerRef.key;
      // setPlayerPokemonRefID(playerRefID);

      // set(newPlayerRef, {
      //   pokemonName: playerPokemonData.pokemonName,
      //   pokemonHP: playerPokemonData.pokemonHP,
      //   pokemonAttacks: playerArray,
      // });
      // const computerRef = dbRef(database, COMPUTER_POKEMON);
      // const newComputerRef = push(computerRef);
      // // const { key, val } = newComputerRef;
      // const computerRefID = newComputerRef.key;
      // setComputerPokemonRefID(computerRefID);
      // set(newComputerRef, {
      //   pokemonName: computerPokemonData.pokemonName,
      //   pokemonHP: computerPokemonData.pokemonHP,
      //   pokemonAttacks: computerArray,
      // });

      setBothConfirmed(true);
    } else return;
  };

  useEffect(() => {
// const userRef=doc(firestore,'rooms',roomID,'users')
//   const q = query(userRef,where('confirmed'=='true'))
//   onSnapshot(q,(querySnapshot)=>{querySnapshot.forEach(doc=>console.log('snap', doc.data()))})

    if ( //reference to DB 
    //reference to users[i] array - sam
    // reference to 'rooms/roomID/users/users[i]' 
    //where confirmed == true
      Object.keys(playerConfirmedPokemon).length !== 0 &&
      Object.keys(computerConfirmedPokemon).length !== 0 &&
      computerArray.length > 3 &&
      playerArray.length > 3
    ) {
//push computer to firestore
      console.log("hiiii! player and comp cfm pokemon");
      pushComputerPokemonData(
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

  const pushUserToFireStore= async (
    playerPokemonData
  ) => {

    const userRef=doc(firestore,'rooms',roomID,'users',userStats[0].username)
  
      console.log(playerPokemonData, "USER DATA FIRESTORE UPDATED");
     
      await updateDoc(userRef, 
        { pokemonName: playerPokemonData.pokemonName,
        pokemonHP: playerPokemonData.pokemonHP,
        pokemonAttacks: playerArray,
      confirmed:true});}

      const [bothConfirmed,setBothConfirmed]=useState(false);

  const handleConfirmPokemon = async (confirmedPokemon) => {
    console.log(roomID,'roomID',userStats[0].username,'username')
    console.log(confirmedPokemon);
    //pass the confirmed pokemons to battlepage through state
    setPlayerConfirmedPokemon(confirmedPokemon);
    selectComputerPokemon(confirmedPokemon);
await pushUserToFireStore(confirmedPokemon);

 const roomRef= doc(firestore,'users',userStats[0].email)
await updateDoc(roomRef, {usedPokemon:arrayUnion(confirmedPokemon.pokemonName)})
    
    // When User clicks select pokemon, update the usedPokemon data within the realtime database. This is needed to calculate out most used pokemon for the user.
    // if (userStats.datausedPokemon && userStats.data.usedPokemon.length !== 0) {
    //   update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
    //     usedPokemon: [...userStats.usedPokemon, confirmedPokemon.pokemonName],
    //   });
    // } else {
    //   update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
    //     usedPokemon: [confirmedPokemon.pokemonName],
    //   });
    
    // }

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

  //When User clicks attack in battle page. Playerturn state is already true.
  const handleAttack = async (data) => {
    console.log("this is running");
    if (playerTurn) {
      console.log("playerturn now");
      // Set the computerturn state to false.
      setComputerTurn(false);
      //ref player attack damage
      const playerAttack =
        playerArray[Math.floor(Math.random() * playerArray.length)];
      //Add the player attack damage to history of moves array state.
      if (pastMoves === []) {
        setPastMoves([playerAttack]);
      } else {
        setPastMoves((prevState) => [...prevState, playerAttack]);
      }
      //Add the player attack damage to recent moves array state.
      setRecentMoves([playerAttack]);

      //Calculate the hp of computer after player attack.
      let newComputerHP = 0;
//if player attack is more than computer HP
      if (playerAttack - computerConfirmedPokemon.pokemonHP >= 0) {
        newComputerHP = 0;
      } else {
        newComputerHP = computerConfirmedPokemon.pokemonHP - playerAttack;
      }

      // //Update the database with computer pokemon's new hp.
      // update(dbRef(database, COMPUTER_POKEMON + "/" + computerPokemonRefID), {
      //   pokemonHP: newComputerHP,
      // });

      const roomRef= doc(firestore,'rooms',roomID,'users','computer')
await updateDoc(roomRef, {pokemonHP:newComputerHP})

// getDoc(query(roomRef)).then((computerData)=>{
//  console.log(computerData.data(),'FIND HP of COMPUTER')})
      //Set playerTurn state to false.
      setPlayerTurn(false);

      //If computer pokemon's hp is not 0 with User's pokemon attack, go to computer turn & execute computer turn function.
      //If computer pokemon's hp is 0 with User's pokemon attack, battle ends. Update stats of user into the realtime database.
      if (newComputerHP > 0) {
        handleComputerAttack();
      } else {
        console.log("computer pokemon is dead");

        let mostUsedPokemon;
        if (userStats[0].usedPokemon && userStats[0].usedPokemon.length !== 0) {
          mostUsedPokemon = findMostUsed(userStats[0].usedPokemon);
        } else {
          mostUsedPokemon = "NA";
        }

        // update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
        //   gamesPlayed: userStats.gamesPlayed + 1,
        //   gamesWon: userStats.gamesWon + 1,
        //   mostUsed: mostUsedPokemon,
        // });

        const userRef= doc(firestore,'users',userStats[0].username)
await updateDoc(userRef, {  gamesPlayed: userStats[0].gamesPlayed + 1,
          gamesWon: userStats[0].gamesWon + 1,
          mostUsed: mostUsedPokemon,})
    }
  };
     
  };

  // Computer turn function for battle page. This is executed if computer's hp is not 0 after player's turn.
  const handleComputerAttack = async () => {
    //May be redundant, but set playerTurn's state to false and computerTurn state to true to ensure.
    setPlayerTurn(false);
    setComputerTurn(true);
    console.log("yes myturn now");
    console.log(computerConfirmedPokemon);
    console.log(computerTurn);

    //ref computer attack dmg.
    const computerAttack =
      computerArray[Math.floor(Math.random() * computerArray.length)];

    let newPlayerHP = 0;

    //Add the computer attack damage to history of moves array state.
    //Add the computer attack damage to recent moves array state.
    setPastMoves((prevState) => [...prevState, computerAttack]);
    setRecentMoves((prevState) => [...prevState, computerAttack]);

    //Calculate player's pokemon HP after computer attack.
    if (computerAttack - playerConfirmedPokemon.pokemonHP >= 0) {
      newPlayerHP = 0;
    } else {
      newPlayerHP = playerConfirmedPokemon.pokemonHP - computerAttack;
    }

    // //Update the database with player pokemon's new hp.
    // update(dbRef(database, PLAYER_POKEMON + "/" + playerPokemonRefID), {
    //   pokemonHP: newPlayerHP,
    // });

    const roomRef= doc(firestore,'rooms',roomID,'users',userStats[0].username)
await updateDoc(roomRef, {pokemonHP:newPlayerHP})
    //If User pokemon's hp is not 0 with computer's pokemon attack, set playerTurn state to true. Allow's player to click attack again.
    //If User pokemon's hp is 0 with computer's pokemon attack, battle ends. Update stats of user into the realtime database.
    if (newPlayerHP > 0) {
      setPlayerTurn(true);
    } else {
      console.log("player pokemon is dead");
      const mostUsedPokemon = findMostUsed(userStats[0].usedPokemon);

      // update(dbRef(database, USERSTATS_FOLDER_NAME + "/" + userStats.email), {
      //   gamesPlayed: userStats.gamesPlayed + 1,
      //   mostUsed: mostUsedPokemon,
      // });

      const userRef= doc(firestore,'users',userStats[0].username)
await updateDoc(userRef, { gamesPlayed: userStats[0].gamesPlayed + 1,
        mostUsed: mostUsedPokemon,})
    }
  };

// useEffect(()=>{
// console.log("PLAYER TURN TRYING TO SEE HP")
//   getDocs(doc(firestore, 'rooms', roomID ,'users','computer'),(snapshot)=>{
//     console.log(snapshot.docs.data(),'computer data snapshot')
// //   snapshot.docs.forEach((doc)=>{
// //     console.log(...doc.data(),'FIND HP of COMPUTER')
// //  
//  })
// },[playerTurn])

// trying to link firestore DB to display and re-render out HP after updating local state
//   useEffect(()=>{
//     if(playerTurn && roomID!==null){
//   const computerRef = doc(firestore, 'rooms',roomID,'users','computer');
// // Create a query against the collection.
// const q = query(computerRef);
// getDocs(doc(firestore, 'rooms', roomID ,'users','computer'),(snapshot)=>{
//   snapshot.docs.forEach((doc)=>{
//     console.log(...doc.data(),'FIND HP of COMPUTER')
//   })
//   const {pokemonHP}=doc.data();
//   console.log(pokemonHP,'computerRef HP')
// })
//   setComputerConfirmedPokemon(pokemonName: computerConfirmedPokemon.pokemonName,
//          pokemonHP: pokemonHP,
//          pokemonImageBack: computerConfirmedPokemon.pokemonImageBack,
//        pokemonImageFront: computerConfirmedPokemon.pokemonImageFront)
//  }
// if(computerTurn && roomID!==null){
//   const usersRef = doc(firestore, 'rooms',roomID,'users',userStats[0].username);
// // Create a query against the collection.
// const q = query(usersRef);
// getDocs(doc(firestore, 'rooms',roomID,'users',userStats[0].username),(snapshot)=>{
//   snapshot.docs.forEach((doc)=>{
//     console.log(...doc.data(),'FIND HP of PLAYER')
//   })
//   setUserStats(snapshot.docs.map((doc)=>({id:doc.id, ...doc.data()})))
//   snapshot.docs.forEach((doc)=>{
//     console.log({...doc.data(), id:doc.id})
//   }) 
// })
// }},[playerTurn,computerTurn])

useEffect(()=>{

  // const q = query(collection(db, "rooms"));
  if(roomID){
    // query(collection(db,'rooms'/roomID)) get the data of users array,
    // if user[0] == currUser ID , otherPlayer==user[1]

if (playerTurn) { onSnapshot(doc(firestore, 'rooms', roomID ,'users','computer'),(doc) => {
  console.log("COMP SNAPSHOT", doc.data());

// setRooms(snapshot.docs.map((doc)=>({id:doc.id, data:doc.data()})))
 setComputerConfirmedPokemon(prevState=>{
  return {...prevState,
         pokemonHP:doc.data().pokemonHP };
})})}

else if (computerTurn) {onSnapshot(doc(firestore, 'rooms', roomID ,'users',userStats[0].username),(doc) => {
  console.log("PLAYER SNAPSHOT",doc.data());
setPlayerConfirmedPokemon(prevState=>{
  return {...prevState,
         pokemonHP:doc.data().pokemonHP };
})
})}
console.log(playerConfirmedPokemon,'player cfm pokemon on SNAPSHOT!')
console.log(computerConfirmedPokemon,'computer cfm pokemon on SNAPSHOT!')
}},[playerTurn,computerTurn])


  // useEffect for updating the internal states of the computer pokemon and player pokemon during battle page. This useEffect is triggered by force every time there is a change in state for computerTurn and playerTurn.
  // useEffect is also triggered when the realtime database's data is updated for computer pokemon and player pokemon.
  // This allows the browser/app to render out the latest HP of each pokemon.
  // useEffect(() => {
  //   if (playerTurn) {
  //     console.log("playerTurn is true but onChildChanged is not running");
  //     const computerRef = dbRef(database, COMPUTER_POKEMON);
  //     onChildChanged(computerRef, (data) => {
  //       console.log(data.val());
  //       console.log("this is running3");
  //       const { pokemonHP } = data.val();

        // const newComputerStats = {
        //   pokemonName: computerConfirmedPokemon.pokemonName,
        //   pokemonHP: pokemonHP,
        //   pokemonImageBack: computerConfirmedPokemon.pokemonImageBack,
        //   pokemonImageFront: computerConfirmedPokemon.pokemonImageFront,
        // };

  //       setComputerConfirmedPokemon(newComputerStats);
  //       console.log("this is running2");
  //     });
  //   }

  //   if (computerTurn) {
  //     console.log("computer turn is running");
  //     const playerRef = dbRef(database, PLAYER_POKEMON);
  //     onChildChanged(playerRef, (data) => {
  //       console.log(data.val());
  //       console.log("this is running3");
  //       const { pokemonHP } = data.val();

  //       const newPlayerStats = {
  //         pokemonName: playerConfirmedPokemon.pokemonName,
  //         pokemonHP: pokemonHP,
  //         pokemonImageBack: playerConfirmedPokemon.pokemonImageBack,
  //         pokemonImageFront: playerConfirmedPokemon.pokemonImageFront,
  //       };

  //       setPlayerConfirmedPokemon(newPlayerStats);
  //       console.log("this is running2");
  //     });
  //   }
  // }, [playerTurn, computerTurn]);

  // console.log(computerConfirmedPokemon);

  const handleSummary = () => {
    navigate("results");
  };

  const handleNewBattle = () => {
    navigate("/");
    setBothConfirmed(false);
      // setGameStart(false)
  };

const [gameStart,setGameStart]=useState(false);
const [roomID,setRoomID]=useState('')
  const startGame=(roomID)=>{
    setGameStart(true)
    setRoomID(roomID)
    }
    const exitGame=()=>{
      setGameStart(false)
      setRoomID('')
    }

  const logout = () => {
    console.log("logout");
    props.setLoggedInUser(false);
    signOut(auth);
    navigate("/");
  };
  return (
    <div>
      {/* <p>{userStats[0].username} : Games won:{userStats[0].gamesWon}</p> */}
      <UserProfile currUser={userStats} pokemonSelection={pokemonSelection} />
      <br />
      <br />
      <Outlet />
      <Routes>
        <Route
          path="/"
          element={ gameStart ?
            <Pokedex
            exitGame={exitGame}
              pokemonSelection={pokemonSelection}
              onChoosePokemonClick={(e) => handleChoosePokemonClick(e)}
            /> : <Lobby startGame={startGame} currUser={userStats[0]}/>
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
              bothConfirmed={bothConfirmed}
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