import React, { useState, useEffect, useRef } from 'react';

const searchComponent = (props) => {
    const { SearchInfo, handleSearch, buttonTitle, autoInfo } = props;

    return (
        <div className='map-search-form'>
            <form onSubmit={SearchInfo}>
                <input type="text" name='stationName' onChange={handleSearch}></input>
                <button type="submit">BUS {buttonTitle} 조회</button>
            </form>
            {/* {
                autoInfo.length !== 0 ?
                    <ul className='map-search-auto-list'>
                        {
                            autoInfo.map((item, key) => (
                                <li key={key}>{item[buttonTitle]}</li>
                            ))
                        }
                    </ul> : ""
            } */}
        </div>
    );
};

export default searchComponent;