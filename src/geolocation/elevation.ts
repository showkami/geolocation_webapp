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
