import {
  Box,
  Typography
} from "@mui/material"
import type { CSSProperties } from "react"

import type { Theme } from "../../types"

export interface FooterProps {
  theme: Theme
}

export const Footer = (props: FooterProps) => {
  const { theme } = props

  const footerStyle: CSSProperties = {
    backgroundColor: theme === "light"
      ? "primary.main"
      : "action.hover"
  }

  return (
    <Box sx={footerStyle} textAlign="center">
      <Typography variant="body1" color="white" sx={{ padding: 4 }}>OBODE &copy {new Date().getFullYear()}</Typography>
    </Box>
  )
}
