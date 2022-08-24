import React from "react";
import "../Pokedex.css";
import fire from "../logos/fire.png";
import Button from "@mui/material/Button";
// import Icon from "@mui/material/Icon";

const PokeCard = ({ id, image, name, type, HP, onChoosePokemonClick }) => {
  const style = type[0].props.children + " thumb-container";

  return (
    <div className={style}>
      <div className="number">
        <small>{id + 1}</small>
      </div>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3>{name}</h3>
        <small>Type: {type[0].props.children}</small>
        <br />
        <small>HP: {HP}</small>
      </div>
      <br />
      <Button
        name={id}
        onClick={(e) => onChoosePokemonClick(e)}
        variant="outlined"
      >
        Confirm
      </Button>
    </div>
  );
};

export default PokeCard;
