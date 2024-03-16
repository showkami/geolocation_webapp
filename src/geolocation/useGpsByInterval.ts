import {useEffect} from "react";
import useGps from "./useGps";

export function useGpsByInterval() {
  useEffect(() => {
    if (!isGpsFetching) {
      // GPS取得が終わっていたら、1秒待って、再度取得する
      setTimeout(() => {
    }
  }, [isGpsFetching]);
}