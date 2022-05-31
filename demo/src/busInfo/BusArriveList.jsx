import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../script/useInterval';
import axios from 'axios';

const BusArriveList = (props) => {
    const { arsId, busRouteType } = props;
    const [arrive, setArrive] = useState([]);
    const [stateTitle, setStateTitle] = useState('결과 없음');

    useEffect(() => {
        ArriveBusListInfo();
    }, []);

    useInterval(() => {
        ArriveBusListInfo();
    }, 2000);

    const ArriveBusListInfo = async (e) => {
        let BusList = [];
        setStateTitle('로딩 중...');
        await axios.post("/api/ArriveBusList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {

                    BusList.push(res.data.arrive["ServiceResult"]["msgBody"]["itemList"]);
                    if (Array.isArray(BusList[0])) {
                        setArrive(BusList[0])
                    } else {
                        setArrive(BusList)
                    }
                    setStateTitle('검색완료');
                } else {
                    setStateTitle('결과 없음');
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <h2>정류소 고유번호에 해당하는 정류소의 도착버스 정보 조회/도착 버스 개수: {arrive.length}</h2>
                    {
                        arrive.length !== 0 ?
                            <table>
                                <thead>
                                    <tr>
                                        {/* <th>노선 ID</th> */}
                                        <th>버스명</th>
                                        <th>정류소 명</th>
                                        <td>노선 유형</td>
                                        <td>방향</td>
                                        <td>첫번째 도착 예정 버스</td>
                                        <td>두번째 도착 예정 버스</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        arrive.map((item, key) => (
                                            <tr key={key}>
                                                {/* <td>{item.busRouteId["_text"]}</td> */}
                                                <td>{item.rtNm["_text"]}</td>
                                                <td>{item.stNm["_text"]}</td>
                                                <td>{busRouteType[item.routeType["_text"]]}</td>
                                                <td>{item.adirection["_text"]}</td>
                                                <td>{item.arrmsg1["_text"]}</td>
                                                <td>{item.arrmsg2["_text"]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            : <h5>{stateTitle}</h5>
                    }
                </header>
            </div>
        </>
    );
}

export default BusArriveList;