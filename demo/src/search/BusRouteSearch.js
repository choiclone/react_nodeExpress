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
        setBusRoute([]);
        setBusRouteId([]);
        clearInterval(IntervalRef.current)
        setBusName(e.target.value);
    }

    const BusRouteStatusList = async (routeId) => {
        let BusList = [];
        console.log(routeId)
        setStateTitle("가져오는 중...")
        await axios.post("/api/ArrInfoByRouteList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    // res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]

                    BusList.push(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]);
                    console.log(BusList)
                    if (Array.isArray(BusList[0])) setBusRoute(BusList[0]);
                    else setBusRoute(BusList);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const getBusPosByRtidList = (routeId) => {
        let BusList = [];
        axios.post("/api/getBusPosByRtidList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.BusLocate["ServiceResult"]["msgBody"]["itemList"]);
                    console.log(BusList)
                    if (Array.isArray(BusList[0])) setBusLocate(BusList[0]);
                    else setBusLocate(BusList);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const IntervalStationList = (routeId) => {
        clearInterval(IntervalRef.current);
        BusRouteStatusList(routeId)
        getBusPosByRtidList(routeId)
        IntervalRef.current = setInterval(async () => {
            await BusRouteStatusList(routeId)
        }, 3000)
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
                        <ol>
                            {
                                busRouteId.map((item, key) => (
                                    <li key={key}><button onClick={() => IntervalStationList(item["ROUTE_ID"])}>{item["노선명"]}</button></li>

                                ))
                            }</ol>
                        {busRoute.length !== 0 ?
                            <div>
                                {
                                    busRoute.map((route, key) => (
                                        <p key={key}>{route.stNm["_text"] + "/" + route.arrmsg1["_text"] + "/" + route.arrmsg2["_text"]}</p>
                                    ))
                                }
                            </div> : stateTitle
                        }
                    </div> : ""
                }
            </div>
        </>
    );
}

export default BusRouteSearch;