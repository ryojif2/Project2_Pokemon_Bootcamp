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

  return (
    <div className="App">
      <header className="App-header">
        <p>Battle page</p>
  <h1>Other player / Computer </h1>
  { props.bothConfirmed ? 
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
  </div>: <p>Waiting for player 2....</p>}
  <div> 
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
          <button
            disabled={!props.isPlayerTurn}
            onClick={() => props.onAttack(props)}
          >
            Attack
          </button>
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