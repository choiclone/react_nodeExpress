/*global kakao*/
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import "../css/Kakao.css"

const KakaoMapScript = ({ searchTitle, arsID, stationList }) => {
    const [radiusSelect, setRadiusSelect] = useState(1);
    const [searchTitles, setSearchTitles] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false); 
    const [openSearchPopUp, setOpenSearchPopUp] = useState(false);
    const [markersA2, setMarkersA2] = useState([]);
    const [placePopUp, setPlacePopUp] = useState({
        addressName: "",
        placeName: "",
        x: 0,
        y: 0
    });

    const Options = [
        { radius: 1, selected: true },
        { radius: 3, selected: false  },
        { radius: 5, selected: false  },
    ]

    const CatePlace = [
        {name:"은행", id: "bank"}, 
        {name:"지하철", id: "train"}, 
        {name:"약국", id: "pharmacy"},
        {name:"마트", id: "mart"}, 
        {name:"카페", id: "cafe"}, 
        {name:"편의점", id: "store"}, 
        {name:"병원", id: "store"}, 
    ];

    const mapRef = useRef();
    const TmapRef = useRef();
    const markerRef = useRef();
    const placeRef = useRef();

    
    let markers2 = [], // 마커를 담을 배열입니다
    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

    useEffect(() => {
        let placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}), 
        contentNode = document.createElement('div'),
        markers = [];

        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]),
            level: 5,
        };

        contentNode.className = "placeinfo_wrap"

        addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
        addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);
        
        placeOverlay.setContent(contentNode);

        addCategoryClickEvent();

        mapRef.current = new kakao.maps.Map(container, options);
        placeRef.current = new kakao.maps.services.Places();
        const map = mapRef.current;
        const geocoder = new kakao.maps.services.Geocoder();
        const ps = placeRef.current;

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
                        setOpenPopUp(true);
                    });
                })(marker, places[i]);
            }
            map.panTo(new kakao.maps.LatLng(places[0]["noorLat"], places[0]["noorLon"]));
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
            const name = place["stNm"]["_text"];
            markerRef.current = new kakao.maps.Marker({
                map: map,
                clickable: true,
                position: new kakao.maps.LatLng(y, x)
            });
            let marker = markerRef.current;
            kakao.maps.event.addListener(marker, 'click', () => {
                searchDetailAddrFromCoords(new kakao.maps.LatLng(y, x), (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        map.panTo(new kakao.maps.LatLng(y, x));
                        setPlacePopUp({ ...placePopUp, addressName: result[0].address.address_name, placeName: name, x: x, y: y });
                        setOpenPopUp(true);
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
            var imageSrc = '/staticFolder/placeImages/location.png',
                imageSize = new kakao.maps.Size(30, 30),
                imgOptions =  {},
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
            const radiusId = document.getElementById('RadiusId');
            const radiusValue = radiusId.options[radiusId.selectedIndex].value;
            
            placeOverlay.setMap(null);
            setOpenPopUp(false);
        
            if (className === 'on') {
                currCategory = '';
                changeCategoryClass();
                removeMarker();
            } if(id === '검색'){
                removeMarker();
                setOpenSearchPopUp(false);
            } else {
                removeMarker();
                setOpenSearchPopUp(false);
                currCategory = id;
                changeCategoryClass(this);
                axios.post("/api/TmapAPI", {convine: id, lon: stationList["gpsX"]["_text"], lat: stationList["gpsY"]["_text"], radius: radiusValue})
                .then((res) => {
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
        
        function changeCategoryClass(el) {
            var category = document.getElementById('category'),
                children = category.children, i;
        
            for ( i=0; i<children.length; i++ ) {
                children[i].className = '';
            }
        
            if (el) el.className = 'on';
        } 

        function displayPlaceInfo (place) {
            map.panTo(new kakao.maps.LatLng(place["noorLat"], place["noorLon"]))
            let addressName = place.upperAddrName+" "+place.middleAddrName+" "+place.roadName+" "+place.buildingNo1;
            setPlacePopUp({ ...placePopUp, addressName: addressName, placeName: place.name, x:place["noorLat"], y:place["noorLon"] });
            console.log(place)
        }

        let bounds = new kakao.maps.LatLngBounds();
        displayMarker(stationList);
        bounds.extend(new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]));
        map.setBounds(bounds);

    }, [searchTitle]);

    const map = mapRef.current;

    function displayPlaceInfo (place) {
        if(Object.keys(place).includes("noorLat")) {
            let addressName = place.upperAddrName+" "+place.middleAddrName+" "+place.roadName+" "+place.buildingNo1;
            map.panTo(new kakao.maps.LatLng(place["noorLat"], place["noorLon"]))
            setPlacePopUp({ ...placePopUp, addressName: addressName, placeName: place.name, x: place["noorLat"], y: place["noorLon"] });
        }else{
            map.panTo(new kakao.maps.LatLng(place["noorLat"], place["noorLon"]))
            setPlacePopUp({ ...placePopUp, addressName: place.road_address_name, placeName: place.place_name, x: place.x, y: place.y });
        }
    }

    function displayPlaces(place) {
        const places = place;
        let marker;
        for (var i = 0; i < places.length; i++) {
            if(Object.keys(places[i]).includes("noorLat")) 
                marker = addMarker(new kakao.maps.LatLng(places[i]["noorLat"], places[i]["noorLon"]), 1);
            else marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), 1);
            (function (marker, places) {
                kakao.maps.event.addListener(marker, 'click', function () {
                    displayPlaceInfo(places);
                    setOpenPopUp(true)
                });
            })(marker, places[i]);
        }
        setMarkersA2(markers2);
        if(places[0] !== undefined){
            if(Object.keys(places[0]).includes("noorLat")) 
                map.panTo(new kakao.maps.LatLng(places[0]["noorLat"], places[0]["noorLon"]));
            else map.panTo(new kakao.maps.LatLng(places[0].y, places[0].x));
        }
        else {
            map.panTo(new kakao.maps.LatLng(stationList["gpsY"]["_text"], stationList["gpsX"]["_text"]));
            setPlacePopUp({ ...placePopUp, addressName: "", placeName: "", x:0, y:0 });
        }
    }

    function addMarker(position, order) {
        var imageSrc = '/staticFolder/placeImages/location.png',
            imageSize = new kakao.maps.Size(30, 30),
            imgOptions = {},
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage
            });

        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers2.push(marker);  // 배열에 생성된 마커를 추가합니다
        return marker;
    }

    function removeMarker() {
        for (var i = 0; i < markersA2.length; i++) {
            markersA2[i].setMap(null);
        }
        setMarkersA2([]);
    }

    const removeMarker2 = () => {
        for (var i = 0; i < markersA2.length; i++) {
            markersA2[i].setMap(null);
        }
        setMarkersA2([]);
    }

    const handleSearchTitle = (e) => {
        setSearchTitles(e.target.value);
    }

    const SubmitSearch = (e) => {
        currCategory = '';
        const search = searchTitles;
        removeMarker();
        setOpenPopUp(false);
        axios.post("/api/TmapAPI", {convine: search, lon: stationList["gpsX"]["_text"], lat: stationList["gpsY"]["_text"], radius: radiusSelect})
        .then((res) => {
            if(res.data.code === 200){
                displayPlaces(res.data.CatePlace["searchPoiInfo"]["pois"]["poi"]);
            }else{
                displayPlaces({"poi": []});
            }
        }).catch((err) => {
            console.log(err);
        });
        e.preventDefault();
    }

    const selectChange = (e) => {
        setRadiusSelect(e.target.value);
    }

    const CilckSearch = () => {
        setSearchTitles("");
        setOpenPopUp(false)
        setOpenSearchPopUp(true);
    }

    return (
        <div>
            <MapDiv id="map"></MapDiv>
            <ul id="category">
                {
                    CatePlace.map((item, key) => (
                        <li key={key} id={item.name} data-order={key} onClick={() => removeMarker2()}>
                            {item.name}
                        </li>
                    ))
                }
                <li onClick={() => CilckSearch()}>카테고리</li>
            </ul>
            <RadiusDiv>
                <select id="RadiusId" onChange={selectChange} value={radiusSelect}>
                    {
                        Options.map((item, key) => (
                            <option key={key} value={item.radius}>{item.radius}KM</option>
                        ))
                    }
                </select>
            </RadiusDiv>
            {
                openSearchPopUp ? 
                <SearchPopup>
                    <form onSubmit={SubmitSearch}>
                        <input type="text" value={searchTitles} onChange={handleSearchTitle} />
                        <button type="submit">검색</button>
                    </form>
                </SearchPopup> : ""
            }
            {
                openPopUp ? 
                    <MapPopUpDiv>
                        <MapPopUpHeaderDiv>
                            정류장 정보
                            <button 
                                style={{float: "right"}}
                                onClick={() => setOpenPopUp(false)}
                            >
                                <i className='fa fa-close'/>
                            </button>
                        </MapPopUpHeaderDiv>
                        {placePopUp.placeName !== searchTitle ? 
                        <p>
                            <a href={"https://map.kakao.com/?q=" + placePopUp.addressName } target="_blank">
                                길찾기
                            </a>/
                            {placePopUp.placeName}
                        </p> : 
                        <p>
                                <a href={"https://map.kakao.com/?q=" + searchTitle } target="_blank">
                                    길찾기
                                </a>/{searchTitle}/{arsID}
                        </p>
                        }
                        <p>{placePopUp.addressName}</p>
                    </MapPopUpDiv>
                : ""
            }
        </div>
    )
}

const MapDiv = styled.div`
    width: 100%;
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
    width: 100%;
    height: 200px;
    top: 349px;
    left: 0;
    margin: auto;
    background: rgba(255,255,255,0.85);
`;

const MapPopUpHeaderDiv = styled.div`
    padding: 10px;
    background: rgba(0, 50, 150, 0.5);
    border: 2px solid white;
`;

const SearchPopup = styled.div`
    position: absolute;
    z-index: 99;
    left: 0;
    right: 0;
    margin: auto;
`;

const RadiusDiv = styled.div`
    position: absolute;
    z-index: 100;
`;

export default KakaoMapScript