
import "../App.css";
import React, { useState, useEffect } from "react";


const BattlePage = (props) => {

  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP:playerHP,
    pokemonImageFront:playerImageFront,
    pokemonName:playerPokemonName,
  } = playerChosenPokemon;

  // const playerHP=props.playerConfirmedPokemon.pokemonHP;
  // const pokemonImageFront=props.playerConfirmedPokemon.pokemonHP
  // const playerHP=props.playerConfirmedPokemon.pokemonHP

  const PlayerPokeName = playerPokemonName.toUpperCase();
  // const PPokeType = ppokemonType.map((type) => <h5>{type}</h5>);
  // const PPokeMoves = ppokemonMoves.map((move) => <h5>{move}</h5>);
 
 const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP:computerHP,
    pokemonImageFront:computerImageFront,
    pokemonName:computerPokemonName,
  } = computerChosenPokemon;

 
  const CPokeName = computerPokemonName.toUpperCase();

  //onChildChanged

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
       <div>  <p>Make a move and attack!</p></div>
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
       <button>Attack</button>
       </div>
      </header>
    </div>
  );
};

export default BattlePage;