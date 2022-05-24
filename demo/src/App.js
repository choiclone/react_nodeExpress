import logo from './logo.svg';
import React, { useState, useEffect, useRef } from 'react';
// import StationList from "./list/StationList";
import axios from 'axios';
import './App.css';

const App = () => {
  const [station, setStation] = useState('');
  const [busStation, setBusStation] = useState([]);

  const clickBus = () => {
    axios.post("/api/BusApi")
      .then((res) => {
        let BusResult = res.data["bus"]["ServiceResult"]
        console.log(BusResult)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickBusStation = e => {
    let BusResult;
    axios.post("/api/BusStationApi", { station: station })
      .then((res) => {
        if(res.data.code === 200){
          BusResult = res.data["station"]["ServiceResult"]["msgBody"]["itemList"];
          setBusStation(BusResult);
        }else{
          console.log("400");
        }
      })
      .catch((err) => {
        setStation('');
        console.log(err)
      })
  }

  const handleStation = (e) => {
    setStation(e.target.value);
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
          {
            busStation.map((item, key) => {
              <ul key={key}>
                <li>{item.stNm}</li>
              </ul>
            })
          }
          <input type="text" name='stationName' onChange={handleStation}></input>
          <button type="button" onClick={clickBusStation}>Bus Station 조회</button>
          <button type="button" onClick={clickBus}>Bus 조회</button>
        </header>
      </div>
    </>
  );
}

export default App;
