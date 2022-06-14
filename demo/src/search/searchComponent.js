import React, { useState, useEffect, useRef } from 'react';

const searchComponent = (props) => {
    const { SearchInfo, handleSearch, buttonTitle, autoInfo, allRemoveStorage, singleRemoveStorage } = props;

    return (
        <div className='map-search-form'>
            <form onSubmit={SearchInfo}>
                <input type="text" name='stationName' onChange={handleSearch}></input>
                <button type="submit">BUS {buttonTitle} 조회</button>
            </form>
            <div>
                <span>최근 검색어 <i className='fa fa-close' onClick={() => allRemoveStorage("ff")}>전체삭제</i></span>
                <ul style={{listStyle: "none"}}>
                {
                    autoInfo.length !== 0 ? autoInfo.map((item, i) => (
                        <li key={i}>{String(item["Nm"])}<i className='fa fa-close' onClick={(e) => singleRemoveStorage(item["id"], e)}/></li>
                    )) : "검색결과가 존재하지 않습니다."
                }
                </ul>
            </div>
        </div>
    );
};

export default searchComponent;