/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createFuzzyMatcher } from '../module/consonantSearch';
import SearchComponent from '../search/searchComponent';
// import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const BusStationSearch = () => {
    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }
    const [station, setStation] = useState('');
    const [busStation, setBusStation] = useState([]);
    const [stations, setStations] = useState(JSON.parse(localStorage.getItem('stations') || '[]'));
    const [searchStationList, setSearchStationList] = useState([]);

    useEffect(() => {
        clickBusStation();
    }, []);

    useEffect(() => {
        localStorage.setItem('stations', JSON.stringify(stations))
    }, [stations])

    const clickBusStation = async () => {
        await axios.post("/api/StationListSearch", { StationName: station })
            .then((res) => {
                if (res.data.status === 200) {
                    setBusStation(res.data.stationId);
                } else {
                    setBusStation([]);
                }
            }).catch((err) => {
                setStation('');
            })
    }

    const SearchInfo = (e) => {
        let stationName = station
        const newKeyword = {
            id: Math.random().toString(36).substr(2, 16),
            Nm: String(stationName)
        }
        const distinctStation = stations.filter((rmStation) => {
            return rmStation.Nm === String(stationName)
        })
        if (distinctStation.length === 0) setStations([newKeyword, ...stations]);
        if (stationName !== '') {
            let stationN = createFuzzyMatcher(stationName);
            let index = busStation.filter((station) => stationN.test(station["정류장"]) ? station : '');
            index = index.sort(function (a, b) {
                return a["정류장"] < b["정류장"] ? -1 : a["정류장"] > b["정류장"] ? 1 : 0;
            });
            setSearchStationList(index.slice(0, 10));
            setStations([newKeyword, ...stations])
        } else {
            setSearchStationList([]);
        }
        e.preventDefault();
    }

    const handleSearch = (e) => {
        const stationName = String(e.target.value).replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
        setStation(stationName);
        if (stationName !== '') {
            let stationN = createFuzzyMatcher(stationName);
            let index = busStation.filter((station) => stationN.test(station["정류장"]) ? station : ''); // 초성 검색 가능
            // let index = busStation.filter((station) => new RegExp("^"+stationName, "gi").test(station["정류장"]) ? station : ''); // 초성 검색 제외
            index = index.sort(function (a, b) {
                return a["정류장"] < b["정류장"] ? -1 : a["정류장"] > b["정류장"] ? 1 : 0;
            });
            setSearchStationList(index.slice(0, 10));
        } else {
            setSearchStationList([]);
        }
    }

    const allRemoveStorage = () => {
        localStorage.removeItem("stations")
        setStations([])
    }

    const singleRemoveStorage = (id) => {
        const removeStation = stations.filter((rmStation) => {
            return rmStation.id !== id
        })
        setStations(removeStation)
    }

    return (
        <>
            <div className='map-search'>
                <SearchComponent SearchInfo={SearchInfo} handleSearch={handleSearch}
                    buttonTitle={"정류장"} autoInfo={stations}
                    allRemoveStorage={allRemoveStorage}
                    singleRemoveStorage={singleRemoveStorage} />
                {
                    searchStationList.length !== 0 ?
                        <div className='map-search-station'>
                            <table className='map-station-table'>
                                <thead>
                                    <tr>
                                        <th>정류소 명</th>
                                        <th>정류소 고유번호</th>
                                    </tr>
                                </thead>
                                <tbody id="stationId">
                                    {
                                        searchStationList.map((item, key) => (
                                            <tr key={key}>
                                                <td>
                                                    {
                                                        (String(item["정류장"]).split(new RegExp(`(${station})`, "gi"))).map((part, i) =>
                                                            <span key={i} style={part.toLowerCase() === station.toLowerCase() ? { color: 'green' } : {}}>
                                                                {part}
                                                            </span>
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    <Link
                                                        to="/BusInfo"
                                                        state={{
                                                            stNm: item["정류장"],
                                                            arsId: item["ARS-ID"],
                                                            busRouteType: busRouteType
                                                        }}
                                                    ><span>{item["ARS-ID"]}</span></Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div> : ""
                }
            </div>
        </>
    );
}

export default BusStationSearch;