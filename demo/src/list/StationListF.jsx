/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import BusRouteSearch from '../search/BusRouteSearch';
import BusStationSearch from '../search/BusStationSearch';
import SubwaySearch from '../search/SubwaySearch';

const StationListF = () => {
  const [infoType, setInfoType] = useState('Bus');

  const ChangeSearchInfo = (info) => {
    switch (info) {
      case "Bus": {
        setInfoType(info);
        break;
      }
      case "Station": {
        setInfoType(info);
        break;
      }
      case "Subway": {
        setInfoType(info);
        break;
      }
      default:
        break;
    }
  }

  return (
    <>
      <header className='main-header'>
        <div>
          <button onClick={() => ChangeSearchInfo("Bus")}>버스</button>
          <button onClick={() => ChangeSearchInfo("Station")}>정류소</button>
          <button onClick={() => ChangeSearchInfo("Subway")}>지하철</button>
        </div>
      </header>
      <div className='main-fullScreen'>
        <section className='main-content'>
            {
              infoType === "Bus" ? <BusRouteSearch /> : infoType === "Station" ? <BusStationSearch /> : <SubwaySearch />
            }
        </section>
      </div>
    </>
  );
}

export default StationListF;