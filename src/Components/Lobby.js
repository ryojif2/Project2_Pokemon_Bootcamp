import React, { useState, useEffect } from "react";
import "../App.css";
import "../Components/lobby.css";
import { firestore } from "../DB/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const Lobby = (props) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    onSnapshot(collection(firestore, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
  }, []);

  const [roomName, setRoomName] = useState("");

  //PVP ROOM CREATION
  const createPvpRoom = async (e) => {
    const gameType = "pvp";

    // if( room name exist ) { room alrdy exist pick another name}
    // navigate to /room
    // pass in the user info
    // display both players
    // if 2/2 nobody can enter

    e.preventDefault();

    const date = new Date().toLocaleString();

    await setDoc(doc(firestore, "rooms", roomName), {
      date: date.toString(),
      userCount: 1,
      createdBy: props.currUser.username,
      type: "pvp",
      users: [props.currUser.username],
      pastMoves: [],
    });
    await setDoc(
      doc(firestore, "rooms", roomName, "users", props.currUser.username),
      {
        email: props.currUser.email,
        username: props.currUser.username,
        gamesPlayed: props.currUser.gamesPlayed,
        gamesWon: props.currUser.gamesWon,
        usedPokemon: props.currUser.usedPokemon,
        confirmed: false,
        turn: true,
      }
    );
    props.startGame(roomName, gameType);

    setRoomName("");
  };

  //PVE ROOM CREATION
  const createPveRoom = async (e) => {
    const gameType = "pve";
    const roomName = `PVE of ${props.currUser.username}`;

    e.preventDefault();
    const date = new Date().toLocaleString();
    await setDoc(doc(firestore, "rooms", roomName), {
      date: date.toString(),
      userCount: 2,
      createdBy: props.currUser.username,
      type: "pve",
      users: props.currUser.username,
      pastMoves: [],
    });

    await setDoc(
      doc(firestore, "rooms", roomName, "users", props.currUser.username),
      {
        email: props.currUser.email,
        username: props.currUser.username,
        gamesPlayed: props.currUser.gamesPlayed,
        gamesWon: props.currUser.gamesWon,
        usedPokemon: props.currUser.usedPokemon,
        confirmed: false,
        turn: true,
      }
    );
    props.startGame(roomName, gameType);
  };

  const [inputText, setInputText] = useState("");
  const [chats, setChats] = useState([]);

  //CHAT FUNCTION
  const submitText = async (e) => {
    e.preventDefault();
    const date = new Date().toLocaleString();
    await addDoc(collection(firestore, "lobbytexts"), {
      date: date.toString(),
      text: inputText,
      createdBy: props.currUser.username,
      user: [props.currUser.username],
    });
    setInputText("");
  };

  useEffect(() => {
    onSnapshot(collection(firestore, "lobbytexts"), (snapshot) => {
      setChats(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
  }, []);

  const enterRoom = async (e, roomID) => {
    e.preventDefault();
    const roomRef = doc(firestore, "rooms", roomID);
    await updateDoc(roomRef, {
      userCount: increment(1),
      users: arrayUnion(props.currUser.username),
    });
    //all data r objects/ collections r arrayss
    await setDoc(
      doc(firestore, "rooms", roomID, "users", props.currUser.username),
      {
        email: props.currUser.email,
        username: props.currUser.username,
        gamesPlayed: props.currUser.gamesPlayed,
        gamesWon: props.currUser.gamesWon,
        usedPokemon: props.currUser.usedPokemon,
        confirmed: false,
        turn: false,
      }
    );

    props.startGame(roomID, "pvp");
  };

  return (
    <div className="lobby">
      <Typography>
        <table className="rooms">
          <TableHead>
            <tr>
              <th className="roomheader">Rooms:</th>
            </tr>
            <th>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="room name?"
              />
              <br />
              <Button onClick={createPvpRoom}>Create PvP Room</Button>
              <Button onClick={createPveRoom}>Enter PvE Room</Button>
            </th>
          </TableHead>
          <tbody className="tableBody">
            {rooms.map((room, i) => (
              <tr key={room.id}>
                <td>
                  Room:{room.id}
                  <br />
                  Created by: {room.data.createdBy} on {room.data.date}. <br />
                  <Button
                    onClick={(e) => enterRoom(e, room.id)}
                    variant="contained"
                    disabled={room.data.userCount === 2}
                  >
                    Enter Room
                  </Button>
                  <br />
                  UserCount:
                  {room.data.userCount}
                  {"   "}
                  <IconButton
                    size="small"
                    edge="start"
                    aria-label="menu"
                    style={
                      room.data.userCount < 2
                        ? { background: "green" }
                        : { background: "red" }
                    }
                  ></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="chat">
          <TableHead>
            <TableRow>
              <TableCell>Chat:</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <input
                  type="text"
                  value={inputText}
                  placeholder="say something!"
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button onClick={submitText}>Send Msg</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody className="chatBody">
            <td>
              {chats.map((chat) => (
                <tr key={chat.id}>
                  {chat.data.date}: {chat.data.text} by {chat.data.createdBy}
                </tr>
              ))}
            </td>
          </tbody>
        </table>
        <br />
      </Typography>
    </div>
  );
};

export default Lobby;
