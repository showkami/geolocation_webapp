import React, {useState} from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {PhaseSpace} from "./model";
import {Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {LatLngExpression} from "leaflet";
import "leaflet/dist/leaflet.css";  // leafletのcssをインポートしないと表示が崩れる。 see https://qiita.com/honda28/items/e4c73c916e4d9b2ec279#leaflet-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90

type MapTileName = "OpenStreetMap" | "国土地理院標準地図" | "国土地理院淡色地図" | "国土地理院土地条件図"
type MapTile = {
  mapTileName: MapTileName,
  mapUrl: string,
  mapAcknowledge: string,
}

function useMapTile(initialMapTileName: MapTileName) : [MapTile, (mapTile: MapTileName) => void] {
  const [mapTileName, setMapTileName] = useState<MapTileName>(initialMapTileName);
  let mapUrl;
  let mapAcknowledge;
  switch (mapTileName){
    case "OpenStreetMap":
      mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      mapAcknowledge = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      break;
    case "国土地理院標準地図":
      mapUrl = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
      mapAcknowledge = '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a> '
      break;
    case "国土地理院淡色地図":
      mapUrl = "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
      mapAcknowledge = '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a> '
      break;
    case "国土地理院土地条件図":
      mapUrl = "https://cyberjapandata.gsi.go.jp/xyz/lcmfc/{z}/{x}/{y}.png"
      mapAcknowledge = '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a> '
      break;
  }

  return [{
    mapTileName: mapTileName,
    mapUrl: mapUrl,
    mapAcknowledge: mapAcknowledge,
  }, setMapTileName]
}

type MapProps = {
  gpsInfoList: PhaseSpace[]
}

export default function Map(props: MapProps){
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList;
  const defaultCenter: LatLngExpression = gpsInfoList.length > 0 ? [gpsInfoList[0].coordinates.latitude, gpsInfoList[0].coordinates.longitude] : [35.681236, 139.767125];

  const [mapTile, setMapTile] = useMapTile("国土地理院標準地図")

  return (
    <div>
      <ToggleButtonGroup size={"small"} value={mapTile.mapTileName}>
        <ToggleButton value={"OpenStreetMap"} onClick={()=>{setMapTile("OpenStreetMap")}}>OpenStreetMap</ToggleButton>
        <ToggleButton value={"国土地理院標準地図"} onClick={()=>{setMapTile("国土地理院標準地図")}}>国土地理院標準地図</ToggleButton>
        <ToggleButton value={"国土地理院淡色地図"} onClick={()=>{setMapTile("国土地理院淡色地図")}}>国土地理院淡色地図</ToggleButton>
        <ToggleButton value={"国土地理院土地条件図"} onClick={()=>{setMapTile("国土地理院土地条件図")}}>国土地理院土地条件図</ToggleButton>
      </ToggleButtonGroup>

      <Paper sx={{height: "400px"}}>
        <MapContainer style={{height: "400px"}} center={defaultCenter} zoom={15} scrollWheelZoom={false} >
          <TileLayer
            attribution={mapTile.mapAcknowledge}
            url={mapTile.mapUrl}
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Paper>

      <Typography variant={"caption"} align={"right"}></Typography>

    </div>
  )
}
