import "../App.css";
import "../battle.css";
import React, { useEffect, useState } from "react";
import victory from "../Sounds/victory.mp3";
import button from "../Sounds/button.mp3";
import Battle from "../Sounds/Battle.mp3";
import battleloss from "../Sounds/battleloss.mp3";
import Button from "@mui/material/Button";
import { onSnapshot, getDoc, doc } from "firebase/firestore";

import { firestore } from "../DB/firebase";

const BattlePage = (props) => {
  const [gameConfirmed, setGameConfirmed] = useState(false);
  const [movesDisplay, setMovesDisplay] = useState("Make a move!");

  useEffect(() => {
    if (props.gameType === "pvp") {
      const roomRef = doc(firestore, "rooms", props.roomID);
      getDoc(roomRef).then((docSnap) => {
        if (docSnap.exists()) {
          if (props.userStats.username !== docSnap.data().users[0]) {
            props.setPlayerTurn(false);
            props.setOtherPlayerTurn(true);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (
      props.gameType === "pvp" &&
      props.computerConfirmedPokemon.confirmed === true &&
      props.playerConfirmed === true
    ) {
      setGameConfirmed(true);
      props.setBothConfirmed(true);
    }
    if (
      props.gameType === "pve" &&
      props.computerConfirmedPokemon &&
      props.playerConfirmed === true
    ) {
      setGameConfirmed(true);
      props.setBothConfirmed(true);
    }
  }, [props.computerConfirmedPokemon, props.playerConfirmed]);

  useEffect(() => {
    const roomRef = doc(firestore, "rooms", props.roomID);
    //room ref displaymsg
    onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setMovesDisplay(docSnap.data().displayMsg);
      }
    });
    //other user ref health and turn

    const userRef = doc(
      firestore,
      "rooms",
      props.roomID,
      "users",
      props.userStats.username
    );
    onSnapshot(userRef, (userSnap) => {
      props.setPlayerTurn(userSnap.data().turn);
      props.setPlayerConfirmedPokemon((prevState) => {
        return {
          ...prevState,
          pokemonHP: userSnap.data().pokemonHP,
          turn: userSnap.data().turn,
        };
      });
    });
  }, [props.playerTurn, props.otherPlayerTurn]);

  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImage: pokemonImage,
    pokemonName: playerPokemonName,
    pokemonType: playerPokemonType,
  } = playerChosenPokemon;

  const [attack, setAttack] = useState(false);

  //Audio upon pressing button
  const attackCry = () => {
    props.onAttack();
    setAttack(true);
  };

  useEffect(() => {
    if (attack !== false) {
      setTimeout(() => {
        setAttack(false);
      }, 1000);
    }
  }, [attack]);

  useEffect(() => {
    if (props.computerConfirmedPokemon.pokemonHP <= 0) {
      props.setBattle(false);
      props.setVictory(true);
    } else if (playerHP <= 0) {
      props.setBattle(false);
      props.setLoss(true);
    }
  });

  var randomColorRgbValues =
    "rgb(" +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    ")";

  const attackButtons = props.playerArray.map((attack) => {
    return (
      <div className="attackButtons">
        <Button
          disabled={
            !props.isPlayerTurn ||
            playerHP <= 0 ||
            props.computerConfirmedPokemon.pokemonHP <= 0
          }
          onClick={(e) => props.onAttack(e)}
          value={attack.power}
          id={attack.name}
          name={attack.name}
          style={{
            backgroundColor: `${randomColorRgbValues}`,
            color: "black",
            opacity: "80%",
          }}
          size="small"
        >
          {attack.name}
        </Button>
      </div>
    );
  });

  return (
    <div className={props.victory === true ? "fireworks" : null}>
      {props.battle === true ? (
        <audio loop autoPlay src={Battle}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
      {attack === true ? (
        <audio autoPlay src={button}>
          Your browser does not support the audio element.
        </audio>
      ) : null}
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
      <header className="battlePage">
        <h1>
          {props.gameType === "pvp"
            ? props.computerConfirmedPokemon.username
            : "Computer"}
        </h1>
        {gameConfirmed || props.bothConfirmed ? (
          <div
            className={
              props.computerConfirmedPokemon.pokemonHP > 0
                ? playerHP > 0
                  ? "computerP"
                  : "winner"
                : "loser"
            }
          >
            <img
              style={{ height: "25vh" }}
              src={props.computerConfirmedPokemon.pokemonImage}
              alt={props.computerConfirmedPokemon.pokemonImage}
              name={props.computerConfirmedPokemon.pokemonName}
            />
            <h4>{props.computerConfirmedPokemon.pokemonName}</h4>
            <h4>{props.computerConfirmedPokemon.pokemonType}</h4>
            <h4>HP: {props.computerConfirmedPokemon.pokemonHP}</h4>
          </div>
        ) : (
          <p>Waiting for opponent player 2....</p>
        )}
        <br />
        <div
          className={
            playerHP > 0
              ? props.computerConfirmedPokemon.pokemonHP > 0
                ? "playerP"
                : "winner"
              : "loser"
          }
        >
          <div className="moves">{movesDisplay}</div>
          <div>
            {props.playerConfirmedPokemon &&
            props.isPlayerTurn &&
            playerHP > 0 ? (
              <div>Make a move and attack!</div>
            ) : null}

            {props.computerConfirmedPokemon.pokemonHP <= 0 ? (
              <p>You have won the battle!</p>
            ) : null}
            {playerHP <= 0 ? <p>You have lost the battle!</p> : null}
          </div>

          <h1>{props.currUser.username}</h1>
          <div key={playerChosenPokemon} name={playerPokemonName}>
            <img
              style={{ height: "25vh" }}
              src={pokemonImage}
              alt={pokemonImage}
              name={playerPokemonName}
            />
            <h4>{playerPokemonName}</h4>
            <h4>{playerPokemonType}</h4>
            {attackButtons}
            <h4>HP: {playerHP}</h4>
          </div>
        </div>
        <div>
          {playerHP <= 0 || props.computerConfirmedPokemon.pokemonHP <= 0 ? (
            <Button onClick={() => props.onSummary()}>
              Proceed to Summary
            </Button>
          ) : null}
        </div>

        <br />
      </header>
    </div>
  );
};

export default BattlePage;
