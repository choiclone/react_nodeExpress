import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';

const StationArriveBusInfo = () => {
    const { stNm, arsId } = useLocation().state;
    const [arrive, setArrive] = useState([]);

    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }

    useEffect(() => {
        clickStationInfo();
    }, [])

    const clickStationInfo = async (e) => {
        await axios.post("/api/BusStationList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    let a = res.data.stationList["ServiceResult"]["msgBody"]["itemList"];
                    setArrive(a)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <h2>해당 정류소에 경유하는 버스 목록</h2>
                    {
                        arrive.length !== 0 ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>노선 ID</th>
                                        <th>버스명</th>
                                        <th>노선길이</th>
                                        <th>노선유형</th>
                                        <th>기점</th>
                                        <th>종점</th>
                                        <th>배차간격</th>
                                        <th>다음도착버스시간</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        arrive.map((item, key) => (
                                            <tr key={key}>
                                                <td>{item.busRouteId["_text"]}</td>
                                                <td>{item.busRouteNm["_text"]}</td>
                                                <td>{item.length["_text"]}</td>
                                                <td>{busRouteType[item.busRouteType["_text"]]}</td>
                                                <td>{item.stBegin["_text"]}</td>
                                                <td>{item.stEnd["_text"]}</td>
                                                <td>{item.term["_text"]}</td>
                                                <td>{item.nextBus["_text"]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            : <h5>ddd</h5>
                    }
                </header>
            </div>
        </>
    );
}

export default StationArriveBusInfo;