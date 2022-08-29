import React from "react";
import "../App.css";
import PokeCard from "./Card";
import "../Pokedex.css";

const Pokedex = (props) => {
  const { onChoosePokemonClick } = props;
  let pokemonMap = props.pokemonSelection.map((pokemon, i) => {
    const PokeType = pokemon.pokemonType.map((type) => <p>{type}</p>);

    return (
      <div className="app-container">
        <div className="pokemon-container">
          <PokeCard
            id={i}
            name={pokemon.pokemonName.toUpperCase()}
            image={pokemon.pokemonImage}
            type={PokeType}
            key={i}
            HP={pokemon.pokemonHP}
            onChoosePokemonClick={onChoosePokemonClick}
          />
        </div>
      </div>
    );
  });

  return (
    <div>
      <button onClick={props.exitGame}>Exit Room</button>
      <p>Ready for your next battle?</p>
      <p>Choose your Pokemon below! </p>
      <div className="pokedexMap">{pokemonMap}</div>
    </div>
  );
};

export default Pokedex;
