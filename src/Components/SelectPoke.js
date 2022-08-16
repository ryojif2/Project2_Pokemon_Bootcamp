import React from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const SelectPoke = (props) => {
  let navigate = useNavigate();
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

  console.log(playerAttackArray);

  return (
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
          props.onConfirmPokemon(e);
        }}
      >
        Confirm
      </button>

      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
export default SelectPoke;
