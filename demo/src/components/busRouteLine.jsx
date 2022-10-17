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
        color: "green",
        listStyle: "none"
    };

    const verticalStyle = {
        verticalAlign: "middle",
    };

    return (
        <>
            {BusRoute.length !== 0 ?
                <div>
                    <h5> {busSearch} 운행 개수: {busLocate.length !== 0 ? busLocate.length + "개" : ""}</h5>
                    <ul style={styleSheet}>
                        {
                            BusRoute.map((route, key) => (
                                <li key={key} style={verticalStyle}>
                                    <button style={verticalStyle} onClick={() => getBusArrInfo(route.arsId["_text"])}>{route.stNm["_text"]}</button>
                                    {
                                        busLocate.findIndex(loc => loc.lastStnId["_text"] === route.stId["_text"]) !== -1 ?
                                            <img style={verticalStyle} src='/staticFolder/busImages/bus.png' width="50px" height="50px" /> : ""
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