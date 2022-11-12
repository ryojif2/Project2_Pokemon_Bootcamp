import "../App.css";
import "../battle.css";
import victory from "../Sounds/victory.mp3";
import battleloss from "../Sounds/battleloss.mp3";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../DB/firebase";
//This is the summary page after each battle.
const Results = (props) => {
  const [pastMoves, setPastMoves] = useState([]);

  useEffect(() => {
    const roomRef = doc(firestore, "rooms", props.roomID);
    //room ref displaymsg
    onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setPastMoves(docSnap.data().pastMoves);
      }
    });
  }, []);
  //Get data of player chosen pokemon that was used for battle. To use the name and image so that can render out.
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImageFront: playerImageFront,
    pokemonImage: pokemonImage,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  const PlayerPokeName = playerPokemonName.toUpperCase();

  //Get data of computer chosen pokemon that was used for battle. To use the name and image so that can render out.
  const computerChosenPokemon = props.computerConfirmedPokemon;
  const { pokemonImage: computerImageFront, pokemonName: computerPokemonName } =
    computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();

  //Takes the state of damages dealt for the entire battle and maps the array. Even index is for player. Odd index is for computer.
  const movesHistory = pastMoves.map((move, i) => {
    if (i % 2 === 0) {
      return (
        <p key={i}>
          Your {playerPokemonName} hit enemy {computerPokemonName} with{" "}
          {pastMoves[i].name} for {pastMoves[i].power} damage!
        </p>
      );
    } else {
      return (
        <p key={i}>
          Enemy {computerPokemonName} hit your {playerPokemonName} with{" "}
          {pastMoves[i].name} for {pastMoves[i].power} damage!
        </p>
      );
    }
  });

  return (
    <div className="App">
      {props.victory === true ? (
        <audio autoPlay loop src={victory}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      {props.loss === true ? (
        <audio autoPlay loop src={battleloss}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <header>
        <p>Battle Summary</p>
        {movesHistory}
        <div className={playerHP > 0 ? "winner" : "loser"}>
          {playerHP === 0 ? (
            <p>Your {playerPokemonName} fainted! You lost!</p>
          ) : (
            <p>Enemy {computerPokemonName} fainted! You won! </p>
          )}
        </div>
        <div className={playerHP > 0 ? "loser" : "winner"}>
          <h1>
            {" "}
            {props.gameType === "pvp"
              ? computerChosenPokemon.username
              : "Computer"}
          </h1>
          <img
            style={{ height: "25vh" }}
            src={computerImageFront}
            alt={computerImageFront}
            name={computerPokemonName}
          />
          <h4>{CPokeName}</h4>
        </div>
        <div className={playerHP > 0 ? "winner" : "loser"}>
          <h1>Player (YOU) </h1>
          <div key={playerChosenPokemon} name={playerPokemonName}>
            <img
              style={{ height: "25vh" }}
              src={pokemonImage}
              alt={pokemonImage}
              name={playerPokemonName}
            />
            <h4>{PlayerPokeName}</h4>
          </div>
        </div>
        <Button
          onClick={() => {
            props.onNewBattle();
          }}
          style={{
            borderRadius: 10,
            backgroundColor: "white",
            padding: "10px 15px",
            fontSize: "10px",
          }}
        >
          New Battle
        </Button>
      </header>
    </div>
  );
};
export default Results;
