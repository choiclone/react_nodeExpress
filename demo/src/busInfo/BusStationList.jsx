import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BusStationList = (props) => {
    const { arsId, busRouteType } = props;
    const [BusStation, setBusStation] = useState([]);

    useEffect(() => {
        clickStationInfo();
    }, [])

    const clickStationInfo = async (e) => {
        await axios.post("/api/BusStationList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    let a = res.data.stationList["ServiceResult"]["msgBody"]["itemList"];
                    setBusStation(a)
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
                        BusStation.length !== 0 ?
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        BusStation.map((item, key) => (
                                            <tr key={key}>
                                                <td>{item.busRouteId["_text"]}</td>
                                                <td>{item.busRouteNm["_text"]}</td>
                                                <td>{item.length["_text"]}</td>
                                                <td>{busRouteType[item.busRouteType["_text"]]}</td>
                                                <td>{item.stBegin["_text"]}</td>
                                                <td>{item.stEnd["_text"]}</td>
                                                <td>{item.term["_text"]}</td>
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

export default BusStationList;