import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const SearchComponent = (props) => {
    const { SearchInfo, handleSearch, buttonTitle, autoInfo, allRemoveStorage, singleRemoveStorage, intervalInfo, autoCompleteList, searchTitle, searchIdType } = props;
    const [autoList, setAutoList] = useState(autoCompleteList);
    const [focusState, setFocusState] = useState(false);

    const inputRef = useRef();

    document.addEventListener("mousedown", (e) => {
        const container = document.getElementById("map-search-form");
        if (!container.contains(e.target)) {
            const formList = document.getElementById("map-search-form-list");
            const recentList = document.getElementById("map-search-recent-list");
            formList.style.display = "none";
            recentList.style.display = "block";
        }
    });

    useEffect(() => {
        setAutoList(autoCompleteList)
    }, [autoList]);

    const FocusSearchInput = () => {
        const formList = document.getElementById("map-search-form-list");
        const recentList = document.getElementById("map-search-recent-list");
        formList.style.display = "block";
        recentList.style.display = "none";
        setFocusState(true);
    }

    const ClickInterval = (Nm, Id) => {
        const formList = document.getElementById("map-search-form-list");
        const recentList = document.getElementById("map-search-recent-list");
        recentList.style.display = "block";
        formList.style.display = "none";
        setFocusState(false);
        intervalInfo(Nm, Id);
    }

    return (
        <div className='map-search-main'>
            <form onSubmit={SearchInfo}>
                <div id="map-search-form" className='map-search-form'>
                    <input type="text" name='stationName' onFocus={() => FocusSearchInput()}
                        onChange={handleSearch} ref={inputRef} autoComplete="off" placeholder={"검색하실 " + buttonTitle + "을 입력해주세요"}></input>
                    <button type="submit"><i className="fa fa-search" aria-hidden="true" /></button>
                    {autoCompleteList.length !== 0 ?
                        <div id="map-search-form-list" className='map-search-form-list'>
                            <ul>
                                {
                                    autoInfo.length !== 0 ?
                                        autoInfo.map((item, i) => (
                                            <SearchList key={i} className={new RegExp("^" + `(${searchTitle})`, "i").test(String(item.Nm)) ? "activate" : "deactivate"}>
                                                <TimerIcon className='fa fa-clock-o' />
                                                <span onClick={() => ClickInterval(item.Nm, item.id)}>
                                                    {String(item.Nm).split(new RegExp("^" + `(${searchTitle})`, "i")).map((part, i) =>
                                                        <span key={i} style={part.toLowerCase() === searchTitle.toLowerCase() ? { color: 'green', fontWeight: 'bold' } : {}}>
                                                            {part}
                                                        </span>
                                                    )}
                                                    {buttonTitle === "정류장" ? <SpansArs>{"  "+String(item.id)}</SpansArs> : ""}
                                                </span>
                                                <CloseListIcon className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} />
                                            </SearchList>
                                        )) : <CurrentEmptyList>최근 검색결과가 존재하지 않습니다.</CurrentEmptyList>
                                }
                                {
                                    autoCompleteList.map((item, i) => (
                                        <SearchList key={i} onClick={() => ClickInterval(item[buttonTitle], item[searchIdType])}>
                                            <SearchIcon className='fa fa-search' />
                                            {
                                                String(item[buttonTitle]).split(new RegExp("^" + `(${searchTitle})`, "i")).map((part, i) =>
                                                    <span key={i} style={part.toLowerCase() === searchTitle.toLowerCase() ? { color: 'green', fontWeight: 'bold' } : {}}>
                                                        {part}
                                                    </span>
                                                )
                                            }
                                            {buttonTitle === "정류장" ? <SpansArs>{"  "+String(item[searchIdType])+"/"+String(item["구간명"])+" 방면"}</SpansArs> : ""}
                                        </SearchList>
                                    ))
                                }
                            </ul>
                        </div> :
                        <div id="map-search-form-list" className={focusState ? "map-search-form-list activate" : "map-search-form-list deactivate"} onClick={() => { inputRef.current.focus() }}>
                            <ul>
                                <SearchList>
                                    <span>최근 검색어</span>
                                    <Spans onClick={() => allRemoveStorage()}>전체삭제</Spans>
                                </SearchList>
                                {
                                    autoInfo.length !== 0 ?
                                        autoInfo.slice(0, 10).map((item, i) => (
                                            <SearchList key={i}>
                                                <TimerIcon className='fa fa-clock-o' />
                                                <span onClick={() => ClickInterval(item.Nm, item.id)}>{String(item.Nm)}
                                                    {buttonTitle === "정류장" ? <SpansArs>{"  "+String(item.id)}</SpansArs> : ""}
                                                </span>
                                                <CloseListIcon className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} />
                                            </SearchList>
                                        )) : <CurrentEmptyList>최근 검색결과가 존재하지 않습니다.</CurrentEmptyList>
                                }
                            </ul>
                        </div>
                    }
                </div>
            </form>
            <div>
                <ul id='map-search-recent-list' style={{ listStyle: "none" }}>
                    {
                        autoInfo.length !== 0 ? autoInfo.map((item, i) => (
                            <li key={i}>
                                <span onClick={() => intervalInfo(item.Nm, item.id)}>{String(item.Nm)}{buttonTitle === "정류장" ? <SpansArs>{"  "+String(item.id)}</SpansArs> : ""}</span>
                                <i className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} />
                            </li>
                        )) : <li>최근 검색결과가 존재하지 않습니다.</li>
                    }
                </ul>
            </div>
        </div>
    );
};

const SearchIcon = styled.i`
    padding: 0px 3px 0px 0px;
    font-size: 13px;
`;

const TimerIcon = styled.i`
    padding: 0px 3px 0px 0px;
    font-size: 13px;
`;

const CloseListIcon = styled.i`
    font-size: 20px;
    float: right
`;

const CurrentEmptyList = styled.li`
    text-align: center;
    list-style: none;
    font-size: 15px;
    color: black;
    padding: 5px 0px 5px 10px;
`;

const SearchList = styled.li`
    list-style: none;
    font-size: 15px;
    text-align: left;
    color: black;
    padding: 5px 0px 5px 10px;
`;

const Spans = styled.span`
    float: right;
`;

const SpansArs = styled.span`
    display: inline-flex;
    font-weight: bold;
    font-size: 12px;
`;

const SpansRou = styled.span`
    display: none;
    font-weight: bold;
    font-size: 12px;
`;

export default SearchComponent;