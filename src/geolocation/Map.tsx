import React, {useEffect, useState} from "react";
import {useMap, MapContainer, TileLayer, CircleMarker, Popup} from "react-leaflet";
import {PhaseSpace} from "./model";
import {
  Paper,
  Table,
  TableBody, TableCell,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import {LatLngExpression} from "leaflet";
import "leaflet/dist/leaflet.css";  // leafletのcssをインポートしないと表示が崩れる。 see https://qiita.com/honda28/items/e4c73c916e4d9b2ec279#leaflet-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90
import {getElevation} from "./elevation";

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

function Markers(props: {gpsInfoList: PhaseSpace[]}){

  return (
    <>
      {
      props.gpsInfoList.map((gpsInfo) => {
        return (
          <CircleMarker center={[gpsInfo.coordinates.latitude, gpsInfo.coordinates.longitude]}>
            <Popup>
              <TableContainer>
                <Table size={"small"}>
                  <TableBody>
                    <TableRow>
                      <TableCell>時刻</TableCell>
                      <TableCell> {gpsInfo.timestamp.format("HH:mm:ss.SS")} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GPS標高</TableCell>
                      <TableCell> {gpsInfo.coordinates.altitude?.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>地面標高</TableCell>
                      <TableCell>NA</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Popup>
          </CircleMarker>
        )
      })
    }
    </>
  )
}

type MapProps = {
  gpsInfoList: PhaseSpace[]
}

export default function Map(props: MapProps){
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList;
  const mapCenter: LatLngExpression = [35.681236, 139.767125];
  // TODO: 位置情報更新されたら、それに合わせてマップ中心を変えたい

  const [mapTile, setMapTileName] = useMapTile("国土地理院標準地図")

  return (
    <div>
      <ToggleButtonGroup size={"small"} value={mapTile.mapTileName}>
        <ToggleButton value={"OpenStreetMap"} onClick={()=>{setMapTileName("OpenStreetMap")}}>OpenStreetMap</ToggleButton>
        <ToggleButton value={"国土地理院標準地図"} onClick={()=>{setMapTileName("国土地理院標準地図")}}>国土地理院標準地図</ToggleButton>
        <ToggleButton value={"国土地理院淡色地図"} onClick={()=>{setMapTileName("国土地理院淡色地図")}}>国土地理院淡色地図</ToggleButton>
        <ToggleButton value={"国土地理院土地条件図"} onClick={()=>{setMapTileName("国土地理院土地条件図")}}>国土地理院土地条件図</ToggleButton>
      </ToggleButtonGroup>

      <Paper sx={{height: "400px"}}>
        <MapContainer style={{height: "400px"}} center={mapCenter} zoom={15} scrollWheelZoom={false} >
          <TileLayer
            attribution={mapTile.mapAcknowledge}
            url={mapTile.mapUrl}
          />
          <Markers gpsInfoList={gpsInfoList} />
        </MapContainer>
      </Paper>

      <Typography variant={"caption"} align={"right"}></Typography>

    </div>
  )
}
