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

    // useEffect(() => {
    //     clickStationInfo();
    // }, []);

    // const clickStationInfo = async (e) => {
    //     let BusList = [];
    //     setStateTitle('로딩 중...');
    //     await axios.post("/api/ArriveBusList", { arsID: arsId })
    //         .then((res) => {
    //             if (res.data.code === 200) {
    //                 BusList.push(res.data.arrive["ServiceResult"]["msgBody"]["itemList"]);
    //                 if (Array.isArray(BusList[0])) setBusStation(BusList[0])
    //                 else setBusStation(BusList)
    //                 setStateTitle('검색완료');
    //             } else {
    //                 setStateTitle('결과 없음');
    //             }
    //         }).catch((err) => {
    //             console.log(err)
    //         })
    // }

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
            {/* <div className="App">
                <header className="App-header">
                    <h2>해당 정류소에 경유하는 버스 목록/경유 버스 개수: {BusStation.length}</h2>
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
                                                <td><button onClick={() => openModal(item.busRouteId["_text"])}>{item.busRouteId["_text"]}</button></td>
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
                            : <h5>{stateTitle}</h5>
                    }
                    <BusRoutModal open={modalOpen} close={closeModal} reload={reloadModal} header="Bus Route List" BusRoute={BusRoute} routeId={routeId} />
                </header>
            </div> */}
        </>
    );
}

export default BusStationList;