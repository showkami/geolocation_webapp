import React from 'react';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Geolocation from "./geolocation/Geolocation";

const App = () => {
  const theme = createTheme({palette: {mode: 'light'}});
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Geolocation />
      </ThemeProvider>
    </>
  )
}

export default App;