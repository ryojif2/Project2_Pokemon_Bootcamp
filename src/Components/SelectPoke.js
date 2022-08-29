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
    pokemonTypeURL,
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
        const movesWithPower = {
          name: name,
          power: modifiedPower,
        };
        playerAttackArray.push(movesWithPower);
        // playerAttackArray.push(modifiedPower);
      } else {
        const movesWithPower = {
          name: name,
          power: power,
        };
        playerAttackArray.push(movesWithPower);
        // playerAttackArray.push(power);
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
      console.log(weakToTypes);
      console.log(strongToTypes);
      weakType.push(...weakToTypes);
      strongType.push(...strongToTypes);
      // weakType.push(weakToTypes);
      // strongType.push(strongToTypes);
    });
  });
  console.log(weakType);

  const logout = () => {
    console.log("logout");
    signOut(auth);
    navigate("/");
    console.log(props.loggedInUser);
  };

  console.log(chosenPokemon);
  return (
    //repeating pokedex ?
    <div key={chosenPokemon} name={pokemonName}>
      {props.gameType === "pvp" && props.otherPlayerExist ? (
        <p>Player 2 is in the room</p>
      ) : null}
      {props.gameType === "pvp" && !props.otherPlayerExist ? (
        <p>Wait for player 2 to enter before confirm...</p>
      ) : null}
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
        disabled={props.gameType === "pvp" && !props.otherPlayerExist}
        onClick={() => {
          props.setPlayerArray(playerAttackArray);
          props.onConfirmPokemon(chosenPokemon);
          //set state to store strong and weak types of player pokemon after clicking confirm pokemon
          props.setPlayerStrongType(strongType);
          props.setPlayerWeakType(weakType);
        }}
      >
        Confirm
      </button>
    </div>
  );
};
export default SelectPoke;
