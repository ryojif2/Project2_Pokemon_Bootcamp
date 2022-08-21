import "../App.css";
import React, { useState, useEffect } from "react";
// import Chatarea from './Chatarea.js'
import { onAuthStateChanged ,auth } from "firebase/auth";

const BattlePage = (props) => {
  const playerChosenPokemon = props.playerConfirmedPokemon;
  const {
    pokemonHP: playerHP,
    pokemonImageFront: playerImageFront,
    pokemonName: playerPokemonName,
  } = playerChosenPokemon;

  // const playerHP=props.playerConfirmedPokemon.pokemonHP;
  // const pokemonImageFront=props.playerConfirmedPokemon.pokemonHP
  // const playerHP=props.playerConfirmedPokemon.pokemonHP

  const PlayerPokeName = playerPokemonName.toUpperCase();
  // const PPokeType = ppokemonType.map((type) => <h5>{type}</h5>);
  // const PPokeMoves = ppokemonMoves.map((move) => <h5>{move}</h5>);

  const computerChosenPokemon = props.computerConfirmedPokemon;
  const {
    pokemonHP: computerHP,
    pokemonImageFront: computerImageFront,
    pokemonName: computerPokemonName,
  } = computerChosenPokemon;

  const CPokeName = computerPokemonName.toUpperCase();

  //onChildChanged

const [message,setMessage]=useState('');
const [messagelist,setMessageList]=useState([])
const [userEmail,setUserEmail]=useState(props.user.email);


const submitMessages=(e)=>{
e.preventDefault();
setMessageList([...messagelist,message]);
setMessage('');

}



// useEffect(()=>{
//  onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log(user);
//         setUser(user)
//        }})},[user])

  return (
    <div className="battlepage">
 
 <div className="battlearea">
  <p>Battle page</p>
      
        <div>
            <h1>Computer</h1>
          <img
            style={{ height: "25vh" }}
            src={computerImageFront}
            alt={computerImageFront}
            name={computerPokemonName}
          />
          <h6>{CPokeName}</h6>
          {/* <h4>{PokeType}</h4> */}
          <h6>HP: {computerHP}</h6>
        </div>
       
          <p>Make a move and attack!</p>
     
      
        <div key={playerChosenPokemon} name={playerPokemonName}>
            <h1>Player (YOU) </h1>
          <img
            style={{ height: "25vh" }}
            src={playerImageFront}
            alt={playerImageFront}
            name={playerPokemonName}
          />
          <h6>{PlayerPokeName}</h6>
          {/* <h4>{PokeType}</h4> */}
          <h6>HP: {playerHP}</h6>
          <button>Attack</button>
        </div>

        </div>
    <div className="chatarea">

<input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="write a message!"/>
<button type="submit" onClick={submitMessages}>Submit</button>
{messagelist.map(item=>(<p>{item} by {userEmail} </p>))}
    </div>
    </div>
  );
};

export default BattlePage;
