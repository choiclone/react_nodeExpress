import React, { useState } from 'react';
import BusStationList from '../busInfo/BusStationList';
import BusArriveList from '../busInfo/BusArriveList';
import { useLocation } from 'react-router';

const StationArriveBusInfo = () => {
    const { stNm, arsId, busRouteType } = useLocation().state;
    const [BusStation, setBusStation] = useState(
        <div>
            <button>새로고침</button>
            <BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>
        </div>
    );

    const BusInfoFunc = (infoType) => {
        const infoTypes = infoType;
        switch (infoTypes) {
            case "busInfo": {
                setBusStation(
                    <div>
                        <button>새로고침</button>
                        <BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>
                    </div>
                );
                break;
            }
            case "arriveInfo": {
                setBusStation(<BusArriveList arsId={arsId} busRouteType={busRouteType}></BusArriveList>);
                break;
            }
            default: {
                alert("프론트앤드 에러다 미안하다");
                break;
            }
        }
    }

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <div>
                        <button type="button" onClick={() => BusInfoFunc("busInfo")}>버스 정보 목록</button>
                        <button type="button" onClick={() => BusInfoFunc("arriveInfo")}>도착 버스 정보 목록</button>
                        {BusStation}
                    </div>
                </header>
            </div>
        </>
    );
}

export default StationArriveBusInfo;