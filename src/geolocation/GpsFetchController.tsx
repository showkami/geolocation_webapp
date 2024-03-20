import {Card, CardContent, CardHeader, CircularProgress, IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

type GpsFetchControllerProps = {
  isWatchGps: boolean,
  toggleWatchStatus: () => void,
  isGpsFetching: boolean,
  gpsFetchStartTime: moment.Moment | undefined,
}

export default function GpsFetchController(props: GpsFetchControllerProps){
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            props.isGpsFetching ?
              <CircularProgress />
              : <CircularProgress color={"success"} variant={"determinate"} value={100}
              />
          }
          title={props.isGpsFetching ? "GPS Fetching..." : "GPS Not Fetching"}
          subheader={props.gpsFetchStartTime ? "Since " + props.gpsFetchStartTime.format("HH:MM:SS.ss") : ""}
        />
        <CardContent sx={{display: "flex"}}>
          Control GPS Watching
          <IconButton onClick={props.toggleWatchStatus}>
            {props.isWatchGps ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </CardContent>
      </Card>
    </>
  );
}