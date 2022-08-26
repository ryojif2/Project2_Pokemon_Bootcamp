import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import "../App.css";

// import Dialog from "@mui/material/Dialog";

const UserProfile = (props) => {
  //initiate states for user specific win rate & most used pokemon.
  const [winRate, setWinRate] = useState();
  const [mostUsedPokemonImage, setMostUsedPokemonImage] = useState("");
  // console.log(props.pokemonSelection);
  // console.log(props.mostUsedPokemonImage);

  // To only load user profile after all the components load, and after props.userData loads (i.e. userStats state in Mainpage.js)
  useEffect(() => {
    if (props.userData.length !== 0) {
      const { gamesPlayed, gamesWon, mostUsed } = props.userData;
      setWinRate(((gamesWon / gamesPlayed) * 100).toFixed(2));

      if (mostUsed !== "") {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${mostUsed}`)
          .then((result) => {
            const { sprites } = result.data;
            console.log(sprites);
            const pokemonImageFront = sprites.other.dream_world.front_default;
            return pokemonImageFront;
          })
          .then((data) => setMostUsedPokemonImage(data));
      }
    } else return;
  }, [props.userData]);

  //Below commented code will bug out when User returns to main page to choose pokemon to start new battle. This is because pokemonSelection state is reset and reloaded when we navigate. Results in undefined values.
  // const mostUsedPokemonObject = props.pokemonSelection.find(
  //   (pokemon) => pokemon.pokemonName == mostUsed
  // );
  // console.log(mostUsedPokemonObject);
  // setMostUsedPokemonImage(mostUsedPokemonObject.pokemonImageFront);

  // console.log(mostUsedPokemonImage);

  const [open, setOpen] = React.useState(true);
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <IconButton
        size="large"
        edge="start"
        aria-label="menu"
        sx={{ mr: 2 }}
        style={{ background: "#ffff" }}
        onClick={handleOpen}
        showLabels
      >
        Hi
      </IconButton> */}
      <Modal open={open} onClose={handleClose}>
        {props.userData != null ? (
          <div>
            <p>Welcome back user {props.userData.username}!</p>
            <p>Games Played: {props.userData.gamesPlayed}</p>
            <p>Games Won: {props.userData.gamesWon}</p>
            {props.userData.gamesPlayed === 0 ? (
              <p>Win Rate: NA </p>
            ) : (
              <p>Win Rate: {winRate}%</p>
            )}
            {props.userData.mostUsed !== "" ? (
              <div>
                <p>
                  Most used Pokemon: {props.userData.mostUsed.toUpperCase()}{" "}
                </p>
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
      </Modal>
    </div>
  );
};

export default UserProfile;
