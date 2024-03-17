import React, {useEffect, useState} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, ChartData,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {PhaseSpace} from "./model";
import {getElevation} from "./elevation";

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

const getChartData = (gpsInfoList: PhaseSpace[]): ChartData<"line"> => {
  const timestamps = gpsInfoList.map((gpsInfo) => {
    return gpsInfo.timestamp.format("HH:mm:ss");
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
          yMin: null,
          yMax: null,
        }
      }
    }
  );

  return {
    labels: timestamps, // x軸のラベルの配列
    datasets: [
      {
        label: "GPS Altitude", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.y as (number | null)}) ,
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: "GPS Altitude(-err)", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.yMin as (number | null)}),
        fill: "-1",
        pointRadius: 0,
      },
      {
        label: "GPS Altitude(+err)", // 凡例
        data: altitudesWithAccuracy.map((obj)=>{return obj.yMax as (number | null)}),
        fill: "-2",
        pointRadius: 0,
      },
    ]
  };
}

const useChartDataWithElevation = (
  chartData: ChartData<"line">,
  gpsInfoList: PhaseSpace[],
) : ChartData<"line"> => {
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

  const newChartData: ChartData<"line"> = {...chartData};
  newChartData.datasets.push(
    {
      label: "地面標高", // 凡例
      data: elevations.map((elv)=>{return elv ? elv : 0}), // TODO: 本当はundefinedのまま出したいが、なんかエラーでるのでいったん0にしてる
      borderColor: "blue",
      backgroundColor: "blue",
      pointRadius: 0,
    }
  )
  return newChartData
}

export default function AltitudeChart(props: AltitudeChartProps){
  const sortAscByTime = (a: PhaseSpace, b: PhaseSpace) => {return a.timestamp.diff(b.timestamp)};
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList.sort(sortAscByTime);
  const chartData = getChartData(gpsInfoList);

  const chartDataWithElevation = useChartDataWithElevation(chartData, gpsInfoList);

  return (
    <Line data={chartDataWithElevation} options={{animation: false}}></Line>
  )
}