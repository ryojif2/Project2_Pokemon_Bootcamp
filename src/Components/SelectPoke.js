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
    pokemonTypeURL,
    pokemonImage,
  } = chosenPokemon;

  const PokeName = pokemonName.toUpperCase();
  const PokeType = pokemonType.map((type) => <h5>{type}</h5>);
  const PokeMoves = pokemonMoves.map((move) => <h5>{move}</h5>);

  const playerAttackArray = [];

  pokemonMovesURL.map((url) => {
    axios.get(url).then((response) => {
      let { name, power } = response.data;

      let modifiedPower = 1;
      if (power === null) {
        const movesWithPower = {
          name: name,
          power: modifiedPower,
        };
        playerAttackArray.push(movesWithPower);
      } else {
        const movesWithPower = {
          name: name,
          power: power,
        };
        playerAttackArray.push(movesWithPower);
      }
      return playerAttackArray;
    });
  });

  //initiate array to store selected pokemon's weak types and strong types.
  const weakType = [];
  const strongType = [];

  //initiate promise to obtain information on the strong and weak types of the pokemon.
  const typePromise = [];
  pokemonTypeURL.map((type) => {
    typePromise.push(axios.get(type));
  });

  Promise.all(typePromise).then((results) => {
    results.map((typeData) => {
      const { double_damage_from, double_damage_to } =
        typeData.data.damage_relations;

      const weakToTypes = double_damage_from.map((type) => {
        const { name } = type;

        return name;
      });
      const strongToTypes = double_damage_to.map((type) => {
        const { name } = type;

        return name;
      });
      weakType.push(...weakToTypes);
      strongType.push(...strongToTypes);
      // weakType.push(weakToTypes);
      // strongType.push(strongToTypes);
    });
  });

  return (
    <div className="select">
      <div key={chosenPokemon} name={pokemonName}>
        {props.gameType === "pvp" && props.otherPlayerExist ? (
          <p>Player 2 is in the room</p>
        ) : null}
        {props.gameType === "pvp" && !props.otherPlayerExist ? (
          <p>Wait for player 2 to enter before confirm...</p>
        ) : null}

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
          setPlayerStrongType={props.setPlayerStrongType}
          setPlayerWeakType={props.setPlayerWeakType}
          gameType={props.gameType}
          otherPlayerExist={props.otherPlayerExist}
          strongType={strongType}
          weakType={weakType}
        />
      </div>
    </div>
  );
};
export default SelectPoke;
