import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Test = () => {
  const [station, setStation] = useState('');
  const [searchTitle, setSerchTitle] = useState('검색요망');
  const [busStation, setBusStation] = useState([]);

  const clickBus = () => {
    axios.post("/api/BusApi")
      .then((res) => {
        let BusResult = res.data["bus"]["ServiceResult"]
        console.log(BusResult["msgBody"])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const clickBusStation = async (e) => {
    e.preventDefault();
    let BusList = []
    await axios.post("/api/BusStationApi", { station: station })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data["station"])
          let body = res.data["station"]["ServiceResult"]["msgBody"]
          if ("itemList" in body) {
            BusList.push(body.itemList)
            if (Array.isArray(BusList[0]))
              setBusStation(BusList[0]);
            else
              setBusStation(BusList);
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
    await axios.post("/api/BusStationList", {arsID:item.arsId["_text"]})
    .then((res) => {
      if(res.data.code === 200){
        console.log("StationList", res.data.stationList["ServiceResult"]["msgBody"])
      }
    });
    await axios.post("/api/ArriveBusList", {arsID:item.arsId["_text"]})
    .then((res) => {
      if(res.data.code === 200){
        console.log("arrive", res.data.arrive["ServiceResult"]["msgBody"])
      }
    });
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
              <table>
                <thead>
                  <tr>
                    <th>정류소 명</th>
                    <th>정류소 고유번호</th>
                    <th>정류소 좌표</th>
                    <th>정류소 좌표</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    busStation.map(item => (
                      <tr key={parseInt(item.stId["_text"])}>
                        <td>{item.stNm["_text"]}</td>
                        <td><button onClick={() => clickStationInfo(item)}>{item.arsId["_text"]}</button></td>
                        <td>{item.tmX["_text"]}</td>
                        <td>{item.tmY["_text"]}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              : <h5>{searchTitle}</h5>
          }
        </header>
      </div>
    </>
  );
}

export default Test;