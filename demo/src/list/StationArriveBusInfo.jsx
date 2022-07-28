import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import BusStationList from '../busInfo/BusStationList';
import BusArriveList from '../busInfo/BusArriveList';

import { useLocation } from 'react-router';
import { createBrowserHistory } from "history"

const StationArriveBusInfo = () => {
    const { stNm, arsId, busRouteType, searchType } = useLocation().state;

    const [infoTyped, setInfoTyped] = useState(1)
    const [BusStation, setBusStation] = useState(<BusArriveList stNm={stNm} arsId={arsId} busRouteType={busRouteType}></BusArriveList>);
    const [BusStationLists, setBusStationLists] = useState([]);

    useEffect(() => {
        let BusList = [];
        axios.post("/api/ArriveBusList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    BusList.push(res.data.arrive["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) setBusStationLists(BusList[0][0]);
                    else setBusStationLists(BusList[0]);
                }
            })
    }, [])

    useEffect(() => {
        if (stNm !== "") {
            let stations = JSON.parse(localStorage.getItem('stations') || '[]')
            const newKeyword = {
                id: arsId,
                Nm: String(stNm)
            }
            const distinctStation = stations.filter((rmStation) => {
                return rmStation.id === arsId
            });
            if (distinctStation.length === 0) {
                stations.push(newKeyword)
                localStorage.setItem('stations', JSON.stringify(stations))
            }
        }
    }, [])

    const BusInfoFunc = (infoType) => {
        const infoTypes = infoType;
        setInfoTyped(infoType);
        switch (infoTypes) {
            case 0: {
                setBusStation(<BusStationList stNm={stNm} arsId={arsId} busRouteType={busRouteType} stations={BusStationLists}></BusStationList>);
                break;
            }
            case 1: {
                setBusStation(<BusArriveList stNm={stNm} arsId={arsId} busRouteType={busRouteType}></BusArriveList>);
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
            <StationInfoDiv>
                <button type="button" onClick={() => BusInfoFunc(0)}>정류소 위치</button>
                <button type="button" onClick={() => BusInfoFunc(1)}>도착 버스 정보 목록</button>
                {BusStation}
            </StationInfoDiv>
        </>
    );
}

const StationInfoDiv = styled.div`
    width: 70%;
    margin: auto;
    text-align: center;
`;

export default StationArriveBusInfo;