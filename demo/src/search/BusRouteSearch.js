/*global kakao*/
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import SearchComponent from './ComponentSearch';
import "../css/Search.css";
import axios from 'axios';
import ArriveBusRoute from '../components/arriveBusRoute';
import BusRouteLine from '../components/busRouteLine';

const BusRouteSearch = () => {
    const [busName, setBusName] = useState('');
    const [stateTitle, setStateTitle] = useState('Click Bus');
    const [busSearch, setBusSearch] = useState('');
    const [busRouteId, setBusRouteId] = useState([]);
    const [busReloadInfo, setBusReloadInfo] = useState([]);
    const [busLocate, setBusLocate] = useState([]);
    const [busRoute, setBusRoute] = useState([]);
    const [arrive, setArrive] = useState([]);
    const [routes, setRoutes] = useState(JSON.parse(localStorage.getItem('routes') || '[]'));

    const IntervalRef = useRef();

    useEffect(() => {
        localStorage.setItem('routes', JSON.stringify(routes));
    }, [routes]);

    useEffect(() => {
        return () => clearInterval(IntervalRef.current);
    }, []);

    const SearchRoute = (e) => {
        axios.get(`/api/RouteSearch?busName=${busName}`)
            .then((res) => {
                if (res.data.status === 200) {
                    const {route} = res.data;
                    let routeObj = route[0];
                    let item = [];
                    if(route.length !== 0){
                        item.push({ Nm: routeObj["노선명"], Id: routeObj["ROUTE_ID"], Begin: routeObj["기점"], End: routeObj["종점"] });
                        IntervalStationList(item[0]);
                    }
                } else clearInterval(IntervalRef.current);
            })
            .catch((err) => {
                console.log(err);
                clearInterval(IntervalRef.current);
            });
        e.preventDefault();
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
                console.log(err);
            })
    }

    const debounceSearch = useMemo(() => debounce((BusName) => {
        axios.get(`/api/BusListSearch?busName=${BusName}`)
            .then((res) => {
                if (res.data.status === 200) {
                    const {routeId} = res.data
                    if(routeId.length !== 0){
                        setBusRouteId(routeId);
                    }else{
                        setBusRouteId([]);
                    }
                } else setBusRouteId(res.data.routeId);
            })
            .catch((err) => {
                console.log(err);
                setBusRouteId([]);
            });
    }, 10), [busName]);

    const handleBus = (e) => {
        if (e.target.value !== '') setStateTitle("Click Bus");
        else setStateTitle("");
        setBusSearch("");
        setBusRoute([]);
        setBusReloadInfo([]);
        setBusLocate([]);
        setArrive([]);
        clearInterval(IntervalRef.current);
        setBusName(e.target.value);
        debounceSearch(e.target.value);
    }

    const IntervalStationList = (item, state=undefined) => {
        clearInterval(IntervalRef.current);
        if(state!=="reload") setBusRoute([]);
        setArrive([]);
        const Nm = item.Nm;
        let id = item.Id;
        const newKeyword = {
            id: id,
            Nm: Nm,
            "기점": item.Begin,
            "종점": item.End
        };
        
        const distinctRoute = routes.filter((rmRoute) => {
            return rmRoute.id === id
        });
        if(distinctRoute.length === 0) setRoutes([newKeyword, ...routes]);
        setBusName('');
        setBusRouteId([]);
        setBusReloadInfo({"노선명": Nm, "ROUTE_ID":id, "기점": item.Begin, "종점": item.End});
        setBusSearch(Nm);
        BusRouteStatusList(id);
        getBusPosByRtidList(id);
        // IntervalRef.current = setInterval(async () => {
        //     await BusRouteStatusList(id);
        //     await getBusPosByRtidList(id);
        // }, 3000);
    }

    const allRemoveStorage = (id) => {
        localStorage.removeItem("routes");
        setRoutes([]);
    }

    const singleRemoveStorage = (id) => {
        const removeRoute = routes.filter((rmRoute) => {
            return rmRoute.id !== id
        })
        setRoutes(removeRoute);
    }

    const ReloadRoute = (Nm, id, itemList) => {
        let item = [];
        item.push({
            Nm: Nm, 
            Id: id,
            Begin: itemList["기점"],
            End: itemList["종점"]
        });
        IntervalStationList(item[0], "reload");
    }

    return (
        <>
            <div>
                버스 검색            
            </div>
            <div className='map-search'>
                <SearchComponent 
                    SearchInfo={SearchRoute} 
                    handleSearch={handleBus} 
                    buttonTitle={"노선명"} 
                    autoInfo={routes} 
                    allRemoveStorage={allRemoveStorage}
                    singleRemoveStorage={singleRemoveStorage}
                    intervalInfo={IntervalStationList}
                    autoCompleteList={busRouteId}
                    searchTitle={busName}
                    searchIdType={"ROUTE_ID"}
                />
                <ArriveBusRoute
                    ArriveBus={arrive}
                    busSearch={busSearch}
                />
                <BusRouteLine 
                    BusRoute={busRoute}
                    ReloadRoute={ReloadRoute}
                    getBusArrInfo={getBusArrInfo}
                    busSearch={busSearch}
                    busLocate={busLocate}
                    busReloadInfo={busReloadInfo}
                />
            </div>
            <div>

            </div>
        </>
    );
}

export default BusRouteSearch;