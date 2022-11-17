import axios from 'axios';
import React, { useRef, useState } from 'react'
import styled from 'styled-components';

const NaverBookSearch = () => {
    const [bookName, setBookName] = useState('');

    const [bookInfoList, setBookInfoList] = useState([]);
    const [searchState, setSearchState] = useState(false);
    const [apiState, setApiState] = useState(false);

    const inputRef = useRef();

    const tableHead = ["책제목", "발행처", "상세보기", "저자", "ISBN", "예상가", "설명"];

    const SearchInfo = (e) => {
        if (bookName !== "") {
            setBookInfoList([]);
            setSearchState(true);
            setApiState(true);
            axios.post("/api/NaverSearchList", { bookName: bookName })
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

    return (
        <>
            <div>
                네이버 ISBN 도서 검색
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
                                placeholder={"검색하실 네이버 ISBN 도서를 입력해주세요."}
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
                                            bookInfoList.items.length !== 0 ?
                                                bookInfoList.items.map((item, key) => (
                                                    <tr key={key}>
                                                        <td>{item.title}</td>
                                                        <td>{item.publisher}</td>
                                                        <td><button onClick={() => window.open(item.link, "_blank")}>네이버 도서</button></td>
                                                        <td>{item.author}</td>
                                                        <td>{item.isbn}</td>
                                                        <td>{item.discount}</td>
                                                        <td style={{width:"300px", height:"250px"}}>
                                                            <textarea
                                                                defaultValue={item.description}
                                                                maxLength={500}
                                                                readOnly
                                                                style={{width:"300px", height:"250px"}}
                                                            />
                                                        </td>
                                                    </tr>
                                                )) :
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

export default NaverBookSearch