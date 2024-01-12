import { Button, Stack, Typography } from "@mui/material"

import type {
  Track,
  NewTrackFieldsToOmit
} from "../../types"
import { TrackCard } from "./TrackCard"

type RawTrack = Omit<Track, NewTrackFieldsToOmit>

export type TracksManagerProps = {
  tracks: Array<RawTrack>,
  addTrack: () => void,
  handleTrackChange: (id: number, trackData: RawTrack) => void,
  removeTrack: (id: number) => void
}

export const TracksManager = (props: TracksManagerProps) => {
  const {
    tracks,
    addTrack,
    handleTrackChange,
    removeTrack
  } = props

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        padding={2}
      >
        <Typography
          variant="h5"
          component="h3"
        >
          Faixas
        </Typography>

        <Button
          variant="contained"
          onClick={addTrack}
        >
          Adicionar faixa
        </Button>
      </Stack>

      {
        tracks.map(
          track => <TrackCard
            key={track.id}
            track={track}
            handleTrackChange={handleTrackChange}
            removeTrack={removeTrack}
          />
        )
      }
    </>
  )
}
