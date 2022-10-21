import React from 'react'

const BusRouteLine = ({
    BusRoute,
    ReloadRoute,
    getBusArrInfo,
    busSearch,
    busLocate,
    busReloadInfo
}) => {
    const styleSheet = {
        fontSize: "15px",
        listStyle: "none"
    };

    const verticalStyle = {
        verticalAlign: "middle",
        color: "green",
    };

    return (
        <>
            {BusRoute.length !== 0 ?
                <div>
                    <div> 
                        <span style={{
                            fontSize: "25px"
                        }}>
                            {busSearch} 운행 개수: {busLocate.length !== 0 ? busLocate.length + "개" : ""}
                        </span>
                    </div>
                    <ul style={styleSheet}>
                        {
                            BusRoute.map((route, key) => (
                                <li key={key} style={verticalStyle}>
                                    {
                                        busLocate.findIndex(loc => loc.lastStnId["_text"] === route.stId["_text"]) !== -1 ?
                                        <div>
                                            <span style={{
                                                verticalAlign: "middle",
                                                color: "green",
                                            }} onClick={() => getBusArrInfo(route.arsId["_text"])}>{route.stNm["_text"]}</span>
                                            <img style={verticalStyle} src='/staticFolder/busImages/bus.png' width="50px" height="50px" />
                                        </div> : 
                                        <div>
                                        <span style={{
                                            verticalAlign: "middle",
                                            color: "white",
                                        }} onClick={() => getBusArrInfo(route.arsId["_text"])}>{route.stNm["_text"]}</span>
                                        </div>
                                    }
                                </li>
                            ))
                        }
                        <li>
                            <button onClick={(e) => ReloadRoute(busReloadInfo["노선명"], busReloadInfo["ROUTE_ID"], busReloadInfo)}>
                                <img src="/staticFolder/busImages/reload.png" width="40px" height="40px" />
                            </button>
                        </li>
                    </ul>
                </div> : ""
            }
        </>
    )
}

export default BusRouteLine