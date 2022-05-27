/*global kakao*/
import React, { useEffect } from 'react';

const KakaoMapScript = ({ searchPlace }) => {
    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.555167, 126.970833),
            level: 3,
        };
        const map = new kakao.maps.Map(container, options); // 지도 생성
        const geocoder = new kakao.maps.services.Geocoder();
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();

        // 키워드로 장소를 검색
        ps.keywordSearch("서울역", placesSearchCB);

        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        function displayMarker(place) {
            // 마커를 생성하고 지도에 표시
            let marker = new kakao.maps.Marker({
                map: map,
                clickable: true,
                position: new kakao.maps.LatLng(place.y, place.x)
            });
            kakao.maps.event.addListener(marker, 'click', () => {
                searchDetailAddrFromCoords(new kakao.maps.LatLng(place.y, place.x), function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        let iwContent = '<div style="padding:5px; color:black;"><span style="font-size:15px; font-weight:bold;">버스 정류장 '+String(place.arsId)+'</span><p style="font-size:15px;">' +
                            String(place.stationName) +
                            '</p><p style="font-size:15px;"><a href="https://map.kakao.com/link/to/' +
                            String(place.stationName) + ', ' + String(place.y) + ', ' + String(place.x) +
                            '" style="color:blue" target="_blank">길찾기</a></p><p style="font-size:12px; padding:5px;">지번번호: '
                            +String(result[0].address.address_name)
                            +'</p></div>';
                        let infowindow = new kakao.maps.InfoWindow({
                            position: new kakao.maps.LatLng(place.y, place.x),
                            content: iwContent,
                            removable: true,
                        })

                        infowindow.open(map, marker);
                    }
                });
            });
        }

        // 키워드 검색 완료 시 호출되는 콜백함수
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가
                let bounds = new kakao.maps.LatLngBounds();

                for (let i = 0; i < searchPlace.length; i++) {
                    displayMarker(searchPlace[i]);
                    bounds.extend(new kakao.maps.LatLng(searchPlace[i].y, searchPlace[i].x));
                }
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정
                map.setBounds(bounds);
            }
        }
    }, [searchPlace]);

    return (
        <div id="map" style={{ width: '100%', height: "350px" }}></div>
    )
}

export default KakaoMapScript