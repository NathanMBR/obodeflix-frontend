import {
  Button,
  Divider,
  Fade,
  IconButton,
  Link as MUILink,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"
import { useState } from "react"
import { Visibility } from "@mui/icons-material"
import { Link as ReactRouterLink } from "react-router-dom"

import type { Episode } from "../../types"
import { API_URL } from "../../settings"

export interface EpisodeInfoProps {
  episode?: Episode
}

export const EpisodeInfo = (props: EpisodeInfoProps) => {
  const { episode } = props

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  if (!episode)
    return null

  const episodeDownloadLink = `${API_URL}/episode/watch/${episode.id}`

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
      >
        <Typography
          variant="h4"
          component="h2"
        >
          Assistir {episode.name}
        </Typography>

        <Tooltip title="Ver temporada relacionada">
          <ReactRouterLink to={`/seasons/${episode.seasonId}`}>
            <IconButton>
              <Visibility />
            </IconButton>
          </ReactRouterLink>
        </Tooltip>
      </Stack>

      <Divider />

      <Stack
        direction="row"
        spacing={2}
        mt={2}
        mb={2}
      >
        <Button
          variant="contained"
          onClick={() => {
            const linkToCopy = new URL(episodeDownloadLink, window.location.origin).toString()

            navigator.clipboard.writeText(linkToCopy)
            setIsSnackbarOpen(true)
          }}
        >
          Copiar link
        </Button>


        <MUILink href={episodeDownloadLink}>
          <Button variant="contained">Baixar episódio</Button>
        </MUILink>
      </Stack>


      <Typography variant="body1">
        Para assistir ao episódio sem precisar baixá-lo, siga os seguintes passos:
      </Typography>

      <ol>
        <li>Copie o link do episódio clicando no botão "Copiar link" acima</li>
        <li>Baixe e instale o VLC Media Player no seu computador</li>
        <li>Abra o VLC e procure a aba "Mídia" ou "Media"</li>
        <li>Vá até a opção "Abrir Transmissão de Rede" ou "Open Network Stream"</li>
        <li>Insira o link e clique em "Play"</li>
      </ol>

      <img
        src="/tutorial.png"
        alt="Indicação da opção no VLC"
        title="Indicação da opção no VLC"
      />

      <Snackbar
        message="Link copiado!"
        autoHideDuration={2500}
        open={isSnackbarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setIsSnackbarOpen(false)}
        TransitionComponent={Fade}
      />
    </>
  )
}
