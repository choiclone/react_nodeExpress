import React, { useState, useEffect } from 'react';
import BusStationList from '../busInfo/BusStationList';
import BusArriveList from '../busInfo/BusArriveList';
import { useLocation } from 'react-router';

const StationArriveBusInfo = () => {
    const { stNm, arsId, busRouteType } = useLocation().state;
    const [BusStation, setBusStation] = useState(<BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>);

    useEffect(() => {
        if (stNm !== "") {
            let stations = JSON.parse(localStorage.getItem('stations') || '[]')
            const newKeyword = {
                id: arsId,
                Nm: String(stNm)
            }
            const distinctStation = stations.filter((rmStation) => {
                return rmStation.Nm === String(stNm)
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
            case "busInfo": {
                setBusStation(<BusStationList arsId={arsId} busRouteType={busRouteType}></BusStationList>);
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