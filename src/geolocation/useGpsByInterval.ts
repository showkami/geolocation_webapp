import {useEffect, useState} from "react";
import useGps from "./useGps";
import {PhaseSpace} from "./model";
import moment from "moment";
import useGpsTimeseries from "./useGpsTimeseries";
import {fetchGpsCallback} from "./useGps";

export function useGpsByInterval(): [boolean, moment.Moment | undefined, PhaseSpace[]] {
  const [gpsInfo, setGpsInfo] = useState<PhaseSpace | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchStartTime, setFetchStartTime] = useState<moment.Moment | undefined>(undefined);

  const gpsInfoList: PhaseSpace[] = useGpsTimeseries(gpsInfo);

  useEffect(() => {
    setTimeout(() => {
      fetchGpsCallback(setIsFetching, setFetchStartTime, setGpsInfo);
    }, 1000);
  }, []);
  // TODO: これだと1秒ごとにGPSを取得しようとしてしまう。
  //  が、本当は「前回GPS取得が完了してから1秒後に次のGPS取得を試みる」のが理想。

  return [isFetching, fetchStartTime, gpsInfoList];
}