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

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.555167, 126.970833),
            level: 9,
        };

        let placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
        contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
        markers = [], // 마커를 담을 배열입니다
        currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

        addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
        addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

        contentNode.className = 'placeinfo_wrap';
        placeOverlay.setContent(contentNode);

        mapRef.current = new kakao.maps.Map(container, options);
        const map = mapRef.current;
        const geocoder = new kakao.maps.services.Geocoder();
        const ps = new kakao.maps.services.Places();
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC); 
        kakao.maps.event.addListener(map, 'idle', searchPlaces);

        function addEventHandle(target, type, callback) {
            if (target.addEventListener) {
                target.addEventListener(type, callback);
            } else {
                target.attachEvent('on' + type, callback);
            }
        }

        function searchPlaces() {
            if (!currCategory) {
                return;
            }
            
            // 커스텀 오버레이를 숨깁니다 
            placeOverlay.setMap(null);
        
            // 지도에 표시되고 있는 마커를 제거합니다
            removeMarker();
            
            ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
        }

        ps.categorySearch("FD6", callbackFunc);
        
        function callbackFunc (result, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                console.log("검색된 음식점의 갯수는 " +  result.length + "개 입니다.");
            }
        };

        function searchDetailAddrFromCoords(coords, callback) {
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        function displayPlaces(places) {
            var order = document.getElementById(currCategory).getAttribute('data-order');
        
            
        
            for ( var i=0; i<places.length; i++ ) {
                    var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

                    (function(marker, place) {
                        kakao.maps.event.addListener(marker, 'click', function() {
                            console.log(place)
                            // displayPlaceInfo(place);
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

        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
        
                // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
                displayPlaces(data);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
        
            } else if (status === kakao.maps.services.Status.ERROR) {
                // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
                
            }
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

        let bounds = new kakao.maps.LatLngBounds();
        displayMarker(stationList);
        bounds.extend(new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]));
        map.setBounds(bounds);

    }, [searchTitle]);

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
                        <ul id="category">
                            <li id="BK9" data-order="0">
                                <span class="category_bg bank"></span>
                                은행
                            </li>
                            <li id="MT1" data-order="1">
                                <span class="category_bg mart"></span>
                                마트
                            </li>
                            <li id="PM9" data-order="2">
                                <span class="category_bg pharmacy"></span>
                                약국
                            </li>
                            <li id="OL7" data-order="3">
                                <span class="category_bg oil"></span>
                                주유소
                            </li>
                            <li id="CE7" data-order="4">
                                <span class="category_bg cafe"></span>
                                카페
                            </li>
                            <li id="CS2" data-order="5">
                                <span class="category_bg store"></span>
                                편의점
                            </li>
                        </ul>
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