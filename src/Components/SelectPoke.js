import React from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../DB/firebase";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";

const SelectPoke = (props) => {
  let navigate = useNavigate();

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
