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

const ImagePath = path.join(__dirname, "images");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/staticFolder/busImages", express.static(ImagePath));

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

/* 명칭별 정류소 목록 조회 */
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

app.get("/api/BusListSearch", (req, res) => {
  let excelFile;
  try {
    excelFile = xlsx.readFile(path.join(DATA_PATH, "BusIdInfo.xlsx"));
  } catch (exception) {
    res.json({ routeId: [], status: 404, searchStatus: false })
  }
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  res.json({ routeId: jsonData, status: 200, searchStatus: true })
});

app.get("/api/StationListSearch", (req, res) => {
  let excelFile;
  try {
    excelFile = xlsx.readFile(path.join(DATA_PATH, "StationList.xlsx"));
  } catch (exception) {
    res.json({ stationId: [], status: 404, searchStatus: false });
  }
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  res.json({ stationId: jsonData, status: 200, searchStatus: true });
});

app.get("/api/SubwayListSearch", (req, res) => {
  let excelFile;
  try {
    excelFile = xlsx.readFile(path.join(DATA_PATH, "SubwayInfoList.xlsx"));
  } catch (exception) {
    res.json({ subwayId: [], status: 404, searchStatus: false });
  }
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  res.json({ subwayId: jsonData, status: 200, searchStatus: true });
});

app.post("/api/getBusPosByRtidList", (req, res) => {
  const busRouteId = req.body.busRouteId;
  const url = 'http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);
  queryParams += '&' + encodeURIComponent('busRouteId') + '=' + encodeURIComponent(String(busRouteId));

  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err });
    else {
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ BusLocate: JSON.parse(xmltoJson), code: 200 });
      } catch (error) {
        res.json({ BusLocate: [], code: 400 })
      }
    }
  });
});

app.post("/api/AddLinePos", (req, res) => {
  const { x, y, line } = req.body;
  const sql = "INSERT INTO subwaypos (PosX, PosY, subwayLine) values (?, ?, ?)";

  maria.query(sql, [x, y, line], (err, rows, fields) => {
    if(err) return res.json({error: err});
    res.json({test: true});
  });
});

function getKeyIndex(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].subwayStation === obj.subwayStation) {
      return i;
    }
  }
  return -1;
}

app.get("/api/ReadLinePos", (req, res) => {
  const sql = "SELECT l.lineName, p.subwayStation, p.subwayCode, p.PosX, p.PosY from subwayline as l left join subwaypos as p on l.idx=p.subwayLine WHERE p.idx IS NOT null";
  maria.query(sql, (err, rows, fields) => {
    if(err) return res.json({error: err});
    if(rows.length === 0) return res.json({test: rows})
    let resultArr = [];
    for(var i in rows){
      let idx = getKeyIndex(resultArr, rows[i]);

      if (idx > -1) {
        resultArr[idx].lineName += "," + rows[i].lineName;
        resultArr[idx].subwayCode += "," + rows[i].subwayCode;
      } else {
        resultArr.push(rows[i]);
      }
    }
    for (var i in resultArr) {
      resultArr[i].lineName = String(resultArr[i].lineName).split(
        ","
      );
      resultArr[i].subwayCode = String(resultArr[i].subwayCode).split(
        ","
      );
    }
    res.json({test: resultArr});
  });
});

app.get("/api/readSubway", (req, res) => {
  const {name, id} = req.query;
  const data = [String(id).padStart(4, '0'), name]
  const sql = "SELECT l.lineName, p.subwayStation, p.subwayCode, p.PosX, p.PosY from subwayline as l left join subwaypos as p on l.idx=p.subwayLine WHERE subwayCode=? and subwayStation=?"

  maria.query(sql, data, (err, rows, fields) => {
    if(err) return res.json({status: 500, list: []})
    if(rows.length === 0) return res.json({status:200, list: []})
    return res.json({status:200, list:rows})
  });
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));