import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';

const StationArriveBusInfo = () => {
    const { stNm, arsId } = useLocation().state;
    const [station, setStation] = useState('');
    const [arrive, setArrive] = useState([]);

    useEffect(() => {
        clickStationInfo();
    }, [])

    const handleStation = (e) => {
        setStation(e.target.value);
    }

    const clickStationInfo = async (e) => {
        // await axios.post("/api/BusStationList", { arsID: arsId })
        //     .then((res) => {
        //         if (res.data.code === 200) {
        //             console.log("StationList", res.data.stationList["ServiceResult"]["msgBody"])
        //         }
        //     });
        await axios.post("/api/ArriveBusList", { arsID: arsId })
            .then((res) => {
                if (res.data.code === 200) {
                    let a = res.data.arrive["ServiceResult"]["msgBody"]["itemList"];
                    setArrive(a)
                }
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="App">
                <header className="App-header">
                    <input type="text" name='stationName' onChange={handleStation}></input>
                    {
                        arrive.length !== 0 ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>정류소 명</th>
                                        <th>정류소 고유번호</th>
                                        <th>정류소 명</th>
                                        <th>정류소 고유번호</th>
                                        <th>정류소 명</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        arrive.map((item, key) => (
                                            <tr key={key}>
                                                <td>{item.adirection["_text"]}</td>
                                                <td>{item.arrmsg1["_text"]}</td>
                                                <td>{item.arrmsg2["_text"]}</td>
                                                <td>{item.busRouteId["_text"]}</td>
                                                <td>{item.arsId["_text"]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            : <h5>ddd</h5>
                    }
                </header>
            </div>
        </>
    );
}

export default StationArriveBusInfo;