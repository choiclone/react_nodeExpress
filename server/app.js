const express = require("express");
const bodyParser = require("body-parser");
const maria = require("./DB/database");
const bcrypt = require("bcrypt");
const request = require("request");
const xlsx = require("xlsx");
const convert = require('xml-js');
const jwt = require("jsonwebtoken");
const app = express();

const path = require("path");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* 24개월(2년) 마다 현재 할당 받은 key 값은 사라지니 다시 받거나 기간 연장이 필요함
https://www.data.go.kr/index.do
여기서 로그인 하고 자신이 사용하고 있는 api 중에서 연장하거나 취소할 거 누르면 됨*/
const dataApiKey = '1tTp/cC+ot3y4T1GDzqOKLS6171dZSkuH70eiqtN5Qt9SWDQkV2QTvPrttM1+neB9kCsSBS5FSOYR6OQ8InPUg==';

const DATA_PATH = path.join(__dirname, "../demo/src/data");

/* 해당 정류소에 경유하는 노선 목록 조회 */
app.post("/api/BusStationList", (req, res) => {
  let arsID = req.body.arsID;
  const url = "http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation";
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('arsId') + '=' + encodeURIComponent(String(arsID));
  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ stationList: JSON.parse(xmltoJson), code: 200 });
      } catch (error) {
        res.json({ stationList: [], code: 400 })
      }
    }
  });
});

/* 도착하는 버스 목록 */
app.post("/api/ArriveBusList", (req, res) => {
  let arsID = req.body.arsID;
  const url = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid";
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('arsId') + '=' + encodeURIComponent(String(arsID));
  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ arrive: JSON.parse(xmltoJson), code: 200 });
      } catch (error) {
        res.json({ arrive: [], code: 400 })
      }
    }
  });
});

/* 버스 정보 목록 */
app.post("/api/BusApi", (req, res) => {
  // const url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll';
  const url = 'http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  // queryParams += '&' + encodeURIComponent('busRouteId') + '=' + encodeURIComponent('100100016');
  queryParams += '&' + encodeURIComponent('stId') + '=' + encodeURIComponent('107000070');
  /* 08160 */

  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
      res.json({ bus: JSON.parse(xmltoJson) });
    }
  });
});

/* 요청한 정류장 명과 가까운 정류장 명들의 목록을 반환 */
app.post("/api/BusStationApi", (req, res) => {
  const station = req.body.station;
  const url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('stSrch') + '=' + encodeURIComponent(String(station));
  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      if (station !== '') {
        try {
          let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
          res.json({ station: JSON.parse(xmltoJson), code: 200 });
        } catch (error) {
        }
      } else {
        res.json({ station: [], code: 400 })
      }
    }
  });
});

/* 요청한 정류장 명과 가까운 정류장 명들의 목록을 반환 */
app.post("/api/ArrInfoByRouteList", (req, res) => {
  const busRouteId = req.body.busRouteId;
  const url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('busRouteId') + '=' + encodeURIComponent(String(busRouteId));
  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ allRoute: JSON.parse(xmltoJson), code: 200 });
      } catch (error) {
        res.json({ allRoute: [], code: 400 })
      }
    }
  });
});

app.post("/api/BusListSearch", (req, res) => {
  const BusName = req.body.BusName;
  const excelFile = xlsx.readFile(path.join(DATA_PATH, "BusIdInfo.xlsx"));
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  let routeId = [];

  if(BusName !== '') {
    let index = jsonData.map((bus, idx) => String(bus["노선명"]).includes(String(BusName)) ? idx: '').filter(String);
    try {
      index.map((idx) => {
        routeId.push(jsonData[idx])
      })
      res.json({ routeId: routeId, status: 200 })
    } catch (error) {
      res.json({ routeId: [], status: 404 })
    }
  }else{
    res.json({ routeId: [], status: 404 })
  }
})

app.post("/api/getBusPosByRtidList", (req, res) => {
  const busRouteId = req.body.busRouteId;
  const url = 'http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('busRouteId') + '=' + encodeURIComponent(String(busRouteId));

  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ BusLocate: JSON.parse(xmltoJson), code: 200 });
      } catch (error) {
        res.json({ BusLocate: [], code: 400 })
      }
    }
  });
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));