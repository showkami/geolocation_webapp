import {useEffect, useState} from "react";
import {PhaseSpace} from "./model";

export default function useGpsTimeseries(gpsInfo: PhaseSpace) {
  const [gpsIntoTimeseries, setGpsInfoTimeseries] = useState<PhaseSpace[]>([gpsInfo]);
  useEffect(() => {
    setGpsInfoTimeseries((prev) => {return [...prev, gpsInfo]});
  }, [gpsInfo])
  return gpsIntoTimeseries;
}