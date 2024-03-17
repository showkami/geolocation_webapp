import React from "react";
import {
  CircularProgress, Grid, Switch,
  Typography
} from "@mui/material";
import {useGpsByInterval} from "./gps";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";
import DownloadButton from "./DownloadButton";


export default function Geolocation(){
  const [isContinueFetching, setIsContinueFetching] = React.useState<boolean>(false);
  const [isGpsFetching, gpsFetchStartTime, gpsInfoList] = useGpsByInterval(isContinueFetching);

  return (

    <div>
      <Switch
        checked={isContinueFetching}
        onChange={(e) => {setIsContinueFetching(e.target.checked)}}
      />

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

      <DownloadButton gpsInfoList={gpsInfoList} />

      {/*<AltitudeChart gpsInfoList={gpsInfoList} />*/}
      <HistoricalTable gpsInfoList={gpsInfoList} />


    </div>
  )
}