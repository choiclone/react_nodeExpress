/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import SearchComponent from './SearchComponent';
import "../css/Search.css";
import axios from 'axios';

const BusRouteSearch = () => {
    const [busName, setBusName] = useState('');
    const [stateTitle, setStateTitle] = useState('Click Bus');
    const [busSearch, setBusSearch] = useState('');
    const [busRouted, setBusRouted] = useState([]);
    const [busRouteId, setBusRouteId] = useState([]);
    const [busReloadInfo, setBusReloadInfo] = useState([]);
    const [busLocate, setBusLocate] = useState([]);
    const [busRoute, setBusRoute] = useState([]);
    const [arrive, setArrive] = useState([]);
    const [routes, setRoutes] = useState(JSON.parse(localStorage.getItem('routes') || '[]'));

    const IntervalRef = useRef();

    const stationType = { 0: "공용 버스", 1: "일반형 시내/ 농어촌버스", 2: "좌석형 시내 / 농어촌버스", 3: "직행좌석형 시내 / 농어촌버스", 4: "일반형 시외버스", 5: "좌석형 시외버스", 6: "고속형 시외버스", 7: "마을버스" }
    const routeType = { 1: "공항", 2: "마을", 3: "간선", 4: "지선", 5: "순환", 6: "광역", 7: "인천", 8: "경기", 9: "폐지", 0: "공용" }

    useEffect(() => {
        BusInfoList()
    }, []);

    useEffect(() => {
        localStorage.setItem('routes', JSON.stringify(routes))
    }, [routes])

    useEffect(() => {
        return () => clearInterval(IntervalRef.current);
    }, []);

    const BusInfoList = async () => {
        await axios.get("/api/BusListSearch", { BusName: busName })
            .then((res) => {
                if (res.data.status === 200) {
                    setBusRouted(res.data.routeId)
                } else setBusRouted(res.data.routeId)
            })
            .catch((err) => {
                console.log(err)
                setBusRouted([])
            })
    }

    const SearchRoute = (e) => {
        let busN = busName
        if (busN !== '') {
            let index = busRouted.filter((route, idx) => new RegExp("^"+busName, "gi").test(route["노선명"]) ? route : '');
            index = index.sort(function(a, b) { 
                return a["노선명"] < b["노선명"] ? -1 : a["노선명"] > b["노선명"] ? 1 : 0;
            });
            setBusRouteId(index.slice(0, 10))
        } else {
            setBusRouteId([])
        }
        e.preventDefault();
    }

    const handleBus = (e) => {
        if (e.target.value !== '') setStateTitle("Click Bus")
        else setStateTitle("")
        setBusSearch("")
        setBusRoute([]);
        setBusReloadInfo([]);
        setBusRouteId([]);
        setBusLocate([]);
        setArrive([]);
        clearInterval(IntervalRef.current)
        setBusName(e.target.value);
        let busName = e.target.value
        if (busName !== '') {
            let index = busRouted.filter((route, idx) => new RegExp(busName, "gi").test(route["노선명"]) ? route : '');
            index = index.sort(function(a, b) { 
                return a["노선명"] < b["노선명"] ? -1 : a["노선명"] > b["노선명"] ? 1 : 0;
            });
            setBusRouteId(index.slice(0, 10))
        } else {
            setBusRouteId([])
        }
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
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const IntervalStationList = (routeNm, itemId, e) => {
        clearInterval(IntervalRef.current);
        const Nm = routeNm;
        let id = itemId;
        if(id === undefined){
            const index = busRouted.findIndex(i => i["노선명"] === Nm);
            id = busRouted[index]["ROUTE_ID"]
            setBusRoute([]);
        }
        const newKeyword = {
            id: itemId,
            Nm: Nm
        };
        const distinctRoute = routes.filter((rmRoute) => {
            return rmRoute.id === itemId
        })
        if(distinctRoute.length === 0) setRoutes([newKeyword, ...routes]);
        setBusRouteId([]);
        setBusReloadInfo({"노선명": Nm, "ROUTE_ID":id});
        setBusSearch(Nm)
        BusRouteStatusList(id)
        getBusPosByRtidList(id)
        // IntervalRef.current = setInterval(async () => {
        //     await BusRouteStatusList(id)
        //     await getBusPosByRtidList(id)
        //     console.log("ddd")
        // }, 3000);
    }

    const allRemoveStorage = () => {
        localStorage.removeItem("routes")
        setRoutes([]);
    }

    const singleRemoveStorage = (id) => {
        const removeRoute = routes.filter((rmRoute) => {
            return rmRoute.id !== id
        })
        setRoutes(removeRoute)
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
            <div className='map-search'>
                <SearchComponent SearchInfo={SearchRoute} handleSearch={handleBus} 
                                buttonTitle={"노선명"} autoInfo={routes} 
                                allRemoveStorage={allRemoveStorage}
                                singleRemoveStorage={singleRemoveStorage}
                                intervalInfo={IntervalStationList}
                                autoCompleteList={busRouteId}
                                searchTitle={busName}/>
                {busRouteId.length !== 0 ?
                    <ul className='search-route-list'>
                        {
                            busRouteId.map((item, key) => (
                                <li key={key} onClick={(e) => IntervalStationList(item["노선명"], item["ROUTE_ID"], e)}>
                                    {
                                        String(item["노선명"]).split(new RegExp("^"+ `(${busName})`, "gi")).map((part, i) => 
                                            <span key={i} style={part.toLowerCase() === busName.toLowerCase() ? {color: 'green'}: {}}>
                                                {part}
                                            </span>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul> : ""
                }
                {
                    arrive.length !== 0 ?
                        <div>
                            {stationType[arrive[0].stationTp["_text"]]}
                            {arrive.map((item, key) => (
                                <ol key={key}>
                                    <li>{String(busSearch) === String(item.rtNm["_text"]) ?
                                        <span style={{ color: "red" }}>{item.rtNm["_text"] + "/" + routeType[item.routeType["_text"]] + "버스"}</span>
                                        : item.rtNm["_text"] + "/" + routeType[item.routeType["_text"]] + "버스"}</li>
                                    <li>{item.arrmsg1["_text"]}</li>
                                    <li>{item.arrmsg2["_text"]}</li>
                                </ol>
                            ))}
                        </div> : ""
                }
                {busRoute.length !== 0 ?
                    <div>
                        <h5> {busSearch} 운행 개수: {busLocate.length !== 0 ? busLocate.length + "개" : ""}</h5>
                        <ul style={styleSheet}>
                            {
                                busRoute.map((route, key) => (
                                    <li key={key} style={verticalStyle}>
                                        <button style={verticalStyle} onClick={() => getBusArrInfo(route.arsId["_text"])}>{route.stNm["_text"]}</button>
                                        {
                                            busLocate.findIndex(loc => loc.lastStnId["_text"] === route.stId["_text"]) !== -1 ?
                                                <img style={verticalStyle} src='/staticFolder/busImages/bus.png' width="50px" height="50px" /> : ""
                                        }
                                    </li>
                                ))
                            }
                            <li>
                                <button onClick={(e) => IntervalStationList(busReloadInfo["노선명"], busReloadInfo["ROUTE_ID"], e)}>
                                    <img src="/staticFolder/busImages/reload.png" width="40px" height="40px" />
                                </button>
                            </li>
                        </ul>
                    </div> : ""
                }
            </div>
        </>
    );
}

export default BusRouteSearch;