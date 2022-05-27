import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BusStationList = (props) => {
    const { arsId, busRouteType } = props;
    const [BusStation, setBusStation] = useState([]);
    const [BusRoute, setBusRoute] = useState([]);

    useEffect(() => {
        clickStationInfo();
    }, [])

    const clickStationInfo = async (e) => {
        let BusList = [];
        await axios.post("/api/BusStationList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.stationList["ServiceResult"]["msgBody"]["itemList"]);
                    if(Array.isArray(BusList[0])) setBusStation(BusList[0])
                    else setBusStation(BusList)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const AllRoutedInfo = async (routeId) => {
        let BusList = [];
        await axios.post("/api/ArrInfoByRouteList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]);
                    if(Array.isArray(BusList[0])) setBusRoute(BusList[0])
                    else setBusRoute(BusList)
                    console.log(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"])
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
                                                <td><button onClick={() => AllRoutedInfo(item.busRouteId["_text"])}>{item.busRouteId["_text"]}</button></td>
                                                <td>{item.busRouteNm["_text"]}</td>
                                                <td>{item.length["_text"]}</td>
                                                <td>{busRouteType[item.busRouteType["_text"]]}</td>
                                                <td>{item.stBegin["_text"]}</td>
                                                <td>{item.stEnd["_text"]}</td>
                                                <td>{item.term["_text"]}</td>
                                            </tr>
                                        ))
                                    }
                                    {
                                        BusRoute.map((item, key) => (
                                            <tr key={key}>
                                                <td>{item.stNm["_text"]}</td>
                                                <td>{item.arrmsg1["_text"]}</td>
                                                <td>{item.arrmsg2["_text"]}</td>
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