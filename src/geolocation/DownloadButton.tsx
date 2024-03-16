import {Button} from "@mui/material";
import {PhaseSpace} from "./model";

type DownloadButtonProps = {
  gpsInfoList: PhaseSpace[]
}

export default function DownloadButton(props: DownloadButtonProps){
  // 参考: https://diwao.com/2017/06/js-object-file-download.html
  const download = () => {
    const blob = new Blob([JSON.stringify(props.gpsInfoList)], {type: "application/json"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gps.json";
    a.click();
  }
  return (
    <Button onClick={download} >Download</Button>
  )
}