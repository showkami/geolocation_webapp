import React, {useEffect, useMemo, useState} from "react";
import moment from "moment";
import {
  CircularProgress, Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";

/**
 * Coordinates - 座標およびその精度
 * @property latitude - 緯度
 * @property longitude - 経度
 * @property altitude - 高度 [m]
 * @property xyAccuracy - latitude, longitudeの精度 [m]
 * @property zAccuracy - altitude の精度 [m]

 */
type Coordinates = {
  latitude: number,
  longitude: number,
  altitude?: number,
  xyAccuracy: number,
  zAccuracy?: number,
}

/**
 * Velocity - 速度、すなわち速さと進む方向
 * @property heading - 端末が向かっている方向; 0 - 北, 90 - 東, 180 - 南, 270 - 西 ※speedが0のときはundefinedにする
 * @property speed -
*/
type Velocity = {
  heading?: number,
  speed: number,
}

/**
 * PhaseSpace - ある時刻における座標・速度
 */
type PhaseSpace = {
  timestamp: moment.Moment,
  coordinates: Coordinates,
  velocity?: Velocity,
}

export default function (){
  const [gpsInfo, setGpsInfo] = useState<PhaseSpace | undefined>(undefined);
  const [gpsInfoList, setGpsInfoList] = useState<(PhaseSpace)[]>([]);
  useEffect(() => {
    if (gpsInfo !== undefined){
      setGpsInfoList([...gpsInfoList, gpsInfo]);
    }
  }, [gpsInfo]);

  const [isGettingGpsInfo, setIsGettingGpsInfo] = useState<boolean>(false);
  const [gpsInfoGettingStartTime, setGpsInfoGettingStartTime] = useState<moment.Moment | undefined>(undefined);
  useEffect(() => {
    if (isGettingGpsInfo) {
      setGpsInfoGettingStartTime(moment());
    } else {
      setGpsInfoGettingStartTime(undefined);
    }
  }, [isGettingGpsInfo]);

  const getCurrentPositionAndSet = () => {
    console.log("getCurrentPositionAndSet called")
    setIsGettingGpsInfo(true);
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got GeolocationPosition position=", position);
      const gottenGpsInfo: PhaseSpace = {
        timestamp: moment(position.timestamp),
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
          xyAccuracy: position.coords.accuracy,
          zAccuracy: position.coords.altitudeAccuracy || undefined,
        },
        velocity: position.coords.speed !== null ? {
          heading: (position.coords.speed !== 0 && position.coords.heading !== null) ? position.coords.heading : undefined,
          speed: position.coords.speed,
        } : undefined
      }
      setIsGettingGpsInfo(false);
      setGpsInfo(gottenGpsInfo);
    });
  }

  // gpsInfoが変わるたびに、1秒待って、新しい位置情報を取得しに行く
  useEffect(() => {
    // setIsGettingGpsInfo(true);
    setTimeout(getCurrentPositionAndSet, 1000)
    // setIsGettingGpsInfo(false);
  }, [gpsInfo])


  console.log(`as of rendering, isGettingGpsInfo=${isGettingGpsInfo}, startTime=${gpsInfoGettingStartTime}`)
  return (

    <div>
      <h1>Geolocation</h1>

      {
        isGettingGpsInfo ?
          (
            <Grid container>
              <Grid item xs={2}>
                <CircularProgress />
              </Grid>
              <Grid item xs={10}>
                <Typography>Getting location since {gpsInfoGettingStartTime?.format("HH:MM:SS")}</Typography>
              </Grid>
            </Grid>
          )
          : <> <CircularProgress variant={"determinate"} value={100}/> </>
      }

      <TableContainer>
        <Table>
          <TableHead>
            <TableCell> Timestamp </TableCell>
            <TableCell> 緯度 </TableCell>
            <TableCell> 経度 </TableCell>
            <TableCell> 高さ </TableCell>
          </TableHead>
          <TableBody>
            {
              gpsInfoList.map((record) => {
                return (
                  <TableRow>
                    <TableCell> {record.timestamp.format("YYYY-MM-DD HH:MM:SS")} </TableCell>
                    <TableCell> {record.coordinates.latitude} </TableCell>
                    <TableCell> {record.coordinates.latitude} </TableCell>
                    <TableCell> {record.coordinates.altitude} </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}