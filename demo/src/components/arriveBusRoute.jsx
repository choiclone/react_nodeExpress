import React from 'react'
import styled from 'styled-components'
import { stationType, routeType, StationTime, BusPosition, sortGroupString } from '../util/InfoType'

const ArriveBusRoute = ({ ArriveBus, busSearch }) => {
    const buslist = sortGroupString(ArriveBus);
    const selectBus = ArriveBus.filter((item) => String(busSearch) === item.rtNm["_text"])[0];
    return (
        <>
            {ArriveBus.length !== 0 ?
                <BusArrived>
                    <span>{stationType[ArriveBus[0].stationTp["_text"]]}</span>
                    <table>
                        <thead>
                            <tr style={{width:"150px"}}>
                                <th style={{width:"200px"}}>버스</th>
                                <th style={{width:"180px"}}>시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span style={{ color: "red" }}>
                                        {selectBus.rtNm["_text"] + "/" + routeType[selectBus.routeType["_text"]] + "버스"}
                                    </span>
                                </td>
                                <td>
                                    <span>{StationTime(selectBus.traTime1["_text"])+"["+BusPosition(selectBus.arrmsg1["_text"])}</span><br/>
                                    <span>{StationTime(selectBus.traTime2["_text"])+"["+BusPosition(selectBus.arrmsg2["_text"])}</span>
                                </td>
                            </tr>
                            {ArriveBus.map((item, key) => (
                                String(busSearch) !== String(item.rtNm["_text"]) ?
                                <tr key={key}>
                                    <td>
                                        {item.rtNm["_text"] + "/" + routeType[item.routeType["_text"]] + "버스"}
                                    </td>
                                    <td>
                                        <span>{StationTime(item.traTime1["_text"])+"["+BusPosition(item.arrmsg1["_text"])}</span><br/>
                                        <span>{StationTime(item.traTime2["_text"])+"["+BusPosition(item.arrmsg2["_text"])}</span>
                                    </td>
                                </tr>: ""
                            ))}
                        </tbody>
                    </table>
                </BusArrived> : ""
            }
        </>
    )
    
}

const BusArrived = styled.div`
    position: fixed;
    display: block;
    background: black;
    font-size: 20px;
    margin-top: -72px;
`

export default ArriveBusRoute