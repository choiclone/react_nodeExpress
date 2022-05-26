import React, { useState, useEffect, useRef } from 'react';
import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const StationListF = () => {
  const [station, setStation] = useState('');
  const [searchStation, setSearchStation] = useState('');
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
                stationArray.push({x: item.tmX["_text"], y: item.tmY["_text"]})
              })
              setsearchStationList(stationArray)
            } else {
              setBusStation(BusList);
              BusList[0].map((item) => {
                stationArray.push({x: item.tmX["_text"], y: item.tmY["_text"]})
              })
              setsearchStationList(stationArray)
            }
          } else {
            setSerchTitle("검색하신 결과가 존재하지 않습니다.");
            setBusStation([]);
          }
        } else {
          setSerchTitle("API 문제 발생 문의 해주시기 바랍니다.");
          console.log("400");
        }
      })
      .catch((err) => {
        setStation('');
        console.log(err)
      })
  }

  const clickStationInfo = async (item) => {
    await axios.post("/api/BusStationList", { arsID: item.arsId["_text"] })
      .then((res) => {
        if (res.data.code === 200) {
          console.log("StationList", res.data.stationList["ServiceResult"]["msgBody"])
        }
      });
    await axios.post("/api/ArriveBusList", { arsID: item.arsId["_text"] })
      .then((res) => {
        if (res.data.code === 200) {
          console.log("arrive", res.data.arrive["ServiceResult"]["msgBody"])
        }
      });
  }

  const clickPosInfo = async (position) => {
    console.log(position)
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
              <div>
                <div><KakaoMapScript searchPlace={searchStationList} /></div>
                <table>
                  <thead>
                    <tr>
                      <th>정류소 명</th>
                      <th>정류소 고유번호</th>
                      <th>정류소 위도, 경도</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      busStation.map(item => (
                        <tr key={parseInt(item.stId["_text"])}>
                          <td>{item.stNm["_text"]}</td>
                          <td><button onClick={() => clickStationInfo(item)}>{item.arsId["_text"]}</button></td>
                          <td>
                            <button onClick={() => clickPosInfo(item.tmY["_text"] + ", " + item.tmX["_text"])}>
                              지도로 이동
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              : <h5>{searchTitle}</h5>
          }
        </header>
      </div>
    </>
  );
}

export default StationListF;