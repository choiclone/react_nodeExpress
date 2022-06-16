/*global kakao*/
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createFuzzyMatcher } from '../module/consonantSearch';
import SearchComponent from './SearchComponent';
// import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const BusStationSearch = () => {
    const navigate = useNavigate();
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
    }, [stations]);

    const clickBusStation = () => {
        axios.get("/api/StationListSearch", { StationName: station })
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
        let stationName = station;
        if (stationName !== '') {
            let stationN = createFuzzyMatcher(stationName);
            let index = busStation.filter((station) => stationN.test(station["정류장"]) ? station : '');
            index = index.sort(function (a, b) {
                return a["정류장"] < b["정류장"] ? -1 : a["정류장"] > b["정류장"] ? 1 : 0;
            });
            setSearchStationList(index.slice(0, 10));
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

    const singleRemoveStorage = (id) => {
        const removeStation = stations.filter((rmStation) => {
            return rmStation.id !== id;
        });
        setStations(removeStation);
    }

    const busInfoFunc = (Nm, id) => {
        navigate("/StationInfo", {
            state: {
                stNm: Nm,
                arsId: id,
                busRouteType: busRouteType,
                searchType: "station",
            }
        });
    }

    return (
        <>
            <div className='map-search'>
                <SearchComponent 
                    SearchInfo={SearchInfo} 
                    handleSearch={handleSearch}
                    buttonTitle={"정류장"} 
                    autoInfo={stations}
                    singleRemoveStorage={singleRemoveStorage}
                    intervalInfo={busInfoFunc}
                    autoCompleteList={searchStationList}
                    searchTitle={station}
                    searchIdType={"ARS-ID"} />
            </div>
        </>
    );
}

export default BusStationSearch;