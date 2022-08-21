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

  console.log(props.historyMoves);
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
     
      

        <div>
          {props.historyMoves.length >= 1 ? (
            <p>
              {" "}
              Your {playerPokemonName} has hit enemy {computerPokemonName} for{" "}
              {props.historyMoves[0]} damage!{" "}
            </p>
          ) : null}
          {props.historyMoves.length === 2 ? (
            <p>
              {" "}
              Enemy {computerPokemonName} has hit your {playerPokemonName} for{" "}
              {props.historyMoves[1]} damage!{" "}
            </p>
          ) : null}
          {props.isPlayerTurn && playerHP > 0 ? (
            <p>Make a move and attack!</p>
          ) : null}
          {computerHP <= 0 ? <p>You have won the battle!</p> : null}
          {playerHP <= 0 ? <p>You have lost the battle!</p> : null}
        </div>
        <h1>Player (YOU) </h1>

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

          <h4>HP: {playerHP}</h4>
          <button
            disabled={!props.isPlayerTurn}
            onClick={() => props.onAttack()}
          >
            Attack
          </button>
          {playerHP <= 0 || computerHP <= 0 ? (
            <button onClick={() => props.onSummary()}>
              Proceed to Summary
            </button>
          ) : null}

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
