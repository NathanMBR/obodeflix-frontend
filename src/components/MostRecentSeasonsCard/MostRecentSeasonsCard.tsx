import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material"
import { ImageNotSupported } from "@mui/icons-material"
import type { CSSProperties } from "react"

import type { Season } from "../../types"

export interface MostRecentSeasonsCardProps {
  season: Season
  xs: number
  sx?: CSSProperties
}

const imageStyle: CSSProperties = {
  width: "220px",
  height: "320px"
}

const noImageStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  width: "220px",
  height: "320px"
}

export const MostRecentSeasonsCard = (props: MostRecentSeasonsCardProps) => {
  const {
    season,
    xs,
    sx
  } = props

  const generalStyle: CSSProperties = {
    display: "flex",
    ...sx
  }

  return (
    <Grid item
      xs={xs}
      sx={generalStyle}
    >
        <Paper
          elevation={12}
          sx={{ display: generalStyle.display }}
        >
          <Card>
            <CardActionArea
              style={{ height: "100%" }}
              LinkComponent="a"
              href={`/seasons/${season.id}`}
            >
              {
                season.imageAddress
                  ? <CardMedia
                    component="img"
                    src={season.imageAddress}
                    sx={imageStyle}
                  />
                  : <>
                    <Stack
                      direction="column"
                      sx={noImageStyle}
                    >
                      <ImageNotSupported />
                      <Typography variant="subtitle2">
                        Imagem indisponível
                      </Typography>
                    </Stack>
                  </>
              }

              <Divider />

              <CardContent>
                <Typography
                  variant="subtitle2"
                  component="h3"
                  textAlign="center"
                >
                  {season.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Paper>
    </Grid>
  )
}
