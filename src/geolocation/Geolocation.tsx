import React from "react";
import {
  Typography,
  Accordion, AccordionSummary, AccordionDetails, Snackbar
} from "@mui/material";
import {useGpsByInterval} from "./gps";
import HistoricalTable from "./HistoricalTable";
import AltitudeChart from "./AltitudeChart";
import Map from "./Map";
import DownloadButton from "./DownloadButton";
import GpsFetchController from "./GpsFetchController";


export default function Geolocation(){
  const [isGpsErrorSnackbarOpen, setIsGpsErrorSnackbarOpen] = React.useState<boolean>(false);
  const [gpsErrorMessage, setGpsErrorMessage] = React.useState<string>("");
  const handleGpsError = (errMessage: string) => {
    setIsGpsErrorSnackbarOpen(true);
    setGpsErrorMessage(errMessage);
  }

  const [isWatchGps, setIsWatchGps] = React.useState<boolean>(false);
  const [isGpsFetching, gpsFetchStartTime, gpsInfoList] = useGpsByInterval(isWatchGps, handleGpsError);
  const toggleWatchStatus = () => {setIsWatchGps((prev)=>!prev)};

  return (

    <div>
      <GpsFetchController
        isWatchGps={isWatchGps}
        toggleWatchStatus={toggleWatchStatus}
        isGpsFetching={isGpsFetching}
        gpsFetchStartTime={gpsFetchStartTime}
      />

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