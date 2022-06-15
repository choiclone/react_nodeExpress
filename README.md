# react_nodeExpress
<h3>버스 및 지하철 시간 조회</h3>
  <h5>Client[reactJs] + Server[NodeExpress] + DB[mariaDB] + OpenAPI [<a href="https://www.data.go.kr/">서울 공공 데이터</a>]</h5>
  <div>
    <a href="https://www.logoyogo.com/downloads/%eb%b2%84%ec%8a%a4-%ec%8a%a4%eb%a7%88%ec%9d%bc-%eb%a1%9c%ea%b3%a0-%ec%95%84%ec%9d%b4%ec%bd%98-%ec%9d%bc%eb%9f%ac%ec%8a%a4%ed%8a%b8-ai-%eb%8b%a4%ec%9a%b4%eb%a1%9c%eb%93%9c/">버스 일러스트 이미지 출처</a>
    <br>
    Start Project => 2022/05/20 ~ <br>
    <br>
    2022/05/30 => 실시간 버스 도착 정보 구현함<br>
    2022/06/08 => 실시간 버스 위치 추가함<br>
    2022/06/09 => 각 정류소 별 실시간 버스 위치 구현 및 도착 버스 정보 수정/추가 함<br>
    2022/06/13 => 버스/정류장 검색창 자동완성 구현<br>
    2022/06/14 => 검색 자동완성 수정 및 검색 하이라이팅 기능 구현<br>
               => 최근 검색어 기능 추가(localstorage에 저장함)<br>
    <br>
    Docker 실행 <br>
      * docker build -t bus_api . <br>
      * docker run -i -t -d --name testnode5 --rm -p 6000:3000 bus_api <br>
      * docker exec -it testnode5 /bin/bash <br>
      * cd server && yarn start
  </div>
<br>
<h5>제작자 정보</h5> 
<br>
<img src="https://img.shields.io/badge/JavaScript-FFCA28?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/React-informational?style=for-the-badge&logo=React&logoColor=black"/>
<img src="https://img.shields.io/badge/NodeExpress-green?style=for-the-badge&logo=../demo/src/images/nodedotjs.svg&logoColor=black"/>
