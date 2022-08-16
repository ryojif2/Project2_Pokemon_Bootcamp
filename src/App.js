import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  update,
  onChildChanged,
} from "firebase/database";
import { database, storage } from "./DB/firebase";
import {
  // getStorage,
  getDownloadURL,
  ref as sRef,
  uploadBytes,
} from "firebase/storage";
import { auth } from "./DB/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import MainPage from "./Screens/MainPage";

const App = () => {
  let navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Routes>
          <Route path="/*" element={<MainPage />} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
