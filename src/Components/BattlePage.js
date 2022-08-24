import "../App.css";
import "../battle.css";
import React, { useEffect, useState } from "react";
import victory from "../Sounds/victory.mp3";
import button from "../Sounds/button.mp3";
import Battle from "../Sounds/Battle.mp3";
import battleloss from "../Sounds/battleloss.mp3";

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
    <div className="App">
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
        <h1>Battle page</h1>
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
            {/* <h4>HP: {playerHP}</h4> */}
            <button onClick={() => attackCry()} disabled={!props.isPlayerTurn}>
              Attack
            </button>
            <h4>HP: {playerHP}</h4>
          </div>
        </div>
        <div>
          {playerHP <= 0 || computerHP <= 0 ? (
            <button onClick={() => props.onSummary()}>
              Proceed to Summary
            </button>
          ) : null}
        </div>
        <br />
        <div className={computerHP <= 0 ? "winner" : "loser"}>
          {props.historyMoves.length >= 1 ? (
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
        </div>
      </header>
    </div>
  );
};

export default BattlePage;
