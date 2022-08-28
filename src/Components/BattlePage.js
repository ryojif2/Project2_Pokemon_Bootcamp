import "../App.css";
import "../battle.css";
import React, { useEffect, useState } from "react";
import victory from "../Sounds/victory.mp3";
import button from "../Sounds/button.mp3";
import Battle from "../Sounds/Battle.mp3";
import battleloss from "../Sounds/battleloss.mp3";
import Button from "@mui/material/Button";

const BattlePage = (props) => {
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImage: pokemonImage,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  const PlayerPokeName = playerPokemonName.toUpperCase();

  const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP: computerHP,
    pokemonImage: computerImageFront,
    pokemonName: computerPokemonName,
  } = computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();
  const [attack, setAttack] = useState(false);

  //Audio upon pressing button
  const attackCry = () => {
    props.onAttack();
    setAttack(true);
    console.log("hit");
  };

  console.log(props.historyMoves);

  useEffect(() => {
    if (attack !== false) {
      setTimeout(() => {
        setAttack(false);
      }, 1000);
    }
  }, [attack]);

  useEffect(() => {
    if (computerHP <= 0) {
      props.setBattle(false);
      props.setVictory(true);
    } else if (playerHP <= 0) {
      props.setBattle(false);
      props.setLoss(true);
    }
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
        <h1>Opponent</h1>
        {props.bothConfirmed ? (
          <div
            className={
              computerHP > 0 ? (playerHP > 0 ? "computerP" : "winner") : "loser"
            }
          >
            <h1>Computer</h1>
            <img
              style={{ height: "25vh" }}
              src={computerImageFront}
              alt={computerImageFront}
              name={computerPokemonName}
            />
            <h4>{CPokeName}</h4>
            {/* <h4>{PokeType}</h4> */}
            <h4>HP: {computerHP}</h4>
          </div>
        ) : (
          <p>Waiting for opponent player 2....</p>
        )}

        <br />
        <div
          className={
            playerHP > 0 ? (computerHP > 0 ? "playerP" : "winner") : "loser"
          }
        >
          <h1>{props.currUser.username}</h1>
          <div key={playerChosenPokemon} name={playerPokemonName}>
            <img
              style={{ height: "25vh" }}
              src={pokemonImage}
              alt={pokemonImage}
              name={playerPokemonName}
            />
            <h4>{PlayerPokeName}</h4>
            {/* <h4>{PokeType}</h4> */}
            <Button onClick={() => attackCry()} disabled={!props.isPlayerTurn}>
              Attack
            </Button>
            <h4>HP: {playerHP}</h4>
          </div>
        </div>
        <div>
          {playerHP <= 0 || computerHP <= 0 ? (
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
