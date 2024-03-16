import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {PhaseSpace} from "./model";

type HistoricalTableProps = {
  gpsInfoList: PhaseSpace[]
}

export default function HistoricalTable(props: HistoricalTableProps){
  const sortDescByTime = (a: PhaseSpace, b: PhaseSpace) => {return b.timestamp.diff(a.timestamp)};
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList.sort(sortDescByTime);
  return (
    <Paper variant={"outlined"}>
      <TableContainer sx={{maxHeight: 440}}>
        <Table size={"small"} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align={"center"} colSpan={1}></TableCell>
              <TableCell align={"center"} colSpan={3}> 位置情報 </TableCell>
              <TableCell align={"center"} colSpan={2}> 精度 </TableCell>
            </TableRow>
            <TableRow>
              <TableCell> 時刻 </TableCell>
              <TableCell> 緯度 </TableCell>
              <TableCell> 経度 </TableCell>
              <TableCell> 高さ </TableCell>
              <TableCell> 水平精度 </TableCell>
              <TableCell> 高さ精度 </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              gpsInfoList.map((record) => {
                return (
                  <TableRow>
                    <TableCell> {record.timestamp.format("HH:MM:ss.SS")} </TableCell>
                    <TableCell> {record.coordinates.latitude.toFixed(5)} </TableCell>
                    <TableCell> {record.coordinates.longitude.toFixed(5)} </TableCell>
                    <TableCell> {record.coordinates.altitude?.toFixed(2)} </TableCell>
                    <TableCell> {record.coordinates.xyAccuracy.toFixed(2)} </TableCell>
                    <TableCell> {record.coordinates.zAccuracy?.toFixed(2)} </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}