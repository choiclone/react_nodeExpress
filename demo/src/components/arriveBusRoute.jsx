import React from 'react'
import styled from 'styled-components'
import { stationType, routeType, StationTime, BusPosition } from '../util/InfoType'

const ArriveBusRoute = ({ ArriveBus, busSearch }) => {
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
                            {ArriveBus.map((item, key) => (
                                <tr key={key}>
                                    <td>{String(busSearch) === String(item.rtNm["_text"]) ?
                                        <span style={{ color: "red" }}>{item.rtNm["_text"] + "/" + routeType[item.routeType["_text"]] + "버스"}</span>
                                        : item.rtNm["_text"] + "/" + routeType[item.routeType["_text"]] + "버스"}
                                    </td>
                                    <td>
                                        <span>{StationTime(item.traTime1["_text"])+"["+BusPosition(item.arrmsg1["_text"])}</span><br/>
                                        <span>{StationTime(item.traTime2["_text"])+"["+BusPosition(item.arrmsg2["_text"])}</span>
                                    </td>
                                </tr>
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