/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import KakaoMapScript from '../script/KakaoMapScript';
import axios from 'axios';

const StationListF = () => {
  const [station, setStation] = useState('');
  const [busName, setBusName] = useState('');
  const [searchTitle, setSerchTitle] = useState('검색요망');
  const [busStation, setBusStation] = useState([]);
  const [busRouteId, setBusRouteId] = useState([]);
  const [busRoute, setBusRoute] = useState([]);
  const [busLocate, setBusLocate] = useState([]);
  const [searchStationList, setsearchStationList] = useState([]);

  const IntervalRef = useRef();

  const clickBus = async (e) => {
    e.preventDefault();
    await axios.post("/api/BusListSearch", { BusName: busName })
      .then((res) => {
        if (res.data.status === 200) {
          setBusRouteId(res.data.routeId)
        } else setBusRouteId(res.data.routeId)
      })
      .catch((err) => {
        setBusRouteId('')
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

  const handleBus = (e) => {
    setBusRoute([]);
    setBusRouteId([]);
    clearInterval(IntervalRef.current)
    setBusName(e.target.value);
  }

  const BusRouteStatusList = (routeId) => {
    let BusList = [];
    axios.post("/api/ArrInfoByRouteList", { busRouteId: routeId })
      .then((res) => {
        if (res.data.code === 200) {
          BusList.push(res.data.allRoute["ServiceResult"]["msgBody"]["itemList"]);
          if (Array.isArray(BusList[0])) setBusRoute(BusList[0]);
          else setBusRoute(BusList);
        }
      }).catch((err) => {
        console.log(err)
      })
  }

  const getBusPosByRtidList = (routeId) => {
    let BusList = [];
    axios.post("/api/getBusPosByRtidList", { busRouteId: routeId })
      .then((res) => {
        if (res.data.code === 200) {
          BusList.push(res.data.BusLocate["ServiceResult"]["msgBody"]["itemList"]);
          console.log(BusList)
          if (Array.isArray(BusList[0])) setBusLocate(BusList[0]);
          else setBusLocate(BusList);
        }
      }).catch((err) => {
        console.log(err)
      })
  }

  const IntervalStationList = (routeId) => {
    // console.log(routeId)
    BusRouteStatusList(routeId)
    // getBusPosByRtidList(routeId)
    IntervalRef.current = setInterval(async () => {
      await BusRouteStatusList(routeId)
      console.log("dddd")
    }, 3000)
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <form onSubmit={clickBusStation}>
            <input type="text" name='stationName' onChange={handleStation}></input>
            <button type="submit">BUS 정류장 조회</button>
          </form>
          <form onSubmit={clickBus}>
            <input type="text" name='busName' onChange={handleBus}></input>
            <button type="submit">Bus 조회</button>
          </form>
          {busRouteId.length !== 0 ?
            <div>
              {
                busRouteId.map((item, key) => (
                  <ul key={key}>
                    <li><button onClick={() => IntervalStationList(item["ROUTE_ID"])}>{item["노선명"]}</button></li>
                  </ul>
                ))
              }
            </div> : <h4>입력좀 ㄹㄹㄹ</h4>
          }
          {busRoute.length !== 0 ?
            <div>
              {
                busRoute.map((route, key) => (
                  <p key={key}>{route.stNm["_text"] + "/" + route.arrmsg1["_text"] + "/" + route.arrmsg2["_text"]}</p>
                ))
              }
            </div> : <h4>아직 없다 ㄹㄹㄹ</h4>
          }
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