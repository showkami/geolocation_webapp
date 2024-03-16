import {PhaseSpace} from "./model";
import {useEffect, useState} from "react";
import moment from "moment/moment";

export default function useGps(): [boolean, moment.Moment | undefined, PhaseSpace | undefined] {
  const [gpsInfo, setGpsInfo] = useState<PhaseSpace | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchStartTime, setFetchStartTime] = useState<moment.Moment | undefined>(undefined);

  useEffect(() => {
    setIsFetching(true);
    setFetchStartTime(moment());
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        setIsFetching(false);
        setFetchStartTime(undefined);
        setGpsInfo(gottenGpsInfo);
      }
    );
  }, []);

  return [isFetching, fetchStartTime, gpsInfo];
}