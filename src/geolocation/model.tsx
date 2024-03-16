
/**
 * Coordinates - 座標およびその精度
 * @property latitude - 緯度
 * @property longitude - 経度
 * @property altitude - 高度 [m]
 * @property xyAccuracy - latitude, longitudeの精度 [m]
 * @property zAccuracy - altitude の精度 [m]

 */
export type Coordinates = {
  latitude: number,
  longitude: number,
  altitude?: number,
  xyAccuracy: number,
  zAccuracy?: number,
}

/**
 * Velocity - 速度、すなわち速さと進む方向
 * @property heading - 端末が向かっている方向; 0 - 北, 90 - 東, 180 - 南, 270 - 西 ※speedが0のときはundefinedにする
 * @property speed -
*/
export type Velocity = {
  heading?: number,
  speed: number,
}

/**
 * PhaseSpace - ある時刻における座標・速度
 */
export type PhaseSpace = {
  timestamp: moment.Moment,
  coordinates: Coordinates,
  velocity?: Velocity,
}
