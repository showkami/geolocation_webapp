import React, {useEffect, useState} from "react";
import moment from "moment";
import {
  CircularProgress, Grid,
  Typography
} from "@mui/material";
import {PhaseSpace} from "./model";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";



export default function Geolocation(){
  const [gpsInfo, setGpsInfo] = useState<PhaseSpace | undefined>(undefined);
  const [gpsInfoList, setGpsInfoList] = useState<(PhaseSpace)[]>([]);
  useEffect(() => {
    if (gpsInfo !== undefined){
      setGpsInfoList((currentList) => [...currentList, gpsInfo]);
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

      <AltitudeChart gpsInfoList={gpsInfoList} />
      <HistoricalTable gpsInfoList={gpsInfoList} />

    </div>
  )
}