import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const StationList = () => {
  const [station, setStation] = useState('');

  const handleStation = (e) => {
    setStation(e.target.value);
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <input type="text" name='stationName' onChange={handleStation}></input>
          { station }
        </header>
      </div>
    </>
  );
}

export default StationList;