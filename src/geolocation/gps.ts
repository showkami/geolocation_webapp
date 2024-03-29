import {useEffect, useState} from "react";
import moment from "moment/moment";
import {PhaseSpace} from "./model";

async function fetchGpsCallback(setIsFetching:Function, setFetchStartTime:Function, setGpsInfo:Function, handleGpsError:Function = ()=>{}) {
  setIsFetching(true);
  const fetchStartTime = moment();
  setFetchStartTime(fetchStartTime);
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
    },
    (err) => {
      const errMessage = `GPS Fetch (since ${fetchStartTime.format("HH:mm:ss")}) Error: ${err.message}`;
      handleGpsError(errMessage);
      setIsFetching(false);
      setFetchStartTime(undefined);
      setGpsInfo(undefined);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000, // 5秒以内に取得できなければエラー
      maximumAge: 0 // キャッシュを使わない
    }
  );
}

export function useGpsByInterval(isContinueFetching: boolean, handleGpsError:Function = ()=>{}): [boolean, moment.Moment | undefined, PhaseSpace[]] {
  const [gpsInfo, setGpsInfo] = useState<PhaseSpace | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchStartTime, setFetchStartTime] = useState<moment.Moment | undefined>(undefined);

  useEffect(() => {
    // loop()の再帰的な呼び出しで、1秒ごとにfetchGpsCallbackを呼び出す
    // see https://developer.mozilla.org/ja/docs/Web/API/setInterval#%E5%AE%9F%E8%A1%8C%E6%99%82%E9%96%93%E3%82%92%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%90%E3%83%AB%E3%82%88%E3%82%8A%E7%A2%BA%E5%AE%9F%E3%81%AB%E7%9F%AD%E3%81%8F%E3%81%99%E3%82%8B
    let timerId: NodeJS.Timeout;
    (
      function loop() {
        timerId = setTimeout(() => {
          if (isContinueFetching) {
            fetchGpsCallback(setIsFetching, setFetchStartTime, setGpsInfo, handleGpsError);
          }
          loop();
        }, 1000);
      }
    )();
    return () => {clearInterval(timerId);}; // 再レンダーの際にはタイマーをクリーンアップ
  }, [isContinueFetching, handleGpsError]);

  const [gpsInfoTimeseries, setGpsInfoTimeseries] = useState<PhaseSpace[]>([]);
  useEffect(() => {
    if (gpsInfo) {
      setGpsInfoTimeseries((prev) => {return [...prev, gpsInfo]});
    }
  }, [gpsInfo])

  return [isFetching, fetchStartTime, gpsInfoTimeseries];
}