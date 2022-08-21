import React from "react";

const ConfirmedCard = ({ image, name, type, HP, Moves }) => {
  const style = type[0].props.children + " thumb-container";
  console.log(Moves[0].props.children);
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
    </div>
  );
};

export default ConfirmedCard;
