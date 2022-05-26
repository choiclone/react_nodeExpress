import React, { useEffect } from 'react';
const { kakao } = window;

const KakaoMapScript = ({searchPlace}) => {
    useEffect(() => {
        const container = document.getElementById('myMap');
        const options = {
            center: new kakao.maps.LatLng(37.555167, 126.970833),
            level: 3
        };
        const map = new kakao.maps.Map(container, options);
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();
    
        // 키워드로 장소를 검색
        ps.keywordSearch("문화촌현대아파트", placesSearchCB);
    
        function displayMarker(place) {
            // 마커를 생성하고 지도에 표시
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
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
        <div id="myMap" style={{width:'100%', height: "350px"}}></div>
    )
}

export default KakaoMapScript