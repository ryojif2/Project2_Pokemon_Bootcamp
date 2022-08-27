// import React from "react";
// import axios from "axios";
// import { signOut } from "firebase/auth";
// import { auth } from "../DB/firebase";
// import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import "../App.css";

// const SelectPoke = (props) => {
//   let navigate = useNavigate();

//   //  useEffect(()=>{
//   const chosenPokemon = props.selectedPokemon;
//   const {
//     pokemonHP,
//     pokemonImageFront,
//     pokemonMoves,
//     pokemonMovesURL,
//     pokemonName,
//     pokemonType,
//   } = chosenPokemon;
//   const PokeName = pokemonName.toUpperCase();
//   const PokeType = pokemonType.map((type) => <h5>{type}</h5>);
//   const PokeMoves = pokemonMoves.map((move) => <h5>{move}</h5>);

//   const playerAttackArray = [];

//   pokemonMovesURL.map((url) => {
//     axios.get(url).then((response) => {
//       let { name, power } = response.data;

//       console.log(name);
//       console.log(power);
//       let modifiedPower = 1;
//       if (power === null) {
//         playerAttackArray.push(modifiedPower);
//       } else {
//         playerAttackArray.push(power);
//       }
//       return playerAttackArray;
//     });
//   });

//   const logout = () => {
//     console.log("logout");
//     signOut(auth);
//     navigate("/");
//     console.log(props.loggedInUser);
//   };

//   return (
//     //repeating pokedex ?
//     <div>
//     <div key={chosenPokemon} name={pokemonName}>
//       <h1> you have chosen {PokeName}!</h1>
//       <img
//         style={{ height: "20vh" }}
//         src={pokemonImageFront}
//         alt={pokemonImageFront}
//         name={pokemonName}
//       />
//       <p>{PokeName}</p>
//       <p>{PokeType}</p>
//       <p>HP: {pokemonHP}</p>
//       <p>Moves: {PokeMoves}</p>
//     </div>
//     <div>
//       {props.bothPlayerConfirmed ?

//       :

//       } <h1>Waiting for player2 to choose....</h1>

//       </div>
//     </div>
//   );
// };
// export default SelectPoke;
