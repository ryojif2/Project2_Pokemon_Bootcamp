import React from "react";
import axios from "axios";

import { useEffect, useState } from "react";

const SelectPoke = (props) => {
  //  useEffect(()=>{
  console.log(props);
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

  const logout = () => {
    console.log("logout");
    props.setLoggedInUser(false);
    signOut(auth);
    navigate("/");
  };

  // // const computerPokemonSelect = props.selectComputerPokemon;
  // props.selectComputerPokemon();

  const selectComputerPokemon = (playerPokemon) => {
    for (let i = 0; i < props.availablePokemon.length; i++) {
      if (props.availablePokemon[i].pokemonName == playerPokemon.pokemonName) {
        props.availablePokemon.splice(i, 1);
      }
    }
    const computerPokemonObject =
      props.availablePokemon[Math.floor(Math.random() * 8 + 1)];

    getComputerArray(computerPokemonObject);

    return computerPokemonObject;
  };

  const getComputerArray = (pokeAPI) => {
    const { pokemonMovesURL } = pokeAPI;
    const compArray = [];
    pokemonMovesURL.map((url) => {
      axios.get(url).then(
        (response) => {
          const { name, power } = response.data;
          console.log(name);
          console.log(power);
          console.log(compArray, "compArray");
          console.log("hi running ");
          compArray.push(power);
        }
        // else {setComputerArray([power])
        // console.log("dun exist")}
      );
    });
    console.log("set comp array!");
    props.computerMovesState(compArray);
  };

  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    props.computerPokemonState(selectComputerPokemon(chosenPokemon));
    setIsLoaded(true);
  } else {
    console.log("loaded");
  }

  console.log();
  // const data = selectComputerPokemon(chosenPokemon);

  // props.setComputerPokemonState(data);

  return (
    //repeating pokedex ?
    <div key={chosenPokemon} name={pokemonName}>
      <img
        style={{ height: "30vh" }}
        src={pokemonImageFront}
        alt={pokemonImageFront}
        name={pokemonName}
      />
      <p>{PokeName}</p>
      <p>{PokeType}</p>
      <p>HP: {pokemonHP}</p>
      <p>Moves: {PokeMoves}</p>
      <button onClick={(e) => props.onReselectPokemon(e)}>
        Back to Main Pokedex
      </button>
      <button
        onClick={() => {
          props.setPlayerArray(playerAttackArray);

          props.onConfirmPokemon(chosenPokemon);
        }}
      >
        Confirm
      </button>

      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
export default SelectPoke;
