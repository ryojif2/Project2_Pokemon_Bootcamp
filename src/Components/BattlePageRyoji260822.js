import "../App.css";
import React, { useState, useEffect } from "react";

const BattlePage = (props) => {
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImageFront: playerImageFront,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  // const playerHP=props.playerConfirmedPokemon.pokemonHP;
  // const pokemonImageFront=props.playerConfirmedPokemon.pokemonHP
  // const playerHP=props.playerConfirmedPokemon.pokemonHP

  const PlayerPokeName = playerPokemonName.toUpperCase();
  // const PPokeType = ppokemonType.map((type) => <h5>{type}</h5>);
  // const PPokeMoves = ppokemonMoves.map((move) => <h5>{move}</h5>);

  const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP: computerHP,
    pokemonImageFront: computerImageFront,
    pokemonName: computerPokemonName,
  } = computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();

  console.log(props.historyMoves);
  //onChildChanged
  // [{name: ___ , power: ___},{name:____, power: ___}
  const attackButtons = props.playerArray.map((attack) => {
    return (
      <button
        disabled={!props.isPlayerTurn}
        value={attack.power}
        id={attack.name}
        name={attack.name}
        onClick={(e) => props.onAttack(e)}
      >
        {attack.name}
      </button>
    );
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>Battle page</p>

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
          <h4>HP: {computerHP}</h4>
        </div>
        <div>
          {props.historyMoves.length >= 1 ? (
            // <p>
            //   {" "}
            //   Your {playerPokemonName} has hit enemy {computerPokemonName} for{" "}
            //   {props.historyMoves[0]} damage!{" "}
            // </p>
            <p>
              {" "}
              Your {playerPokemonName} has hit enemy {computerPokemonName} with{" "}
              {props.historyMoves[0].name} for {props.historyMoves[0].power}{" "}
              damage!{" "}
            </p>
          ) : null}
          {props.isPlayerStrong === true ? <p>It's super effective!!</p> : null}
          {props.isComputerStrong === true ? (
            <p>It's not very effective...</p>
          ) : null}
          <br />
          {props.historyMoves.length === 2 ? (
            // <p>
            //   {" "}
            //   Enemy {computerPokemonName} has hit your {playerPokemonName} for{" "}
            //   {props.historyMoves[1]} damage!{" "}
            // </p>
            <p>
              {" "}
              Enemy {computerPokemonName} has hit your {playerPokemonName} with{" "}
              {props.historyMoves[1].name} for {props.historyMoves[1].power}{" "}
              damage!{" "}
            </p>
          ) : null}
          {props.historyMoves.length === 2 &&
          props.isComputerStrong === true ? (
            <p>It's super effective!!</p>
          ) : null}
          {props.historyMoves.length === 2 && props.isPlayerStrong === true ? (
            <p>It's not very effective...</p>
          ) : null}
          <br />
          {props.isPlayerTurn && playerHP > 0 ? (
            <p>Make a move and attack!</p>
          ) : null}
          {computerHP <= 0 ? <p>You have won the battle!</p> : null}
          {playerHP <= 0 ? <p>You have lost the battle!</p> : null}
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
          <h4>HP: {playerHP}</h4>
          {/* <button
            disabled={!props.isPlayerTurn}
            onClick={() => props.onAttack()}
          >
            Attack
          </button> */}

          {attackButtons}

          {playerHP <= 0 || computerHP <= 0 ? (
            <button onClick={() => props.onSummary()}>
              Proceed to Summary
            </button>
          ) : null}
        </div>
      </header>
    </div>
  );
};

export default BattlePage;
