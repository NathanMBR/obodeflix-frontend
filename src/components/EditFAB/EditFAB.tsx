import {
  Fab,
  Slide
} from "@mui/material"
import { Edit } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import type { CSSProperties } from "react"

export type EditFABProps = {
  href: string
  enabled?: boolean
}

export const EditFAB = (props: EditFABProps) => {
  const {
    href,
    enabled
  } = props

  const navigate = useNavigate()

  const fabStyle: CSSProperties = {
    position: "fixed",
    bottom: 16,
    right: 16
  }

  return (
    <Slide
      direction="up"
      in={enabled}
    >
      <Fab
        color="primary"
        sx={fabStyle}
        onClick={() => navigate(href)}
      >
        <Edit />
      </Fab>
    </Slide>
  )
}
