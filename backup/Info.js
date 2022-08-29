import React from "react";

const PokeCard = ({ id, image, name, type, HP, onChoosePokemonClick }) => {
  const style = type + " thumb-container";
  return (
    <div className={style}>
      <div className="number">
        <small>{id}</small>
      </div>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3>{name}</h3>
        <small>Type: {type}</small>
        <small>HP: {HP}</small>
      </div>
    </div>
  );
};

export default PokeCard;
