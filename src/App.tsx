import {
  createTheme,
  ThemeProvider
} from "@mui/material/styles"
import {
  Container,
  CssBaseline
} from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState } from "react";

import {
  Navbar,
  Footer
} from "./components";
import {
  Main,
  SignUp,
  Login
} from "./pages"

import "./App.css"

const themes = {
  light: createTheme(
    {
      palette: {
        mode: "light"
      }
    }
  ),

  dark: createTheme(
    {
      palette: {
        mode: "dark"
      }
    }
  )
}

type Theme = "light" | "dark";

function App() {
  const [theme, setTheme] = useState<Theme>(localStorage.getItem("theme") as Theme || "light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <BrowserRouter>
          <CssBaseline />
          <Navbar handleThemeChange={handleThemeChange} />

          <Container style={{ marginTop: 96, marginBottom: 64 }}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>

          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
