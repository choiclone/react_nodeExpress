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

const dataApiKey = '1tTp/cC+ot3y4T1GDzqOKLS6171dZSkuH70eiqtN5Qt9SWDQkV2QTvPrttM1+neB9kCsSBS5FSOYR6OQ8InPUg==';
let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(dataApiKey);

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

app.post("/api/test2", (req, res) => {
  /* 도착정보조회 서비스 [정류소별 도착 예정정보 목록 조회] */
  const url1 = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList';
  /* 도착정보조회 서비스 [정류소별 특정 노선보스 도착 예정 벙보 목록 조회] */
  const url2 = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoSpcifyRouteBusArvlPrearngeInfoList';
  /* 도착정보조회 서비스 [도시코드 목록 조회] */
  const url3 = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getCtyCodeList';

  // queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  // queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
  queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /* */
  // queryParams += '&' + encodeURIComponent('cityCode') + '=' + encodeURIComponent('25'); /* */
  // queryParams += '&' + encodeURIComponent('nodeId') + '=' + encodeURIComponent('DJB8001793'); /* */
  let bodys = '';
  request({
    url: url3 + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    res.json({ end: JSON.parse(body) })
  });
});

app.post("/api/BusApi", (req, res) => {
  // const url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll';
  const url = 'http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId';
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

app.post("/api/BusStationApi", (req, res) => {
  const url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName';
  queryParams += '&' + encodeURIComponent('stSrch') + '=' + encodeURIComponent('화곡역'); /* */

  request({
    url: url + queryParams,
    method: 'GET'
  }, (err, response, body) => {
    if (err) return res.json({ error: err })
    else {

      let xmltoJson = convert.xml2json(body, { compact: true, spaces: 4 });
      res.json({ station: JSON.parse(xmltoJson) });
    }
  });
});

app.post("/api/test3", (req, res) => {
  let pw = bcrypt.hashSync("1234red%", 10);
  maria.query("update users set password=? where idx=5", [pw], (err, rows, fields) => {
    res.json({ test: err });
  })
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
