import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = (props) => {
  //initiate states for user specific win rate & most used pokemon.
  const [winRate, setWinRate] = useState();
  const [mostUsedPokemonImage, setMostUsedPokemonImage] = useState("");
  console.log(props.pokemonSelection);
  console.log(mostUsedPokemonImage);

  // To only load user profile after all the components load, and after props.currUser loads (i.e. userStats state in Mainpage.js)
  useEffect(() => {
    if (props.currUser[0]) {
      const { gamesPlayed, gamesWon, mostUsed } = props.currUser[0];
      setWinRate(((gamesWon / gamesPlayed) * 100).toFixed(2));

      if (mostUsed !== "") {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${mostUsed}`)
          .then((result) => {
            const { sprites } = result.data;
            const pokemonImageFront = sprites.front_default;
            return pokemonImageFront;
          })
          .then((data) => setMostUsedPokemonImage(data));

        //Below commented code will bug out when User returns to main page to choose pokemon to start new battle. This is because pokemonSelection state is reset and reloaded when we navigate. Results in undefined values.
        // const mostUsedPokemonObject = props.pokemonSelection.find(
        //   (pokemon) => pokemon.pokemonName == mostUsed
        // );
        // console.log(mostUsedPokemonObject);
        // setMostUsedPokemonImage(mostUsedPokemonObject.pokemonImageFront);
      }
    } else return;
  }, [props.currUser]);

  // console.log(mostUsedPokemonImage);

  return (
    <div>
      {props.currUser[0] != null &&
      Object.keys(props.currUser[0]).length !== 0 ? (
        <div>
          <p>Welcome back user {props.currUser[0].username}!</p>
          <p>Games Played: {props.currUser[0].gamesPlayed}</p>
          <p>Games Won: {props.currUser[0].gamesWon}</p>
          {props.currUser[0].gamesPlayed === 0 ? (
            <p>Win Rate: NA </p>
          ) : (
            <p>Win Rate: {winRate}%</p>
          )}
          {props.currUser[0].mostUsed !== "" ? (
            <div>
              <p>Most used Pokemon: {props.currUser[0].mostUsed} </p>
              <img
                style={{ height: "20vh" }}
                src={mostUsedPokemonImage}
                alt={mostUsedPokemonImage}
              />
            </div>
          ) : (
            <p>Most used Pokemon: NA</p>
          )}
        </div>
      ) : (
        <p>Welcome back user!</p>
      )}
    </div>
  );
};

export default UserProfile;
