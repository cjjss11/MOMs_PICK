"use client";

import { useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Search() {
  const open = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  let map: any = null;
  const markers: any = [];

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    const { addressType, bname, buildingName } = data;
    if (addressType === "R") {
      if (bname !== "") {
        extraAddress += bname;
      }
      if (buildingName !== "") {
        extraAddress += `${extraAddress !== "" && ", "}${buildingName}`;
      }
      fullAddress += `${extraAddress !== "" ? ` ${extraAddress}` : ""}`;
    }

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(fullAddress, function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면
        if (status === window.kakao.maps.services.Status.OK) {
          for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }

          const markerPosition = new window.kakao.maps.LatLng(
            result[0].y,
            result[0].x
          );
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);

          const bounds = new window.kakao.maps.LatLngBounds();
          bounds.extend(markerPosition);
          console.log("bounds : ", bounds);
          console.log("map : ", map);
          map.setBounds(bounds);

          // 결과값으로 받은 위치를 마커로 표시합니다
          // var marker = new window.kakao.maps.Marker({
          //   map: map,
          //   position: coords
          // });

          // 인포윈도우로 장소에 대한 설명을 표시합니다
          // var infowindow = new window.kakao.maps.InfoWindow({
          //   content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
          // });
          // infowindow.open(map, marker);

          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          // map.setCenter(coords);
        }
      });
    });
  };

  // script가 완전히 load 된 이후, 실행될 함수
  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          ), // 지도의 중심좌표
        };
        map = new window.kakao.maps.Map(mapContainer, mapOption);
        const markerPosition = new window.kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        markers.push(marker);
        marker.setMap(map);
      });
    });
  };

  let count = 0;
  useEffect(() => {
    if (count === 0) {
      count++;
      // DOM을 이용하여 script 태그를 만들어주자.
      const mapScript = document.createElement("script");
      // script.async = true 라면,
      // 해당 스크립트가 다른 페이지와는 비동기적으로 동작함을 의미한다.
      mapScript.async = true;
      // script.src에 map을 불러오는 api를 넣어주자.
      // 여기에서 우리가 기존에 발급 받았던 apiKey를 넣어주면 된다.
      mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services&autoload=false`;

      //이제 우리가 만든 script를 document에 붙여주자.
      document.head.appendChild(mapScript);

      // sciprt가 완전히 load 된 이후, 지도를 띄우는 코드를 실행시킨다.
      mapScript.addEventListener("load", onLoadKakaoMap);
    }
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "auto", height: "500px" }}></div>
      <button type="button" onClick={handleClick}>
        Open
      </button>
    </div>
  );
}