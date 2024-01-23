import {
  CircularProgress,
  Fab,
  Slide
} from "@mui/material"
import { Save } from "@mui/icons-material"
import type { CSSProperties } from "react"

type SaveFABPropsOnClick = {
  submit?: false
  onClick: () => void
}

type SaveFABPropsOnSubmit = {
  submit: true
  onClick?: undefined
}

export type SaveFABProps = (SaveFABPropsOnClick | SaveFABPropsOnSubmit) & {
  disabled?: boolean
  loading?: boolean
}

export const SaveFAB = (props: SaveFABProps) => {
  const {
    submit,
    onClick,
    disabled,
    loading,
  } = props

  const fabStyle: CSSProperties = {
    position: "fixed",
    bottom: 16,
    right: 16
  }

  return (
    <Slide
      direction="up"
      in
    >
      <Fab
        color="primary"
        sx={fabStyle}
        disabled={loading || disabled}
        type={submit ? "submit" : "button"}
        onClick={onClick}
      >
        {
          !loading
            ? <Save />
            : <CircularProgress
              size={20}
              color="inherit"
            />
        }
      </Fab>
    </Slide>
  )
}
