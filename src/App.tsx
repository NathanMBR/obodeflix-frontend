import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";

import {
  Navbar,
  Footer
} from "./components";
import {
  Main
} from "./pages"

const themes = {
  darkTheme: createTheme(
    {
      palette: {
        mode: "dark"
      }
    }
  ),

  lightTheme: createTheme(
    {
      palette: {
        mode: "light"
      }
    }
  )
}

function App() {
  const theme = localStorage.getItem("theme") === "light" ? themes.lightTheme : themes.darkTheme

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />

        <Container style={{ marginTop: 96, marginBottom: 64 }}>
          <Main />
        </Container>

        <Footer />
      </ThemeProvider>
    </>
  )
}

export default App
