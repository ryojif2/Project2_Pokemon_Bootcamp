import "../App.css";
import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  arrayUnion,
  getDoc,
  deleteDoc,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { firestore } from "../DB/firebase";
//This is the summary page after each battle.
const Results = (props) => {
  const [pastMoves, setPastMoves] = useState([]);

  useEffect(() => {
    const roomRef = doc(firestore, "rooms", props.roomID);
    //room ref displaymsg
    onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("past moves", docSnap.data());
        setPastMoves(docSnap.data().pastMoves);
      }
    });
  }, []);
  //Get data of player chosen pokemon that was used for battle. To use the name and image so that can render out.
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImageFront: playerImageFront,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  const PlayerPokeName = playerPokemonName.toUpperCase();

  //Get data of computer chosen pokemon that was used for battle. To use the name and image so that can render out.
  const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP: computerHP,
    pokemonImageFront: computerImageFront,
    pokemonName: computerPokemonName,
  } = computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();

  //Takes the state of damages dealt for the entire battle and maps the array. Even index is for player. Odd index is for computer.
  const movesHistory = pastMoves.map((move, i) => {
    if (i % 2 === 0) {
      return (
        <p key={i}>
          Your {playerPokemonName} hit enemy {computerPokemonName} with{" "}
          {pastMoves[i].name}for
          {pastMoves[i].power} damage!
        </p>
      );
    } else {
      return (
        <p key={i}>
          Enemy {computerPokemonName} hit your {playerPokemonName} with{" "}
          {pastMoves[i].name}for
          {pastMoves[i].power} damage!
        </p>
      );
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>Battle Summary</p>
        {movesHistory}
        {playerHP === 0 ? (
          <p>Your {playerPokemonName} fainted! You lost!</p>
        ) : (
          <p>Enemy {computerPokemonName} fainted! You won! </p>
        )}
        <h1>Computer</h1>
        <div>
          <img
            style={{ height: "25vh" }}
            src={computerImageFront}
            alt={computerImageFront}
            name={computerPokemonName}
          />
          <h4>{CPokeName}</h4>
          {/* <h4>{PokeType}</h4> */}
        </div>
        <h1>Player (YOU) </h1>
        <div key={playerChosenPokemon} name={playerPokemonName}>
          <img
            style={{ height: "25vh" }}
            src={playerImageFront}
            alt={playerImageFront}
            name={playerPokemonName}
          />
          <h4>{PlayerPokeName}</h4>
          {/* <h4>{PokeType}</h4> */}
        </div>
        <button
          onClick={() => {
            props.onNewBattle();
          }}
        >
          New Battle
        </button>
      </header>
    </div>
  );
};
export default Results;
