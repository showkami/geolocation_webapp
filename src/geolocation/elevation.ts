import {useEffect, useState} from "react";
import {PhaseSpace} from "./model";

const cache: { [key: string]: number } = {};

/**
 * 国土地理院のAPIを叩いて標高を取得する。
 * ただし、同じ座標 (緯度・経度とも小数5位までが同じものは同じ座標とみなす) に対してはキャッシュを使う。
 * see  https://maps.gsi.go.jp/development/elevation_s.html
 * @param latitude
 * @param longitude
 */
export async function getElevation(latitude: number, longitude: number) {
  const positionString = `${latitude.toFixed(5)},${longitude.toFixed(5)}`
  if (positionString in cache) {
    return cache[positionString]
  } else {
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${longitude}&lat=${latitude}&outtype=json`;
    console.warn(`API Fetch Start ==> ${url}`)
    console.log()
    const elevation: number = (await (await fetch(url)).json()).elevation
    // TODO: なんかもっとちゃんとしたい (こんなawait祭りではなく・・・)
    // fetch(url).then((response) => {
    //   response.json().then((data) => {
    //     setElevation(data.elevation)
    //   });
    // });
    if (elevation) cache[positionString] = elevation;
    return elevation
  }
}

export function useElevationFromGpsInfoList(gpsInfoList: PhaseSpace[]) {
  const [elevations, setElevations] = useState<(number | undefined)[]>(
    gpsInfoList.map(() => {return undefined})
  )

  useEffect(() => {
    gpsInfoList.forEach(
      (gpsInfo, i) => {
        // getElevation() の結果を await して、ちゃんと標高帰ってくるのを待ってからsetElevations()したい
        // ...が、await は async function 内でしか使えない
        // そこで、「async functionを作ってそれを呼び出す」という形式で記述する
        // 参考... https://qiita.com/disney_Lady_Pg/items/f54333f7b0d3611e8888
        const fetchAndSet = async () => {
          const elevation = await getElevation(gpsInfo.coordinates.latitude, gpsInfo.coordinates.longitude);
          setElevations((prev) => {
            const newElevations = [...prev];
            newElevations[i] = elevation;
            return newElevations;
          })
        }
        fetchAndSet();
      }
    );
  }, [gpsInfoList]);

  return elevations
}
