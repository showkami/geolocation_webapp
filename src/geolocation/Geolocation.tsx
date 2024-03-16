import React, {useEffect, useState} from "react";
import moment from "moment";
import {
  CircularProgress, Grid,
  Typography
} from "@mui/material";
import {PhaseSpace} from "./model";
import useGps from "./useGps";
import useGpsTimeseries from "./useGpsTimeseries";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";



export default function Geolocation(){
  console.log("Geolocation is rendering")
  const [isGpsFetching, gpsFetchStartTime, gpsInfo] = useGps();
  console.log("isGpsFetching=", isGpsFetching);
  // const gpsInfoList = useGpsTimeseries(gpsInfo);
  const gpsInfoList: PhaseSpace[] = [];

  return (

    <div>
      {gpsInfo.coordinates?.latitude}
      {
        isGpsFetching ?
          (
            <Grid container>
              <Grid item xs={2}>
                <CircularProgress />
              </Grid>
              <Grid item xs={10}>
                <Typography>Getting location since {gpsFetchStartTime?.format("HH:MM:SS")}</Typography>
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