/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const KakaoMapScript = ({ searchTitle, arsID, stationList }) => {
    const [address, setAddress] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false); 
    const [places, setPlaces] = useState([]);
    // const [catePlaces, setCatePlaces] = useState([]);

    const busRouteType = {
        "1": "공항", "2": "마을", "3": "간선", "4": "지선", "5": "순환", "6": "광역", "7": "인천", "8": "경기", "9": "폐지", "0": "공용"
    }
    const CatePlace = [
        {"name":"은행", "id": "bank"}, 
        {"name":"편의점", "id": "conv"}, 
        {"name":"카페", "id": "cafe"}, 
        {"name":"지하철", "id": "subway"}, 
        {"name":"정류장", "id": "station"}, 
        {"name":"약국", "id": "med"}
    ];
    const mapRef = useRef();
    const markerRef = useRef();

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.555167, 126.970833),
            level: 5,
        };

        let placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
        contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
        markers = [], // 마커를 담을 배열입니다
        currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

        contentNode.className = "placeinfo_wrap"

        addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
        addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);
        
        placeOverlay.setContent(contentNode);

        addCategoryClickEvent();

        mapRef.current = new kakao.maps.Map(container, options);
        const map = mapRef.current;
        const geocoder = new kakao.maps.services.Geocoder();
        const ps = new kakao.maps.services.Places();

        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC); 

        function addEventHandle(target, type, callback) {
            if (target.addEventListener) {
                target.addEventListener(type, callback);
            } else {
                target.attachEvent('on' + type, callback);
            }
        }

        function searchDetailAddrFromCoords(coords, callback) {
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        function displayPlaces(place) {
            const places = place["poi"];
            var order = document.getElementById(currCategory).getAttribute('data-order');
            for ( var i=0; i<places.length; i++) {
                let lat = places[i]["noorLat"];
                let lon = places[i]["noorLon"];
                var marker = addMarker(new kakao.maps.LatLng(lat, lon), order);
                (function(marker, places) {
                    kakao.maps.event.addListener(marker, 'click', function() {
                        displayPlaceInfo(places);
                    });
                })(marker, places[i]);
            }
        }

        function removeMarker() {
            for ( var i = 0; i < markers.length; i++ ) {
                markers[i].setMap(null);
            }   
            markers = [];
        }

        function displayMarker(place) {
            const x = place["gpsX"]["_text"];
            const y = place["gpsY"]["_text"];
            markerRef.current = new kakao.maps.Marker({
                map: map,
                clickable: true,
                position: new kakao.maps.LatLng(y, x)
            });
            let marker = markerRef.current;
            kakao.maps.event.addListener(marker, 'click', () => {
                searchDetailAddrFromCoords(new kakao.maps.LatLng(y, x), (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        map.setCenter(new kakao.maps.LatLng(y, x));
                        setPlaces(place);
                        setAddress(result[0].address.address_name);
                        setOpenPopUp(true)
                    }
                });
            });
        }

        function placesSearchCB(places) {
            if (!currCategory) return;
            placeOverlay.setMap(null);
            removeMarker();
            if((places["poi"]).length !== 0) displayPlaces(places);
        }

        function addMarker(position, order) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
                imgOptions =  {
                    spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
                    spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage 
                });
        
            marker.setMap(map); // 지도 위에 마커를 표출합니다
            markers.push(marker);  // 배열에 생성된 마커를 추가합니다
        
            return marker;
        }

        function addCategoryClickEvent() {
            var category = document.getElementById('category'),
                children = category.children;
        
            for (var i=0; i<children.length; i++) {
                children[i].onclick = onClickCategory;
            }
        }
        
        function onClickCategory() {
            const id = this.id, className = this.className;
        
            placeOverlay.setMap(null);
        
            if (className === 'on') {
                currCategory = '';
                changeCategoryClass();
                removeMarker();
            } else {
                currCategory = id;
                changeCategoryClass(this);
                axios.post("/api/TmapAPI", {convine: id, lon: stationList["gpsX"]["_text"], lat: stationList["gpsY"]["_text"]})
                .then((res) => {
                    console.log(res.data.code)
                    if(res.data.code === 200){
                        placesSearchCB(res.data.CatePlace["searchPoiInfo"]["pois"]);
                    }else{
                        placesSearchCB({"poi": []});
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
        
        // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
        function changeCategoryClass(el) {
            var category = document.getElementById('category'),
                children = category.children,
                i;
        
            for ( i=0; i<children.length; i++ ) {
                children[i].className = '';
            }
        
            if (el) {
                el.className = 'on';
            } 
        } 

        function displayPlaceInfo (place) {
            console.log(place)
            let addressName = place.upperAddrName+" "+place.middleAddrName+" "+place.roadName+" "+place.buildingNo1;
            if(place.buildingNo2 !== "" && place.buildingNo2 !== "0") addressName = addressName+"-"+place.buildingNo2;
            let content = '<div class="placeinfo">' +
                            '<a class="title" href="' + addressName + '" target="_blank" title="' + place.name + '">' + place.name + '</a>';   
            if(place.road_address_name) {
                content += '<span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                            '<span class="jibun" title="' + addressName + '">(지번 : ' + addressName + ')</span>';
            }else {
                content += '<span title="' + addressName + '">' + addressName + '</span>';
            }                
            content +=  '</div>' + 
                        '<div class="after"></div>';
        
            contentNode.innerHTML = content;
            placeOverlay.setPosition(new kakao.maps.LatLng(place.noorLat, place.noorLon));
            placeOverlay.setMap(map);  
        }

        let bounds = new kakao.maps.LatLngBounds();
        displayMarker(stationList);
        bounds.extend(new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]));
        map.setBounds(bounds);

    }, [searchTitle]);

    return (
        <div>
            <MapDiv id="map"></MapDiv>
            <CateMoveUL id="category">
                {
                    CatePlace.map((item, key) => (
                        <li key={key} id={item.name} data-order={key}>
                            <span className={"category_bg "+item.id}></span>
                            {item.name}
                        </li>
                    ))
                }
            </CateMoveUL>
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

const CateMoveUL = styled.ul`
    position: relative;
    display: block;
    background: white;
    z-index: 99;
`

export default KakaoMapScript