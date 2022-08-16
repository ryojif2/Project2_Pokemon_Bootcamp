import React, { useEffect, useState } from "react";
import "../App.css";

const Pokedex = (props) => {
  let pokemonMap = props.pokemonSelection.map((pokemon, i) => {
    const PokeType = pokemon.pokemonType.map((type) => <h5>{type}</h5>);
    // const PokeMoves = pokemon.pokemonMoves.map((move) => <h5>{move}</h5>);
    const PokeName = pokemon.pokemonName.toUpperCase();

    return (
      <div key={pokemon.pokemonName} name={i}>
        <button name={i} onClick={(e) => props.onChoosePokemonClick(e,pokemon)}>
          <img
            style={{ height: "10vh" }}
            src={pokemon.pokemonImageFront}
            alt={pokemon.pokemonImageFront}
            name={i}
          />
          <h4>{PokeName}</h4>
          <h4>{PokeType}</h4>
          <h4>HP: {pokemon.pokemonHP}</h4>
          {/* <h4>Moves: {PokeMoves}</h4> */}
        </button>
      </div>
    );
  });

  return (
    <div className="pokedexMap">
      {pokemonMap}
      {/* <button onClick={(e, chosenPokemon) => props.onSubmit (e, chosenPokemon)}>Confirm</button> */}
    </div>
  );
};

export default Pokedex;
