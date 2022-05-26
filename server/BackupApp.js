const express = require("express");
const bodyParser = require("body-parser");
const maria = require("./DB/database");
const bcrypt = require("bcrypt");
const request = require("request");
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const SECRET_KEY = "MY-SECRET-KEY";

app.post("/api/test1", (req, res) => {
  let pw = "1234red#";
  maria.query("select * from Users where id=?", ["hyunclone@first2000.co.kr"], (err, rows, fields) => {
    if (err) return res.json({ error: err });
    if (rows.length === 0) return res.json({ error: err });
    else {
      const resultUser = bcrypt.compare(pw, rows[0].password);
      if (resultUser) {
        const token = jwt.sign(
          {
            type: "JWT",
            id: rows[0].id,
            isAdmin: rows[0].idx,
          },
          SECRET_KEY,
          { expiresIn: "10m", issuer: "token" }
        );
        maria.query(
          "UPDATE users SET token=? where id=?",
          [token, rows[0].id],
          async (err, dds, fields) => {
            maria.query(
              "SELECT * FROM Users WHERE id = ? ",
              rows[0].id,
              async function (err, rows, fields) {
                res.json({
                  code: 200,
                  message: "Token Success",
                  UserInfo: rows[0],
                });
              }
            );
          }
        );
      }
    }
  })
});

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
        res.json({ stationList: JSON.parse(xmltoJson), code:200 });
      } catch (error) {
        res.json({ stationList: [], code: 400})
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
        res.json({ arrive: JSON.parse(xmltoJson), code:200 });
      } catch (error) {
        res.json({ arrive: [], code: 400})
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
      try {
        let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
        res.json({ station: JSON.parse(xmltoJson), code:200 });
      } catch (error) {
        res.json({ station: [], code: 400})
      }
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));