import React from "react";
import axios from "axios";
import "../App.css";
import ConfirmedCard from "./ConfirmedCard";

const SelectPoke = (props) => {
  const { onReselectPokemon, setPlayerArray, onConfirmPokemon } = props;
  const chosenPokemon = props.selectedPokemon;
  const {
    pokemonHP,
    pokemonMoves,
    pokemonMovesURL,
    pokemonName,
    pokemonType,
    pokemonImage,
  } = chosenPokemon;

  const PokeName = pokemonName.toUpperCase();
  const PokeType = pokemonType.map((type) => <h5>{type}</h5>);
  const PokeMoves = pokemonMoves.map((move) => <h5>{move}</h5>);

  const playerAttackArray = [];

  pokemonMovesURL.map((url) => {
    axios.get(url).then((response) => {
      let { name, power } = response.data;

      console.log(name);
      console.log(power);
      let modifiedPower = 1;
      if (power === null) {
        playerAttackArray.push(modifiedPower);
      } else {
        playerAttackArray.push(power);
      }
      return playerAttackArray;
    });
  });

  return (
    <div key={chosenPokemon} name={pokemonName}>
      <ConfirmedCard
        name={PokeName}
        image={pokemonImage}
        type={PokeType}
        HP={pokemonHP}
        Moves={PokeMoves}
        onReselectPokemon={onReselectPokemon}
        setPlayerArray={setPlayerArray}
        onConfirmPokemon={onConfirmPokemon}
        playerAttackArray={playerAttackArray}
        chosenPokemon={chosenPokemon}
      />
    </div>
  );
};
export default SelectPoke;
