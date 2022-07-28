/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import KakaoMapScript from '../script/KakaoMapScript';

const BusStationList = (props) => {
    const { stNm, arsId, busRouteType, stations, SecRadius } = props;

    return (
        <>
            <KakaoMapScript searchTitle={stNm} arsID={arsId} stationList={stations} SecRadisu={SecRadius}/>
        </>
    );
}

export default BusStationList;