import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {PhaseSpace} from "./model";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


type AltitudeChartProps = {
  gpsInfoList: PhaseSpace[]
}

const getChartData = (gpsInfoList: PhaseSpace[]) => {
  const timestamps = gpsInfoList.map((gpsInfo) => {
    return gpsInfo.timestamp.format("HH:MM:ss");
  });

  const altitudesWithAccuracy = gpsInfoList.map(
    (gpsInfo) => {
      if (gpsInfo.coordinates.altitude && gpsInfo.coordinates.zAccuracy){
        return {
          y: gpsInfo.coordinates.altitude,
          yMin: gpsInfo.coordinates.altitude - gpsInfo.coordinates.zAccuracy,
          yMax: gpsInfo.coordinates.altitude + gpsInfo.coordinates.zAccuracy,
        }
      }
      else {
        return {
          y: gpsInfo.coordinates.altitude,
          yMin: undefined,
          yMax: undefined,
        }
      }
    }
  );

  return {
    labels: timestamps, // x軸のラベルの配列
    datasets: [
      {
        label: "GPS Altitude", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.y}),
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "GPS Altitude(-err)", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.yMin}),
        fill: "-1",
        pointRadius: 0,
      },
      {
        label: "GPS Altitude(+err)", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.yMax}),
        fill: "-2",
        pointRadius: 0,
      },
    ]
  };
}

export default function AltitudeChart(props: AltitudeChartProps){
  const sortAscByTime = (a: PhaseSpace, b: PhaseSpace) => {return a.timestamp.diff(b.timestamp)};
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList.sort(sortAscByTime);

  const chartData = getChartData(gpsInfoList);

  return (
    <Line data={chartData} options={{animation: false}}></Line>
  )
}