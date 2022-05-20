import logo from './logo.svg';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [getUser, setUser] = useState([]);

  const clickButton = () => {
    axios.post("/api/test1", { user: "ddd" })
      .then((res) => {
        setUser(res.data)
        console.log(getUser)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickButton2 = () => {
    axios.post("/api/test2", { user: "ddd" })
      .then((res) => {
        setUser(res.data)
        console.log(getUser)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickButton3 = () => {
    axios.post("/api/test3")
      .then((res) => {
        setUser(res.data)
        console.log(getUser)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
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
          <button type="button" onClick={clickButton}>Read</button>
          <button type="button" onClick={clickButton2}>Create</button>
          <button type="button" onClick={clickButton3}>Update</button>
        </header>
      </div>
    </>
  );
}

export default App;
