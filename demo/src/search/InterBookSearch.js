import axios from 'axios';
import React, { useRef, useState } from 'react'
import styled from 'styled-components';

const ISBNBookSearch = () => {
    const [bookName, setBookName] = useState('');
    const [b, setB] = useState("Y");

    const [bookInfoList, setBookInfoList] = useState([]);
    const [searchState, setSearchState] = useState(false);
    const [apiState, setApiState] = useState(false);

    const inputRef = useRef();

    const tableHead = ["책제목", "발행처", "상세보기", "저자", "ISBN", "예상가"];

    const SearchInfo = (e) => {
        if (bookName !== "") {
            setBookInfoList([]);
            setSearchState(true);
            setApiState(true);
            axios.post("/api/InterSearchList", { bookName: bookName, bookSearchType: b })
                .then((res) => {
                    if (res.data.status === 200) {
                        setSearchState(false);
                        console.log(res.data.bookInfo)
                        setBookInfoList(res.data.bookInfo);
                        setApiState(false);
                    }
                }).catch((err) => {
                    setSearchState(false);
                    setBookInfoList([]);
                    setApiState(false);
                    console.log(err)
                });
        } else {
            setSearchState(false);
            setApiState(false);
        }
        e.preventDefault();
    }

    const handleSearch = (e) => {
        const stationName = String(e.target.value);
        setBookName(stationName);
        if (stationName === "") {
            setSearchState(false);
            setBookInfoList([]);
            return;
        }
    }

    const handleSearchType = (e) => {
        setB(e.target.value);
    }

    return (
        <>
            <div>
                인터파크 ISBN 도서 검색
            </div>
            <div className='map-search'>
                <div className='map-search-main'>
                    <form onSubmit={SearchInfo}>
                        <div id="map-search-form" className='map-search-form'>
                            <input
                                type="text"
                                name='stationName'
                                value={bookName}
                                onChange={handleSearch}
                                ref={inputRef}
                                autoComplete="off"
                                placeholder={"검색하실 ISBN 도서를 입력해주세요."}
                            />
                            <button type="submit" disabled={apiState}><i className="fa fa-search" aria-hidden="true" /></button>
                        </div>
                    </form>
                </div>
                <div>
                    {
                        bookInfoList.length !== 0 && bookName !== "" ?
                            <div>
                                <Tables>
                                    <Thead>
                                        <tr>
                                            {tableHead.map((item, key) => (
                                                <th key={key}>{item}</th>
                                            ))}
                                        </tr>
                                    </Thead>
                                    <TBody>
                                        {
                                            bookInfoList["item"].length !== 0 ?
                                                bookInfoList["item"].map((item, key) => (
                                                    <tr key={key}>
                                                        <td>{item.title}</td>
                                                        <td>{item.publisher}</td>
                                                        <td><button onClick={() => window.open(item.link, "_blank")}>인터파크몰 도서</button></td>
                                                        <td>{item.author}</td>
                                                        <td>{bookInfoList.query}</td>
                                                        <td>{item["priceStandard"]}</td>
                                                    </tr>
                                                )): 
                                            <tr>
                                                <td colSpan={7}>검색한 결과가 존재하지 않습니다.</td>    
                                            </tr>
                                        }
                                    </TBody>
                                </Tables>
                            </div>
                            : ""
                    }
                    {searchState === true ? <div>Loading...</div> : ""}
                </div>
            </div>
        </>
    )
}

const Tables = styled.table`
    position: relative;
    display: inline-block;
    background: #ffffff;
    border: 1px solid;
    color: black;
`

const Thead = styled.thead`
    background: skyblue;
`
const TBody = styled.tbody`
    font-size: 22px;
`

export default ISBNBookSearch