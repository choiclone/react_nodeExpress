import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFuzzyMatcher } from '../module/consonantSearch';
import { busStationType } from '../util/InfoType'
import SearchComponent from './ComponentSearch';
import axios from 'axios';

const BusStationSearch = () => {
    const navigate = useNavigate();
    const [station, setStation] = useState('');
    const [busStation, setBusStation] = useState([]);
    const [stations, setStations] = useState(JSON.parse(localStorage.getItem('stations') || '[]'));
    const [searchStationList, setSearchStationList] = useState([]);

    useEffect(() => {
        clickBusStation();
    }, []);

    useEffect(() => {
        localStorage.setItem('stations', JSON.stringify(stations));
    }, [stations]);

    const clickBusStation = async () => {
        await axios.get("/api/StationListSearch", { StationName: station })
            .then((res) => {
                if (res.data.status === 200) {
                    setBusStation(res.data.stationId);
                } else {
                    setBusStation([]);
                }
            }).catch((err) => {
                setStation('');
            });
    }

    const SearchInfo = (e) => {
        let stationName = station;
        if (stationName !== '') {
            let index = busStation.filter((station) => station["정류장"] === stationName);
        } else {
            setSearchStationList([]);
        }
        e.preventDefault();
    }

    const handleSearch = (e) => {
        const stationName = String(e.target.value);
        setStation(stationName);
        if (stationName !== '') {
            let stationN = createFuzzyMatcher(stationName);
            let indexN = busStation.map((station) => stationN.test(station["정류장"]) ? station : '').filter(String); // 초성 검색 가능
            // let index = busStation.filter((station) => new RegExp("^"+stationName, "gi").test(station["정류장"]) ? station : ''); // 초성 검색 제외
            indexN = indexN.sort((a, b) => {
                return a["정류장"] < b["정류장"] ? -1 : a["정류장"] > b["정류장"] ? 1 : 0;
            });
            setSearchStationList(indexN.slice(0, 10));
        } else {
            setSearchStationList([]);
        }
    }

    const allRemoveStorage = (id) => {
        localStorage.removeItem("stations");
        setStations([]);
    }

    const singleRemoveStorage = (id) => {
        const removeStation = stations.filter((rmStation) => {
            return rmStation.id !== id;
        });
        setStations(removeStation);
    }

    const busInfoFunc = (item) => {
        navigate("/StationInfo", {
            state: {
                stNm: item.Nm,
                arsId: item.Id,
                busRouteType: busStationType,
                searchType: "station",
            }
        });
    }

    return (
        <>
            <div>
                정류장 검색
            </div>
            <div className='map-search'>
                <SearchComponent
                    SearchInfo={SearchInfo}
                    handleSearch={handleSearch}
                    buttonTitle={"정류장"}
                    autoInfo={stations}
                    allRemoveStorage={allRemoveStorage}
                    singleRemoveStorage={singleRemoveStorage}
                    intervalInfo={busInfoFunc}
                    autoCompleteList={searchStationList}
                    searchTitle={station}
                    searchIdType={"ARS-ID"}
                />
            </div>
        </>
    );
}

export default BusStationSearch;