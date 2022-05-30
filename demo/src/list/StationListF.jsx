/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const StationListF = () => {
  const [station, setStation] = useState('');
  const [searchTitle, setSerchTitle] = useState('검색요망');
  const [busStation, setBusStation] = useState([]);
  const [searchStationList, setsearchStationList] = useState([]);

  const clickBus = () => {
    axios.post("/api/BusApi")
      .then((res) => {
        let BusResult = res.data["bus"]["ServiceResult"]
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickBusStation = async (e) => {
    e.preventDefault();
    let BusList = [];
    let stationArray = [];
    await axios.post("/api/BusStationApi", { station: station })
      .then((res) => {
        if (res.data.code === 200) {
          let body = res.data["station"]["ServiceResult"]["msgBody"]
          if ("itemList" in body) {
            BusList.push(body.itemList)
            if (Array.isArray(BusList[0])) {
              setBusStation(BusList[0]);
              BusList[0].map((item) => {
                stationArray.push({
                  x: item.tmX["_text"],
                  y: item.tmY["_text"],
                  stationName: item.stNm["_text"],
                  arsId: item.arsId["_text"]
                })
              })
              setsearchStationList(stationArray)
            } else {
              setBusStation(BusList);
              BusList.map((item) => {
                stationArray.push({
                  x: item.tmX["_text"],
                  y: item.tmY["_text"],
                  stationName: item.stNm["_text"],
                  arsId: item.arsId["_text"]
                })
              })
              setsearchStationList(stationArray)
            }
          } else {
            setSerchTitle("검색하신 결과가 존재하지 않습니다.");
            setBusStation([]);
          }
        } else {
          setSerchTitle("검색명 입력하라고 아 ㅋㅋㅋ");
          console.log("400");
        }
      })
      .catch((err) => {
        setSerchTitle("서버가 돌아가셨습니다. ㅈㅅ");
        setStation('');
        console.log(err)
      })
  }

  const handleStation = (e) => {
    setStation(e.target.value);
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <form onSubmit={clickBusStation}>
            <input type="text" name='stationName' onChange={handleStation}></input>
            <button type="submit">BUS 정류장 조회</button>
          </form>
          <button type="button" onClick={clickBus}>Bus 조회</button>
          {
            busStation.length !== 0 ?
              <div style={{ width: "50%" }}>
                <div className="map_wrap">
                  <KakaoMapScript searchPlace={searchStationList} />
                </div>
              </div>
              : <h5>{searchTitle}</h5>
          }
        </header>
      </div>
    </>
  );
}

export default StationListF;