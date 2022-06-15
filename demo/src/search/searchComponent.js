import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SearchComponent = (props) => {
    const { SearchInfo, handleSearch, buttonTitle, autoInfo, allRemoveStorage, singleRemoveStorage, intervalInfo, autoCompleteList, searchTitle } = props;

    useEffect(() => { }, [autoCompleteList])

    return (
        <div className='map-search-main'>
            <form onSubmit={SearchInfo}>
                <div className='map-search-form'>
                    <input type="text" name='stationName' onChange={handleSearch} autoComplete="off" placeholder={"검색하실 " + buttonTitle + "을 입력해주세요"}></input>
                    <button type="submit"><i className="fa fa-search" aria-hidden="true" /></button>
                    <div className='map-search-form-list'>
                        {
                            autoCompleteList.length !== 0 ?
                                <ul>{
                                    autoCompleteList.map((item, i) => (
                                        <li key={i}>
                                            {
                                                String(item[buttonTitle]).split(new RegExp("^" + `(${searchTitle})`, "gi")).map((part, i) =>
                                                    <span key={i} style={part.toLowerCase() === searchTitle.toLowerCase() ? { color: 'green' } : {}}>
                                                        {part}
                                                    </span>
                                                )
                                            }
                                        </li>
                                    ))
                                }
                            </ul> : ""
                        }
                    </div>
                </div>
            </form>
            <div>
                <span>최근 검색어 <i className='fa fa-close' onClick={() => allRemoveStorage("ff")}>전체삭제</i></span>
                <ul style={{ listStyle: "none" }}>
                    {
                        autoInfo.length !== 0 ? autoInfo.map((item, i) => (
                            <li key={i}><span onClick={() => intervalInfo(item.Nm, item.id)}>{String(item.Nm)}</span><i className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)} /></li>
                        )) : "검색결과가 존재하지 않습니다."
                    }
                </ul>
            </div>
        </div>
    );
};

export default SearchComponent;