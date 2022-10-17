import React from 'react'
import { stationType, routeType } from '../util/InfoType'

const ArriveBusRoute = ({ ArriveBus, busSearch }) => {
    return (
        <>
            {
                ArriveBus.length !== 0 ?
                    <div>
                        {stationType[ArriveBus[0].stationTp["_text"]]}
                        {ArriveBus.map((item, key) => (
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
        </>
    )
}

export default ArriveBusRoute