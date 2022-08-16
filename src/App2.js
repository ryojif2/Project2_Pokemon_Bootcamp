import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import {
//   onChildAdded,
//   push,
//   ref as dbRef,
//   set,
//   update,
//   onChildChanged,
// } from "firebase/database";
// import { database, storage } from "./DB/firebase";
// import {
//   // getStorage,
//   getDownloadURL,
//   ref as sRef,
//   uploadBytes,
// } from "firebase/storage";
// import { auth } from "./DB/firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";

import BattlePage from './Components/BattlePage';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
      <p>App.js</p>
      <BattlePage/>
      </header>
    </div>
  );
};

export default App;
