import React from "react";
import {
  CircularProgress, Grid, Switch,
  Typography,
  Accordion, AccordionSummary, AccordionDetails, Snackbar
} from "@mui/material";
import {useGpsByInterval} from "./gps";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";
import Map from "./Map";
import DownloadButton from "./DownloadButton";


export default function Geolocation(){
  const [isGpsErrorSnackbarOpen, setIsGpsErrorSnackbarOpen] = React.useState<boolean>(false);
  const [gpsErrorMessage, setGpsErrorMessage] = React.useState<string>("");
  const handleGpsError = (errMessage: string) => {
    setIsGpsErrorSnackbarOpen(true);
    setGpsErrorMessage(errMessage);
  }

  const [isContinueFetching, setIsContinueFetching] = React.useState<boolean>(false);
  const [isGpsFetching, gpsFetchStartTime, gpsInfoList] = useGpsByInterval(isContinueFetching, handleGpsError);

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

      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <Typography variant={"h6"}> Altitude Chart </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AltitudeChart gpsInfoList={gpsInfoList} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <Typography variant={"h6"}> Map </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Map gpsInfoList={gpsInfoList} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          <Typography variant={"h6"}> Historical Table </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HistoricalTable gpsInfoList={gpsInfoList} />
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={isGpsErrorSnackbarOpen}
        autoHideDuration={1000}
        onClose={() => {setIsGpsErrorSnackbarOpen(false)}}
        message={gpsErrorMessage}
      />
    </div>
  )
}