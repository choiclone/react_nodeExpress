/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import BusRouteSearch from '../search/BusRouteSearch';
import BusStationSearch from '../search/BusStationSearch';
import SubwaySearch from '../search/SubwaySearch';
import ISBNBookSearch from '../search/ISBNBookSearch';
import InterBookSearch from '../search/InterBookSearch';
import NaverBookSearch from '../search/NaverBookSearch';

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
      // case "Subway": {
      //   setInfoType(info);
      //   break;
      // }
      case "ISBN": {
        setInfoType(info);
        break;
      }
      case "INTER": {
        setInfoType(info);
        break;
      }
      default: {
        setInfoType(info);
        break;
      }
    }
  }

  return (
    <>
      <header className='main-header'>
        <div>
          <button onClick={() => ChangeSearchInfo("Bus")}>버스</button>
          <button onClick={() => ChangeSearchInfo("Station")}>정류소</button>
          {/* <button onClick={() => ChangeSearchInfo("Subway")}>지하철</button> */}
          <button onClick={() => ChangeSearchInfo("ISBN")}>국립중앙도서관 ISBN 검색</button>
          <button onClick={() => ChangeSearchInfo("INTER")}>인터파크 ISBN 검색</button>
          <button onClick={() => ChangeSearchInfo("123")}>네이버 ISBN 검색</button>
        </div>
      </header>
      <div className='main-fullScreen'>
        <section className='main-content'>
            {
              infoType === "Bus" ? <BusRouteSearch /> : infoType === "Station" ? <BusStationSearch /> : infoType === "ISBN"? <ISBNBookSearch />: infoType === "INTER"? <InterBookSearch/> : <NaverBookSearch/>
            }
        </section>
      </div>
    </>
  );
}

export default StationListF;