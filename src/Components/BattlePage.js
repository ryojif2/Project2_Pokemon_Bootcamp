import "../App.css";
import React, { useEffect, useState } from "react";
import gym from "../Sounds/gym.mp3";

const BattlePage = (props) => {
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImage: pokemonImage,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  const PlayerPokeName = playerPokemonName.toUpperCase();

  const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP: computerHP,
    pokemonImage: computerImageFront,
    pokemonName: computerPokemonName,
  } = computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();
  const [attack, setAttack] = useState(false);
  //Audio upon pressing button
  const attackCry = () => {
    setAttack(true);
    console.log("hit");
  };

  // useEffect(() => {
  //   attack === true ? setAttack(false) : null;
  // });

  useEffect(() => {
    if (attack !== false) {
      setTimeout(() => {
        setAttack(false);
      }, 1000);
    }
  }, [attack]);

  return (
    <div className="App">
      {attack === true ? (
        <audio
          autoPlay
          src="https://play.pokemonshowdown.com/audio/cries/alakazam-mega.ogg"
        >
          Your browser does not support the audio element.
        </audio>
      ) : null}
      <header className="App-header">
        <p>Battle page</p>

        <h1>Computer</h1>
        <div>
          <img
            style={{ height: "25vh" }}
            src={computerImageFront}
            alt={computerImageFront}
            name={computerPokemonName}
          />
          {/* <h4>{CPokeName}</h4> */}
          {/* <h4>{PokeType}</h4> */}
          {/* <h4>HP: {computerHP}</h4> */}
        </div>
        <div>
          {" "}
          <p>Make a move and attack!</p>
        </div>
        <h1>Player (YOU) </h1>
        <div key={playerChosenPokemon} name={playerPokemonName}>
          <img
            style={{ height: "25vh" }}
            src={pokemonImage}
            alt={pokemonImage}
            name={playerPokemonName}
          />
          <h4>{PlayerPokeName}</h4>
          {/* <h4>{PokeType}</h4> */}
          {/* <h4>HP: {playerHP}</h4> */}
          <button onClick={() => attackCry()}>Attack</button>
        </div>
      </header>
    </div>
  );
};

export default BattlePage;
