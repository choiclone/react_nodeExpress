/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const KakaoMapScript = ({ searchTitle, arsID, stationList }) => {
    const [address, setAddress] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false); 
    const [places, setPlaces] = useState([]);

    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }
    const mapRef = useRef();
    const markerRef = useRef();
    const infowindowRef = useRef();

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.555167, 126.970833),
            level: 9,
        };

        mapRef.current = new kakao.maps.Map(container, options);
        const map = mapRef.current;
        const geocoder = new kakao.maps.services.Geocoder();
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC); 

        // 카테고리로 주변건물 등 검색
        ps.categorySearch("FD6", callbackFunc);
        
        function callbackFunc (result, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                console.log("검색된 음식점의 갯수는 " +  result.length + "개 입니다.");
            }
        };

        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        
            // let addressName = place.upperAddrName+" "+place.middleAddrName+" "+place.roadName+" "+place.buildingNo1;
            // if(place.buildingNo2 !== "" && place.buildingNo2 !== "0") addressName = addressName+"-"+place.buildingNo2;
            // let content = '<div class="placeinfo">' +
            //                 '<a class="title" href="' + 'https://map.kakao.com/?q=' + addressName + '" target="_blank" title="' + place.name + '">' + place.name + '</a>';   
            // if(place.road_address_name) {
            //     content += '<span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
            //                 '<span class="jibun" title="' + addressName + '">(지번 : ' + addressName + ')</span>';
            // }else {
            //     content += '<span title="' + addressName + '">' + addressName + '</span>';
            // }                
            // content +=  '</div>' + 
            //             '<div class="after"></div>';
        
            // contentNode.innerHTML = content;
            // placeOverlay.setPosition(new kakao.maps.LatLng(place.noorLat, place.noorLon));
            // placeOverlay.setMap(map);  

        function displayMarker(place) {
            const name = String(place["stNm"]["_text"]);
            const id = String(place["arsId"]["_text"]);
            const x = place["gpsX"]["_text"];
            const y = place["gpsY"]["_text"];
            // 마커를 생성하고 지도에 표시
            markerRef.current = new kakao.maps.Marker({
                map: map,
                clickable: true,
                position: new kakao.maps.LatLng(y, x)
            });
            let marker = markerRef.current;
            kakao.maps.event.addListener(marker, 'click', () => {
                searchDetailAddrFromCoords(new kakao.maps.LatLng(y, x), (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        // let iwContent = 
                        //     '<div style="padding:5px; color:black;"><span style="font-size:15px; font-weight:bold;">버스 정류장 ' + 
                        //     id + '</span><p style="font-size:15px;">' +
                        //     name + '</p><p style="font-size:15px;"><a href="https://map.kakao.com/link/to/' +
                        //     name + ', ' + String(y) + ', ' + String(x) +
                        //     '"style="color:blue" target="_blank">길찾기</a></p><p style="font-size:12px; padding:5px;">지번번호: '
                        //     + String(result[0].address.address_name)
                        //     + '</p></div>';
                        // infowindowRef.current = new kakao.maps.InfoWindow({
                        //     position: new kakao.maps.LatLng(place.y, place.x),
                        //     content: iwContent,
                        //     removable: true,
                        // })
                        // let infowindow = infowindowRef.current;
                        map.setCenter(new kakao.maps.LatLng(y, x));
                        setPlaces(place);
                        setAddress(result[0].address.address_name);
                        setOpenPopUp(true)
                        // infowindow.open(map, marker);
                    }
                });
            });
        }

        let bounds = new kakao.maps.LatLngBounds();
        displayMarker(stationList);
        bounds.extend(new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]));
        map.setBounds(bounds);

    }, [searchTitle]);

    // const mapCurrent = (place, searchPlace, e) => {
    //     e.preventDefault();
    //     searchPlace.map((item, key) => {
    //         document.getElementsByClassName(String(item.stationName+"_"+String(key)))[0].style.color="white"
    //     })
    //     const map = mapRef.current;
    //     let infowindow = infowindowRef.current;
    //     if (infowindow !== undefined) {
    //         infowindow.close();
    //         infowindowRef.current = undefined;
    //     }
    //     map.setCenter(new kakao.maps.LatLng(place.y, place.x));
    //     e.currentTarget.style.color = "skyblue"
    // }

    return (
        <div>
            <MapDiv id="map"></MapDiv>
            {
                openPopUp ? 
                    <MapPopUpDiv >
                        <MapPopUpHeaderDiv>
                            정류장 정보
                            <button 
                                style={{float: "right"}}
                                onClick={() => setOpenPopUp(false)}
                            >
                                <i className='fa fa-close'/>
                            </button>
                        </MapPopUpHeaderDiv>
                        <p>
                            <a href={
                                "https://map.kakao.com/link/to/" + 
                                places["stNm"]["_text"] + ', ' + 
                                String(places["gpsY"]["_text"]) + ', ' + 
                                String(places["gpsX"]["_text"])}
                                target="_blank"
                            >
                                길찾기
                            </a>
                        </p>
                        <p>{searchTitle}/{arsID}</p>
                        <p>{address}</p>
                    </MapPopUpDiv>
                : ""
            }
        </div>
    )
}

const MapDiv = styled.div`
    width: 70%;
    height: 600px;
    position: absolute;
    display: flex;
    margin: auto;
    left: 0;
    right: 0;
`;

const MapPopUpDiv = styled.div`
    z-index: 99;
    position: relative;
    display: block;
    width: 25%;
    height: 600px;
    left: 0;
    background: rgba(255, 255, 255, 0.85)
`;

const MapPopUpHeaderDiv = styled.div`
    padding: 15px;
    background: red;
    border: 2px solid black
`

export default KakaoMapScript