// BusStationSearch.js ----------------------------------------------------------------------
        /* 서울 공공 데이터에서 api로 정류장을 불러올 경우
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
                            setSearchStationList(stationArray)
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
                            setSearchStationList(stationArray)
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
                console.error(err)
            })*/
// ---------------------------------------------------------------------- BusStationSearch.js 