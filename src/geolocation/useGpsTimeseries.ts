import {useEffect, useState} from "react";
import {PhaseSpace} from "./model";

export default function useGpsTimeseries(gpsInfo: PhaseSpace | undefined) {
  const [gpsIntoTimeseries, setGpsInfoTimeseries] = useState<PhaseSpace[]>([]);
  useEffect(() => {
    if (gpsInfo) {
      setGpsInfoTimeseries((prev) => {return [...prev, gpsInfo]});
    }
  }, [gpsInfo])
  return gpsIntoTimeseries;
}