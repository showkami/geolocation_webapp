import React, {useEffect, useState} from "react";
import moment from "moment";
import {
  CircularProgress, Grid,
  Typography
} from "@mui/material";
import {PhaseSpace} from "./model";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";
import {useGpsByInterval} from "./gps";



export default function Geolocation(){
  const [isGpsFetching, gpsFetchStartTime, gpsInfoList] = useGpsByInterval();
  console.log(gpsInfoList)


  return (

    <div>
      {
        <Grid container>
          <Grid item xs={2}>
            {isGpsFetching ? <CircularProgress /> : <CircularProgress variant={"determinate"} value={100}/>}
          </Grid>
          <Grid item xs={10}>
            {gpsFetchStartTime ? <Typography>Getting location since {gpsFetchStartTime.format("HH:MM:SS")}</Typography> : <></>}
          </Grid>
        </Grid>
      }


      <AltitudeChart gpsInfoList={gpsInfoList} />
      <HistoricalTable gpsInfoList={gpsInfoList} />

    </div>
  )
}