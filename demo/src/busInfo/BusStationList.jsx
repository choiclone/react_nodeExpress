/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import BusRoutModal from '../script/BusRouteModal';
import useInterval from '../script/useInterval';
import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const BusStationList = (props) => {
    const { stNm, arsId, busRouteType, stations } = props;
    const [BusStation, setBusStation] = useState([]);
    const [BusRoute, setBusRoute] = useState([]);
    const [stateTitle, setStateTitle] = useState('결과 없음');
    const [modalOpen, setModalOpen] = useState(false);
    const [routeId, setRouteId] = useState(0);

    const openModal = async (routeId) => {
        let BusList = [];
        await axios.post("/api/ArrInfoByRouteList", { busRouteId: routeId })
            .then((res) => {
                if (res.data.code === 200) {
                    setRouteId(routeId)
                    BusList.push(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) setBusRoute(BusList[0]);
                    else setBusRoute(BusList);
                    setModalOpen(true);
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const reloadModal = async () => {
        let BusList = [];
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

    return (
        <>
            <KakaoMapScript searchTitle={stNm} arsID={arsId} stationList={stations}/>
        </>
    );
}

export default BusStationList;