/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createFuzzyMatcher } from '../module/consonantSearch';
// import KakaoMapScript from '../script/KakaoMapScript';
import "../css/StationMap.css";
import axios from 'axios';

const BusStationSearch = () => {
    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }
    const [station, setStation] = useState('');
    const [searchTitle, setSerchTitle] = useState('검색요망');
    const [busStation, setBusStation] = useState([]);
    const [searchStationList, setSearchStationList] = useState([]);

    useEffect(() => {
        clickBusStation();
    }, []);

    const clickBusStation = async () => {
        await axios.post("/api/StationListSearch", { StationName: station })
            .then((res) => {
                if (res.data.status === 200) {
                    setBusStation(res.data.stationId);
                } else {
                    setSerchTitle("검색하신 결과가 존재하지 않습니다.");
                    setBusStation([]);
                }
            }).catch((err) => {
                setSerchTitle("서버가 돌아가셨습니다. ㅈㅅ");
                setStation('');
            })
    }

    const SearchStation = async (e) => {
        let stationName = station
        if(stationName !== ''){
            let stationN = createFuzzyMatcher(stationName);
            let index = busStation.filter((station) => stationN.test(station["정류소명"]) ? station: '');
            setSearchStationList(index.slice(0, 10));
            e.preventDefault();
        }else{
            setSearchStationList([]);
            e.preventDefault();
        }
    }

    const handleStation = (e) => {
        const stationName = e.target.value;
        setStation(stationName);
        if(stationName !== ''){
            let stationN = createFuzzyMatcher(stationName);
            let index = busStation.filter((station) => stationN.test(station["정류소명"]) ? station: '');
            index = index.sort(function(a, b) { 
                return a["정류소명"] < b["정류소명"] ? -1 : a["정류소명"] > b["정류소명"] ? 1 : 0;
            });
            setSearchStationList(index.slice(0, 10));
        }else{
            setSearchStationList([]);
        }
    }

    return (
        <>
            <div className='map-search'>
                <div className='map-search-form'>
                    <form onSubmit={SearchStation}>
                        <input type="text" name='stationName' onChange={handleStation}></input>
                        <button type="submit">BUS 정류장 조회</button>
                    </form>
                </div>
                {station}
                {
                    searchStationList.length !== 0 ?
                        <div className='map-search-map'>
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
                                                    <td className={String(item["정류소명"]) + "_" + String(key)}>{item["정류소명"]}</td>
                                                    <td><Link to="/BusInfo"
                                                        state={{
                                                            stNm: item["정류소명"],
                                                            arsId: item["ARS-ID"],
                                                            busRouteType: busRouteType
                                                        }}
                                                    >{item["ARS-ID"]}</Link></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div> : ""
                }
            </div>
        </>
    );
}

export default BusStationSearch;