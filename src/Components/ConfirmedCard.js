import React from "react";
import Button from "@mui/material/Button";

const ConfirmedCard = ({
  image,
  name,
  type,
  HP,
  Moves,
  onReselectPokemon,
  setPlayerArray,
  onConfirmPokemon,
  chosenPokemon,
  playerAttackArray,
  setPlayerStrongType,
  setPlayerWeakType,
  gameType,
  otherPlayerExist,
  strongType,
  weakType,
}) => {
  const style = type[0].props.children + " thumb-container";
  return (
    <div className={style}>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3>{name}</h3>
        <small>Type: {type}</small>
        <small>HP: {HP}</small>
        <br />
        <small>
          Moves:
          {` ${Moves[0].props.children},  
            ${Moves[1].props.children},
            ${Moves[2].props.children},
            ${Moves[3].props.children}`}
        </small>
      </div>
      <br />
      <Button onClick={(e) => onReselectPokemon(e)}>
        Back to Main Pokedex
      </Button>
      <Button
        disabled={gameType === "pvp" && !otherPlayerExist}
        onClick={() => {
          setPlayerArray(playerAttackArray);

          onConfirmPokemon(chosenPokemon);
          setPlayerStrongType(strongType);
          setPlayerWeakType(weakType);
        }}
      >
        Confirm
      </Button>
    </div>
  );
};

export default ConfirmedCard;
