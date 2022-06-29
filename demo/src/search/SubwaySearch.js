import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createFuzzyMatcher } from '../module/consonantSearch';

import SearchComponent from './ComponentSearch';
import axios from 'axios';

import "../css/Search.css";

const ImageZoomInOut = lazy(() => import('../module/ImageZoomInOut'));

const SubwaySearch = () => {
    const [subwayTitle, setSubwayTitle] = useState("");
    const [subways, setSubways] = useState(JSON.parse(localStorage.getItem('subways') || '[]'));
    const [searchSubwayList, setSearchSubwayList] = useState([]);
    const [subway, setSubway] = useState([]);
    const [data, setData] = useState([]);

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
                console.error(err);
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

    const subwayInfoFunc = (item) => {
        const newKeyword = {
            id: item.Id,
            Nm: item.Nm,
            "호선": item.Line
        };
        const distinctSubway = subways.filter((rmSubway) => {
            return rmSubway.id === item.Id;
        });
        if (distinctSubway.length === 0) setSubways([newKeyword, ...subways]);
        axios.get("/api/readSubway", { params: { name: item.Nm, id: item.Id }})
            .then((res) => {
                console.log(res.data.list)
            }).catch((err) => {
                console.log(err)
            });
    }

    return (
        <>
            <div className='map-search'>
                <Suspense fallback={<div>...loading</div>}>
                    <SearchComponent
                        SearchInfo={SearchInfo}
                        handleSearch={handleSearch}
                        buttonTitle={"전철역명"}
                        autoInfo={subways}
                        allRemoveStorage={allRemoveStorage}
                        singleRemoveStorage={singleRemoveStorage}
                        intervalInfo={subwayInfoFunc}
                        autoCompleteList={searchSubwayList}
                        searchTitle={subwayTitle}
                        searchIdType={"전철역코드"}
                    />
                    <ImageZoomInOut></ImageZoomInOut>
                </Suspense>
            </div>
        </>
    );
}

export default SubwaySearch;