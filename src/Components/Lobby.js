import React from 'react';
import "../App.css";
import { useState, useEffect } from "react";
import { database,firestore } from "../DB/firebase";
import { collection, query, where, onSnapshot,getDocs,addDoc, documentId } from "firebase/firestore";
import { doc, setDoc,updateDoc,increment ,arrayUnion,FieldValue} from "firebase/firestore"; 
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  update,
  onChildChanged,
  child,
  onValue
} from "firebase/database";
import { ListItem } from '@mui/material';

 const Lobby = (props)=>{
const ROOMS_LIST='roomsList';
const CHAT_LIST='chatList';
  const [rooms,setRooms]=useState([])

//   useEffect(()=>{

//     const roomListRef = dbRef(database, ROOMS_LIST);
//     // onChildAdded will return data for every child at the reference and every subsequent new child
//     onChildAdded(roomListRef, (data) => {
//       // Add the subsequent child to local component state, initialising a new array to trigger re-render
//      setRooms([...rooms, { key: data.key, val: data.val()}]);
//      console.log("rooms", rooms)
//      console.log('data.val()',data.val())
//  onValue(roomListRef,(data)=> console.log(data.val()))
//   })},[])

  
  // const roomsListMap = () => {
  //   if(rooms!==null)
  //  { return 

const roomsListMap = rooms.map((item,i)=>(<li key={i}> {item.title} by {item.createdBy}. Count:{item.userCount}</li>));
// }
// }
 //Firebase Collection Reference
    const roomRef = collection(firestore, 'rooms');

    // useEffect(() => {
    //     const getDocuments = async () => {
    //         const data = await getDocs(roomRef);
    //         setRooms(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    //     };

    //     getDocuments();
    // }, []);

   
  // useEffect(() => {
  //   const inner = async () => {
  //     const ref = await firestore
  //       .collection("rooms")

  //     setRooms(
  //       ref.map((item) => ({
  //         title: item.id,
  //       ...item.data()
  //       }))
  //     );
  //   };

  //   inner();
  // }, []);

useEffect(()=>{

  // const q = query(collection(db, "rooms"));
 onSnapshot(collection(firestore,'rooms'), (snapshot) => {
  console.log(snapshot.docs);
  snapshot.docs.forEach((doc)=>{console.log(doc.data())})
setRooms(snapshot.docs.map((doc)=>({id:doc.id, data:doc.data()})))
})
console.log(rooms);
},[])


//  props.startGame(e)}}>Enter room</button></li></span>))

// useEffect(()=>{
// firestore.collection('messages').onSnapshot
// },[])


  const [roomName,setRoomName]=useState('')
  const createPvpRoom = async (e)=>{
  const gameType='pvp'

    // if( room name exist ) { room alrdy exist pick another name}
    // navigate to /room 
    // pass in the user info 
    // display both players
    // if 2/2 nobody can enter 


    e.preventDefault();
       const date= new Date().toLocaleString();
  //    const roomListRef = dbRef(database, ROOMS_LIST);
  //   const newRoomListRef = push(roomListRef);
  //   set(newRoomListRef, {date: date.toString(), roomTitle:roomName, userCount:0, createdBy:props.currUser.username});
  // const roomRef=firestore.collection('rooms').doc(roomName);
  // const roomRef=collection(firestore,'rooms',roomName)
  await setDoc(doc(firestore, "rooms", roomName), {
  date:date.toString(),
  userCount:1,
  createdBy:props.currUser.username,
   type:'pvp',
      users:[props.currUser.username]
});
await setDoc(doc(firestore, "rooms", roomName,'users', props.currUser.username), {
  email:props.currUser.email,
      username: props.currUser.username,
      gamesPlayed: props.currUser.gamesPlayed,
      gamesWon: props.currUser.gamesWon,
      usedPokemon: props.currUser.usedPokemon,
      confirmed:false,
});
// await setDoc(doc(firestore, "rooms", props.currUser.username), {...props.currUser});
props.startGame(roomName,gameType);
// await roomRef.set({
//   date:date.toString(),
//   userCount:1,
//   createdBy:props.currUser.username,
//   users:[props.currUser.username]
// })
setRoomName('');
}

const createPveRoom= async (e)=>{
 const gameType='pve'
const roomName=`PVE of ${props.currUser.username}`
   e.preventDefault();
    const date= new Date().toLocaleString();
     await setDoc(doc(firestore, "rooms",roomName), {
  date:date.toString(),
  userCount:2,
  createdBy:props.currUser.username,
  type:'pve',
  users:props.currUser.username});


await setDoc(doc(firestore, "rooms", roomName,'users', props.currUser.username), {
  email:props.currUser.email,
      username: props.currUser.username,
      gamesPlayed: props.currUser.gamesPlayed,
      gamesWon: props.currUser.gamesWon,
      usedPokemon: props.currUser.usedPokemon,
      confirmed:false,
});
props.startGame(roomName,gameType);
}

 

//   useEffect(()=>{

//     const chatListRef = dbRef(database, CHAT_LIST);
//     // onChildAdded will return data for every child at the reference and every subsequent new child
//     onChildAdded(chatListRef , (data) => {
//       // Add the subsequent child to local component state, initialising a new array to trigger re-render
//      setChats((prevState)=>[...prevState, { key: data.key, val: data.val()}])
   
//   })

//   onValue(chatListRef,(data)=>{
//    console.log(data.val())
//   })


// },[])

 const [inputText,setInputText]=useState('');
   const [chats,setChats]=useState([])


 const submitText = async (e)=>{
    e.preventDefault();
       const date= new Date().toLocaleString();
  await addDoc(collection(firestore, "lobbytexts"), {
  date:date.toString(),
  text:inputText,
  createdBy:props.currUser.username,
  user:[props.currUser.username]
})
  setInputText('');
 }

 useEffect(()=>{

  // const q = query(collection(db, "rooms"));
 onSnapshot(collection(firestore,'lobbytexts'), (snapshot) => {
  snapshot.docs.forEach((doc)=>{console.log(doc.data())})
setChats(snapshot.docs.map((doc)=>({id:doc.id, data:doc.data()})))
})
},[])
  
//   const enterRoom= (e,item,i)=>{
//      const roomListRef = dbRef(database, ROOMS_LIST);
//     const updates={};
// console.log('start game!')
// e.preventDefault();
//    const newRoom=
//     {date: item.val.date, roomTitle:item.val.roomTitle, userCount:2, createdBy:props.currUser.username}

//       updates[item.key] = newRoom;
//     update(roomListRef, updates).then(() => {
//     console.log("data updated!");
//     });
//       //create a new array referencing the state 
//     const newRoomArray=rooms;
    
//     newRoomArray[i].val=newRoom;
// setRooms(newRoomArray)
//   }

const enterRoom = async (e, roomID) => {
e.preventDefault();
const roomRef= doc(firestore,'rooms',roomID)
await updateDoc(roomRef, {userCount:increment(1), users:arrayUnion(props.currUser.username)})
//all data r objects/ collections r arrayss
await setDoc(doc(firestore, "rooms", roomID,'users', props.currUser.username), {
  email:props.currUser.email,
      username: props.currUser.username,
      gamesPlayed: props.currUser.gamesPlayed,
      gamesWon: props.currUser.gamesWon,
      usedPokemon: props.currUser.usedPokemon,
      confirmed:false
});

props.startGame(roomID);

}


  return(
    <div className="lobby">
<div className="rooms">
  <h1>Rooms:</h1>
  <input type="text" value={roomName} onChange={(e)=>setRoomName(e.target.value)} placeholder="room name?"/>
  <button onClick={createPvpRoom}>Create PvP Room</button>
  <button onClick={createPveRoom}>Enter PvE Room</button>
{/* <ol>{rooms && rooms.length>0 ? { */}
 {/* { rooms.map(({id,createdBy,userCount,date})=>
<div key={id}>
  <p>{date}: {id} by {createdBy}, count:{userCount}</p>
</div>)} */}

<ul>{rooms.map((room,i)=>(<li key={room.id}>
 {room.data.date}: {room.id} by {room.data.createdBy}. UserCount:{room.data.userCount}
<button disabled={room.data.userCount===2} onClick={(e)=>enterRoom(e,room.id)}>Enter Room</button></li>))}</ul>

{/* } : null }</ol> */}

</div>
<div className="chat">
  <h1>Chat:</h1>
  <input type="text" value={inputText} placeholder="say something!" onChange={(e)=>setInputText(e.target.value)}/>
  <button onClick={submitText}>Send Msg</button>
  <ul>{chats.map((chat)=>(<li key={chat.id}>
{chat.data.date}: {chat.data.text} by {chat.data.createdBy}
</li>))}</ul>
</div>
    </div>
  )
}

export default Lobby;