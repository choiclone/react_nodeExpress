/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import { createFuzzyMatcher } from '../module/consonantSearch';
import SearchComponent from './ComponentSearch';
import ImageZoomInOut from '../module/ImageZoomInOut';
import "../css/Search.css";
import axios from 'axios';

const SubwaySearch = () => {
    const [subwayTitle, setSubwayTitle] = useState("");
    const [subways, setSubways] = useState(JSON.parse(localStorage.getItem('subways') || '[]'));
    const [searchSubwayList, setSearchSubwayList] = useState([]);
    const [subway, setSubway] = useState([]);

    useEffect(() => {
        axios.get("/api/SubwayListSearch")
            .then((res) => {
                if (res.data.status === 200) {
                    setSubway(res.data.subwayId);
                } else {
                    setSubway(res.data.subwayId);
                }
            }).catch((err) => {
                setSubway([]);
                console.error(err)
            })
    }, []);

    useEffect(() => {
        localStorage.setItem('subways', JSON.stringify(subways));
    }, [subways]);

    const SearchInfo = (e) => {
        let subwayName = subwayTitle;
        if (subwayName !== '') {
            let subwayN = createFuzzyMatcher(subwayName);
            let index = subway.filter((sub) => subwayN.test(sub["전철역명"]) ? sub : '');
            index = index.sort(function (a, b) {
                return a["전철역명"] < b["전철역명"] ? -1 : a["전철역명"] > b["전철역명"] ? 1 : 0;
            });
            setSearchSubwayList(index.slice(0, 10));
        } else {
            setSearchSubwayList([]);
        }
        e.preventDefault();
    }

    const handleSearch = e => {
        setSubwayTitle(e.target.value);
        const subwayName = e.target.value;
        if (subwayName !== '') {
            let subwayN = createFuzzyMatcher(subwayName);
            let indexN = subway.map((sub) => subwayN.test(sub["전철역명"]) ? sub : '').filter(String);
            indexN = indexN.sort((a, b) => {
                return a["전철역명"] < b["전철역명"] ? -1 : a["전철역명"] > b["전철역명"] ? 1 : 0;
            });
            setSearchSubwayList(indexN.slice(0, 10));
        } else {
            setSearchSubwayList([]);
        }
    }

    const allRemoveStorage = (id) => {
        localStorage.removeItem("subways");
        setSubways([]);
    }

    const singleRemoveStorage = (id) => {
        const removeSubway = subways.filter((rmSubway) => {
            return rmSubway.id !== id;
        });
        setSubways(removeSubway);
    }

    const busInfoFunc = (item) => {
        const newKeyword = {
            id: item.Id,
            Nm: item.Nm,
            "호선": item.Line
        };
        const distinctSubway = subways.filter((rmSubway) => {
            return rmSubway.id === item.Id;
        })
        if (distinctSubway.length === 0) setSubways([newKeyword, ...subways]);
    }

    return (
        <>
            <div className='map-search'>
                <SearchComponent
                    SearchInfo={SearchInfo}
                    handleSearch={handleSearch}
                    buttonTitle={"전철역명"}
                    autoInfo={subways}
                    allRemoveStorage={allRemoveStorage}
                    singleRemoveStorage={singleRemoveStorage}
                    intervalInfo={busInfoFunc}
                    autoCompleteList={searchSubwayList}
                    searchTitle={subwayTitle}
                    searchIdType={"전철역코드"}
                />
                <ImageZoomInOut></ImageZoomInOut>
            </div>
        </>
    );
}

export default SubwaySearch;