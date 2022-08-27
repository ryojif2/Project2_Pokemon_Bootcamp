import "../App.css";
import React, { useState, useEffect } from "react";
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
import { firestore } from "../DB/firebase";
import { chainPropTypes } from "@mui/utils";

const BattlePage = (props) => {
  const [gameConfirmed, setGameConfirmed] = useState(false);
  const [computerChosenPokemon, setComputerConfirmedPokemon] = useState();
  //   const [pvpMode,setPvpMode]=useState()
  //   const [userData,setUserData]=useState()
  //   //try to get otherPlayer ID and info!
  //   if(props.gameType==='pvp'){
  //     setPvpMode(true) }
  // if (props.userStats){
  //   setUserData(props.userStats)
  // }
  console.log(props.playerConfirmedPokemon);
  console.log(props.isPlayerTurn);
  console.log(props.userStats);
  console.log(props.computerConfirmedPokemon);
  console.log(props.historyMoves);

  useEffect(() => {
    if (props.gameType === "pvp") {
      const roomRef = doc(firestore, "rooms", props.roomID);
      getDoc(roomRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          if (props.userStats.username !== docSnap.data().users[0]) {
            props.setPlayerTurn(false);
            props.setOtherPlayerTurn(true);
          }
        }
      });
    }
  }, []);

  // if(props.userStats.username === )
  //if i am the 2nd player, set isPlayerTurn to false. if computerConfirmedpokemon.username ==

  useEffect(() => {
    if (
      props.gameType === "pvp" &&
      props.computerConfirmedPokemon.confirmed === true &&
      props.playerConfirmed === true
    ) {
      setGameConfirmed(true);
      props.setBothConfirmed(true);
      console.log("both confirmed true USEEFFECT BATTLEPAGE");
    }
    if (
      props.gameType === "pve" &&
      props.computerConfirmedPokemon &&
      props.playerConfirmed === true
    ) {
      setGameConfirmed(true);
      props.setBothConfirmed(true);
      console.log("both confirmed true USEEFFECT BATTLEPAGE");
    }

    if (props.computerConfirmedPokemon) {
      console.log(props.computerConfirmedPokemon);
      props.setOtherUserStats(props.computerConfirmedPokemon);
    }
  }, [props.computerConfirmedPokemon, props.playerConfirmed]);

  // useEffect(()=>{

  //  if (pvpMode===true && props.gameType==='pvp') {
  //       console.log('roomID',props.roomID,'useEFFECT SNAPSHOT' )
  // const otherUserRef = collection(firestore, "rooms",props.roomID,'users');
  // // Create a query against the collection.
  // const q = query(otherUserRef, where("username", "!=", userData.username));
  // // onSnapshot(q,(snapshot)=>{
  // //     console.log({...doc.data(), id:doc.id})
  // //   setOtherUserStats(snapshot.docs.map((doc)=>({id:doc.id, ...doc.data()})))
  // // })
  //  onSnapshot(collection(firestore,'rooms',props.roomID,'users'),where('username','!=',userData.username), (snapshot) => {
  //   console.log(snapshot.docs);
  //   snapshot.docs.forEach((doc)=>{console.log(doc.data())})
  // })

  // onSnapshot(q, {includeMetaDataChanges:true },(querySnapshot) => {
  //   const otherUserData = [];
  //   querySnapshot.forEach((doc) => {
  //       otherUserData.push(doc.data());
  //   })
  // console.log(otherUserData,'otheruserData')
  // setComputerConfirmedPokemon(otherUserData)
  // });

  // getDocs(q).then(snapshot=>snapshot.forEach(snapshot=>console.log(snapshot.data())))
  // if (otherPlayerConfirmedPokemon!=={})
  // {console.log("OTHER USER EXIST!!!! other player pokemon state", otherPlayerConfirmedPokemon);
  // //check if confirmed for both
  // if (userStats[0].confirmed && otherPlayerConfirmedPokemon.confirmed){
  //   setBothConfirmed(true)}
  // }
  //}},[])

  //maybe need IF STATEMENT here
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImageFront: playerImageFront,
    pokemonName: playerPokemonName,
    pokemonType: playerPokemonType,
  } = playerChosenPokemon;

  // const playerHP=props.playerConfirmedPokemon.pokemonHP;
  // const pokemonImageFront=props.playerConfirmedPokemon.pokemonHP
  // const playerHP=props.playerConfirmedPokemon.pokemonHP

  // const PPokeType = ppokemonType.map((type) => <h5>{type}</h5>);
  // const PPokeMoves = ppokemonMoves.map((move) => <h5>{move}</h5>);

  // if (gameConfirmed && props.computerConfirmedPokemon)
  //  {
  // )

  // const PlayerPokeName = playerPokemonName.toUpperCase();

  // setComputerConfirmedPokemon(props.computerConfirmedPokemon)
  //  const computerChosenPokemon = props.computerConfirmedPokemon;
  // const {
  //   pokemonHP,
  //   pokemonImageFront,
  //   pokemonName
  // } = computerChosenPokemon;

  // const computerChosenPokemon = props.computerConfirmedPokemon;
  // const {
  //   pokemonHP: computerHP,
  //   pokemonImageFront: computerImageFront,
  //   pokemonName: computerPokemonName,
  // } = computerChosenPokemon;

  // const CPokeName = computerPokemonName.toUpperCase();

  // }

  // const otherPlayerChosenPokemon = props.otherPlayerConfirmedPokemon;
  // const {
  //   pokemonHP:  otherPlayerHP,
  //   pokemonImageFront:  otherPlayerImageFront,
  //   pokemonName:  otherPlayerPokemonName,
  // } =  otherPlayerChosenPokemon;

  // const  otherPlayerPokeName =  otherPlayerPokemonName.toUpperCase();

  return (
    <div className="App">
      <header className="App-header">
        <p>Battle page</p>
        <h1>Opponent </h1>
        {gameConfirmed ? (
          <div>
            {/* <h1>opponent</h1> */}
            <img
              style={{ height: "25vh" }}
              src={props.computerConfirmedPokemon.pokemonImageFront}
              alt={props.computerConfirmedPokemon.pokemonImageFront}
              name={props.computerConfirmedPokemon.pokemonName}
            />
            <h4>{props.computerConfirmedPokemon.pokemonName}</h4>
            <h4>{props.computerConfirmedPokemon.pokemonType}</h4>
            <h4>HP: {props.computerConfirmedPokemon.pokemonHP}</h4>
          </div>
        ) : (
          <p>Waiting for opponent player 2....</p>
        )}

        {/* {props.historyMoves.length >= 1 ? (
            <p>
              {" "}
              Your {playerPokemonName} has hit enemy {computerPokemonName} for{" "}
              {props.historyMoves[0]} damage!{" "}
            </p>
          ) : null}
          {props.historyMoves.length === 2 ? (
            <p>
              {" "}
              Enemy {computerPokemonName} has hit your {playerPokemonName} for{" "}
              {props.historyMoves[1]} damage!{" "}
            </p>
          ) : null}
          {props.isPlayerTurn && playerHP > 0 ? (
            <p>Make a move and attack!</p>
          ) : null}
          {computerHP <= 0 ? <p>You have won the battle!</p> : null}
          {playerHP <= 0 ? <p>You have lost the battle!</p> : null}
        </div> */}
        <h1>Player (YOU) </h1>
        <div key={playerChosenPokemon} name={playerPokemonName}>
          <img
            style={{ height: "25vh" }}
            src={playerImageFront}
            alt={playerImageFront}
            name={playerPokemonName}
          />
          <h4>{playerPokemonName}</h4>
          <h4>{playerPokemonType}</h4>
          <h4>HP: {playerHP}</h4>
          {/* <button
            disabled={props.computerConfirmedPokemon.turn}
            onClick={() => props.onAttack(props)}
          >
            Attack
          </button> */}
          <button
            disabled={!props.isPlayerTurn}
            onClick={() => props.onAttack(props)}
          >
            Attack
          </button>
          {/* {(playerHP <= 0 || computerHP <= 0)? (
            <button onClick={() => props.onSummary()}>
              Proceed to Summary
            </button>
          ) : null} */}
        </div>
      </header>
    </div>
  );
};

export default BattlePage;
