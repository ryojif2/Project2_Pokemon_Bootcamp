import React from "react";
import axios from "axios";
import {useEffect} from "react";

const SelectPoke = (props) => {
//  useEffect(()=>{ 
   const chosenPokemon = props.selectedPokemon;
  const {
    pokemonHP,
    pokemonImageFront,
    pokemonMoves,
    pokemonMovesURL,
    pokemonName,
    pokemonType,
  } = chosenPokemon;
  const PokeName = pokemonName.toUpperCase();
  const PokeType = pokemonType.map((type) => <h5>{type}</h5>);
  const PokeMoves = pokemonMoves.map((move) => <h5>{move}</h5>);
  // console.log(chosenPokemon);
  console.log(pokemonMovesURL);

  const playerAttackArray = [];

  pokemonMovesURL.map((url) => {
    axios.get(url).then((response) => {
      const { name, power } = response.data;
      console.log(name);
      console.log(power);
      playerAttackArray.push(power);
      return playerAttackArray;
    });
  });



  return (
    //repeating pokedex ?
    <div key={chosenPokemon} name={pokemonName}>
      <img
        style={{ height: "30vh" }}
        src={pokemonImageFront}
        alt={pokemonImageFront}
        name={pokemonName}
      />
      <h4>{PokeName}</h4>
      <h4>{PokeType}</h4>
      <h4>HP: {pokemonHP}</h4>
      <h4>Moves: {PokeMoves}</h4>
      <button onClick={(e) => props.onReselectPokemon(e)}>
        Back to Main Pokedex
      </button>
      <button
        onClick={(e) => {
          props.setPlayerArray(playerAttackArray);
          props.onConfirmPokemon(chosenPokemon);

        }}
      >
        Confirm
      </button>
    </div>
  );
};
export default SelectPoke;
