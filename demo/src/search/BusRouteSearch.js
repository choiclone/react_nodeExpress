/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BusRouteSearch = () => {
    const [busName, setBusName] = useState('');
    const [stateTitle, setStateTitle] = useState('Click Bus');
    const [busSearch, setBusSearch] = useState('');
    const [busRouteId, setBusRouteId] = useState([]);
    const [busLocate, setBusLocate] = useState([]);
    const [busRoute, setBusRoute] = useState([]);
    const [arrive, setArrive] = useState([]);

    const IntervalRef = useRef();

    const stationType = { 0: "공용 버스", 1: "일반형 시내/ 농어촌버스", 2:"좌석형 시내 / 농어촌버스", 3:"직행좌석형 시내 / 농어촌버스", 4:"일반형 시외버스", 5:"좌석형 시외버스", 6:"고속형 시외버스", 7: "마을버스"}
    const routeType = {1:"공항", 2:"마을", 3:"간선", 4:"지선", 5:"순환", 6:"광역", 7:"인천", 8:"경기", 9:"폐지", 0:"공용"}
    useEffect(() => {
        return () => clearInterval(IntervalRef.current)
    }, [])

    const clickBus = async (e) => {
        e.preventDefault();
        await axios.post("/api/BusListSearch", { BusName: busName })
            .then((res) => {
                if (res.data.status === 200) {
                    setBusRouteId(res.data.routeId)
                } else setBusRouteId(res.data.routeId)
            })
            .catch((err) => {
                setBusRouteId('')
            })
    }

    const handleBus = (e) => {
        setStateTitle("Click Bus")
        setBusSearch("")
        setBusRoute([]);
        setBusRouteId([]);
        setBusLocate([]);
        setArrive([]);
        clearInterval(IntervalRef.current)
        setBusName(e.target.value);
    }

    const BusRouteStatusList = async (routeId) => {
        let BusList = [];
        setStateTitle("가져오는 중...")
        await axios.post("/api/ArrInfoByRouteList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) setBusRoute(BusList[0]);
                    else setBusRoute(BusList);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const getBusPosByRtidList = async (routeId) => {
        let BusList = [];
        await axios.post("/api/getBusPosByRtidList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.BusLocate["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) setBusLocate(BusList[0]);
                    else setBusLocate(BusList);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const getBusArrInfo = async (arsId) => {
        let BusList = [];
        await axios.post("/api/ArriveBusList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.arrive["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) {
                        setArrive(BusList[0])
                    } else {
                        setArrive(BusList)
                    }
                    console.log(BusList)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const IntervalStationList = (item) => {
        setStateTitle("Click Bus")
        setBusSearch(item["노선명"])
        clearInterval(IntervalRef.current);
        BusRouteStatusList(item["ROUTE_ID"])
        getBusPosByRtidList(item["ROUTE_ID"])
        // IntervalRef.current = setInterval(async () => {
        //     await BusRouteStatusList(item["ROUTE_ID"])
        // }, 3000)
    }

    const styleSheet = {
        fontSize: "15px",
        color: "green",
        listStyle: "none"
    };

    const verticalStyle = {
        verticalAlign: "middle",
    }

    return (
        <>
            <div>
                <div>
                    <form onSubmit={clickBus}>
                        <input type="text" name='busName' onChange={handleBus}></input>
                        <button type="submit">Bus 조회</button>
                    </form>
                </div>
                {busRouteId.length !== 0 ?
                    <div>
                        {
                            arrive.length !== 0 ?
                                <div>
                                    {stationType[arrive[0].stationTp["_text"]]}
                                    {arrive.map((item, key) => (
                                        <ol key={key}>
                                            <li>{String(busSearch) === String(item.rtNm["_text"]) ? 
                                                <span style={{color:"red"}}>{item.rtNm["_text"]+"/"+routeType[item.routeType["_text"]]+"버스"}</span> 
                                                : item.rtNm["_text"]+"/"+routeType[item.routeType["_text"]]+"버스"}</li>
                                            <li>{item.arrmsg1["_text"]}</li>
                                            <li>{item.arrmsg2["_text"]}</li>
                                        </ol>
                                    ))}
                                </div> : ""
                        }
                        <table>
                            <thead><tr><th>버스명</th></tr></thead>
                            <tbody>
                                {
                                    busRouteId.map((item, key) => (

                                        <tr key={key}>
                                            <td><button onClick={() => IntervalStationList(item)}>{item["노선명"]}</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {busRoute.length !== 0 ?
                            <div>
                                <h5> {busSearch} 운행 개수: {busLocate.length !== 0 ? busLocate.length + "개" : ""}</h5>
                                <ul style={styleSheet}>
                                    {
                                        busRoute.map((route, key) => (
                                            <li key={key} style={verticalStyle}>
                                                <button style={verticalStyle} onClick={() => getBusArrInfo(route.arsId["_text"])}>{route.stNm["_text"] + "  "}</button>
                                                {
                                                    busLocate.findIndex(loc => loc.lastStnId["_text"] === route.stId["_text"]) !== -1 ?
                                                        <img style={verticalStyle} src='/staticFolder/busImages/bus.png' width="50px" height="50px" /> : <span style={{ color: "white" }}>{route.stNm["_text"]}</span>
                                                }
                                            </li>
                                        ))
                                    }
                                </ul> 
                            </div> : stateTitle
                        }
                    </div> : ""
                }
            </div>
        </>
    );
}

export default BusRouteSearch;