/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BusRouteSearch = () => {
    const [busName, setBusName] = useState('');
    const [stateTitle, setStateTitle] = useState('Click Bus');
    const [busRouteId, setBusRouteId] = useState([]);
    const [busLocate, setBusLocate] = useState([]);
    const [busRoute, setBusRoute] = useState([]);

    const IntervalRef = useRef();

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
        setBusRoute([]);
        setBusRouteId([]);
        setBusLocate([]);
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

    const IntervalStationList = (routeId) => {
        setStateTitle("Click Bus")
        clearInterval(IntervalRef.current);
        BusRouteStatusList(routeId)
        getBusPosByRtidList(routeId)
        // IntervalRef.current = setInterval(async () => {
        //     await BusRouteStatusList(routeId)
        // }, 3000)
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
                {busLocate.length !== 0 ? busLocate.length + "개" : ""}
                {busRouteId.length !== 0 ?
                    <div>
                        <table>
                            <thead><tr><th>버스명</th></tr></thead>
                            <tbody>
                                {
                                    busRouteId.map((item, key) => (

                                        <tr key={key}>
                                            <td><button onClick={() => IntervalStationList(item["ROUTE_ID"])}>{item["노선명"]}</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {busRoute.length !== 0 ?
                            <div>
                                {
                                    busRoute.map((route, key) => (
                                        <p key={key}>
                                            {route.stNm["_text"] + "  "}
                                            {
                                                busLocate.findIndex(loc => loc.lastStnId["_text"] === route.stId["_text"]) !== -1 ?
                                                    "버스 도착 정보: " + route.arrmsg1["_text"] + "/" + route.arrmsg2["_text"] : ""
                                            }
                                        </p>
                                    ))
                                }
                            </div> : stateTitle + "/" + busRoute.length
                        }
                    </div> : ""
                }
            </div>
        </>
    );
}

export default BusRouteSearch;