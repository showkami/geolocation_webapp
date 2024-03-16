import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {PhaseSpace} from "./model";

type HistoricalTableProps = {
  gpsInfoList: PhaseSpace[]
}

export default function HistoricalTable(props: HistoricalTableProps){
  const sortDescByTime = (a: PhaseSpace, b: PhaseSpace) => {return b.timestamp.diff(a.timestamp)};
  const gpsInfoList: PhaseSpace[] = props.gpsInfoList.sort(sortDescByTime);
  return (
    <TableContainer>
        <Table size={"small"}>
          <TableHead>
            <TableCell> 時刻 </TableCell>
            <TableCell> 緯度 </TableCell>
            <TableCell> 経度 </TableCell>
            <TableCell> 高さ </TableCell>
          </TableHead>
          <TableBody>
            {
              gpsInfoList.map((record) => {
                return (
                  <TableRow>
                    <TableCell> {record.timestamp.format("HH:MM:SS")} </TableCell>
                    <TableCell> {record.coordinates.latitude} </TableCell>
                    <TableCell> {record.coordinates.longitude} </TableCell>
                    <TableCell> {record.coordinates.altitude} </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
  )
}