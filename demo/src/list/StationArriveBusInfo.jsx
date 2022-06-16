import React, { useState, useEffect } from 'react';
import BusStationList from '../busInfo/BusStationList';
import BusArriveList from '../busInfo/BusArriveList';
import { useLocation } from 'react-router';
import { createBrowserHistory } from "history"

const StationArriveBusInfo = () => {
    const { stNm, arsId, busRouteType, searchType } = useLocation().state;
    const history = createBrowserHistory();
    const [BusStation, setBusStation] = useState(<BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>);

    useEffect(() => {
        if (stNm !== "") {
            let stations = JSON.parse(localStorage.getItem('stations') || '[]')
            const newKeyword = {
                id: arsId,
                Nm: String(stNm)
            }
            const distinctStation = stations.filter((rmStation) => {
                return rmStation.id === arsId
            });
            if (distinctStation.length === 0) {
                stations.push(newKeyword)
                localStorage.setItem('stations', JSON.stringify(stations))
            }
        }
    }, [])

    const BusInfoFunc = (infoType) => {
        const infoTypes = infoType;
        switch (infoTypes) {
            case 0: {
                setBusStation(<BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>);
                break;
            }
            case 1: {
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
                        <button type="button" onClick={() => BusInfoFunc(0)}>버스 정보 목록</button>
                        <button type="button" onClick={() => BusInfoFunc(1)}>도착 버스 정보 목록</button>
                        {BusStation}
                    </div>
                </header>
            </div>
        </>
    );
}

export default StationArriveBusInfo;