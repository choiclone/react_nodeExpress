import React, { useState, useEffect, useRef } from 'react';
import BusStationList from '../busInfo/BusStationList';
import BusArriveList from '../busInfo/BusArriveList';
import { useLocation } from 'react-router';

const StationArriveBusInfo = () => {
    const { stNm, arsId } = useLocation().state;

    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <BusStationList arsId={arsId} busRouteType={busRouteType}/>
                    <BusArriveList arsId={arsId} busRouteType={busRouteType}/>
                </header>
            </div>
        </>
    );
}

export default StationArriveBusInfo;