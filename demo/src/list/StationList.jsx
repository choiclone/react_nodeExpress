import React, { Component } from "react";
import axios from 'axios';

class StationList extends Component { /* 클래스형으로 제작함 추후에 함수형으로 변경해서 할거라 걱정 ㄴㄴ */
  constructor(props, context) {
    super(props, context);
    this.state = {
      stationName: "",
      searchTitle: "찾으실 정류소명을 입력해주세요~",
      busStation: []
    };
    this.clickBus = this.clickBus.bind(this);
    this.clickBusStation = this.clickBusStation.bind(this);
    this.clickStationInfo = this.clickStationInfo.bind(this);
  }

  clickBus = () => {
    axios.post("/api/BusApi")
      .then((res) => {
        let BusResult = res.data["bus"]["ServiceResult"]
        console.log(BusResult)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  clickBusStation = async (stationName, e) => {
    await axios.post("/api/BusStationApi", { station: stationName })
      .then((res) => {
        if (res.data.code === 200) {
          let body = res.data["station"]["ServiceResult"]["msgBody"]
          if("itemList" in body){
            this.setState({
              busStation: body.itemList
            })
          }else{
            this.setState({
              searchTitle: "검색하신 정류소가 존재하지 않습니다. 다시 검색좀 ㅎㅎ",
              busStation: []
            })
          }
        } else {
          this.setState({
            searchTitle: "정류소 명 입력 후 검색좀 ㅎㅎ",
            busStation: []
          })
        }
      })
      .catch((err) => {
        this.setState({ stationName: "" })
        console.log(err)
      })
  }

  clickStationInfo = (item) => {
    console.log(item)
  }

  handleStation = (e) => {
    this.setState({
      stationName: e.target.value
    });
  }
  
  render() {
    let list;
    try {
      list = this.state.busStation.map((item) => (
        <tr key={parseInt(item.stId["_text"])}>
          <td onClick={this.clickStationInfo.bind(this, item)}>{item.stNm["_text"]}</td>
          <td>{item.arsId["_text"]}</td>
          <td>{item.tmX["_text"]}</td>
          <td>{item.tmY["_text"]}</td>
        </tr>
      ));
    } catch (error) {
      const bustStation = this.state.busStation;
      list = (
        <tr key={parseInt(bustStation.stId["_text"])}>
          <td onClick={this.clickStationInfo.bind(this, bustStation)}>{bustStation.stNm["_text"]}</td>
          <td>{bustStation.arsId["_text"]}</td>
          <td>{bustStation.tmX["_text"]}</td>
          <td>{bustStation.tmY["_text"]}</td>
        </tr>
      )
    }
    return (
      <>
        <section className="content make_ai">
          <h1 className="title">버스 정류소 검색</h1>
          <input type="text" name='stationName' value={this.state.stationName} onChange={this.handleStation}></input>
          <button type="button" onClick={this.clickBusStation.bind(this, this.state.stationName)}>Bus Station 조회</button>
          <button type="button" onClick={this.clickBus.bind(this)}>Bus 조회</button>
          {
            this.state.busStation.length !== 0?
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
                  {list}
                </tbody>
              </table> : <h3>{this.state.searchTitle}</h3>
          }

        </section>
      </>
    );
  }
}

export default StationList;