/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import BusRouteSearch from '../search/BusRouteSearch';
import BusStationSearch from '../search/BusStationSearch';
import SubwaySearch from '../search/SubwaySearch';
import ISBNBookSearch from '../search/ISBNBookSearch';
import InterBookSearch from '../search/InterBookSearch';

const StationListF = () => {
  const [infoType, setInfoType] = useState('ISBN');

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
      case "ISBN": {
        setInfoType(info);
        break;
      }
      case "INTER": {
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
          {/* <button onClick={() => ChangeSearchInfo("Bus")}>버스</button>
          <button onClick={() => ChangeSearchInfo("Station")}>정류소</button> */}
          {/* <button onClick={() => ChangeSearchInfo("Subway")}>지하철</button> */}
          <button onClick={() => ChangeSearchInfo("ISBN")}>국립중앙도서관 ISBN 검색</button>
          <button onClick={() => ChangeSearchInfo("INTER")}>인터파크 ISBN 검색</button>
        </div>
      </header>
      <div className='main-fullScreen'>
        <section className='main-content'>
            {
              // infoType === "Bus" ? <BusRouteSearch /> : infoType === "Station" ? <BusStationSearch /> : <SubwaySearch />
              infoType === "ISBN"? <ISBNBookSearch/> : <InterBookSearch/>
            }
        </section>
      </div>
    </>
  );
}

export default StationListF;