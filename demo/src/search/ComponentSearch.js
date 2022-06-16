import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SearchComponent = (props) => {
    const { SearchInfo, handleSearch, buttonTitle, autoInfo, singleRemoveStorage, intervalInfo, autoCompleteList, searchTitle, searchIdType } = props;
    const [autoList, setAutoList] = useState(autoCompleteList)

    useEffect(() => {
        setAutoList(autoCompleteList)
     }, [autoList])

    return (
        <div className='map-search-main'>
            <form onSubmit={SearchInfo}>
                <div className='map-search-form'>
                    <input type="text" name='stationName' onChange={handleSearch} autoComplete="off" placeholder={"검색하실 " + buttonTitle + "을 입력해주세요"}></input>
                    <button type="submit"><i className="fa fa-search" aria-hidden="true" /></button>
                    {autoCompleteList.length !== 0 ?
                        <div className='map-search-form-list'>
                            <ul>
                                {
                                    autoInfo.length !== 0 ? autoInfo.map((item, i) => (
                                        <li key={i}>
                                            <TimerIcon className='fa fa-clock-o' />
                                            <span onClick={() => intervalInfo(item.Nm, item.id)}>
                                                {
                                                    String(item.Nm).split(new RegExp("^" + `(${searchTitle})`, "gi")).map((part, i) =>
                                                    <span key={i} style={part.toLowerCase() === searchTitle.toLowerCase() ? { color: 'green', fontWeight: 'bold' } : {}}>
                                                        {part}
                                                    </span>
                                                )
                                                }
                                            </span>
                                            <CloseListIcon className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} />
                                        </li>
                                    )) : <CurrentEmptyList>최근 검색결과가 존재하지 않습니다.</CurrentEmptyList>
                                }
                                {
                                    autoCompleteList.map((item, i) => (
                                        <li key={i} onClick={() => intervalInfo(item[buttonTitle], item[searchIdType])}>
                                            <SearchIcon className='fa fa-search' />
                                            {
                                                String(item[buttonTitle]).split(new RegExp("^" + `(${searchTitle})`, "gi")).map((part, i) =>
                                                    <span key={i} style={part.toLowerCase() === searchTitle.toLowerCase() ? { color: 'green', fontWeight: 'bold' } : {}}>
                                                        {part}
                                                    </span>
                                                )
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div> : ""
                    }
                </div>
            </form>
            <div>
                <ul style={{ listStyle: "none" }}>
                    {
                        autoInfo.length !== 0 ? autoInfo.map((item, i) => (
                            <li key={i}>
                                <span onClick={() => intervalInfo(item.Nm, item.id)}>{String(item.Nm)}</span>
                                <CloseIcon className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} />
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

const CloseIcon = styled.i`
    font-size: 20px;
`;

const CurrentEmptyList = styled.li`
    text-align: center;
`;

export default SearchComponent;