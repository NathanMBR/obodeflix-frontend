import { Button, Stack, Typography } from "@mui/material"

import type {
  Track,
  NewTrackFieldsToOmit
} from "../../types"
import { TrackCard } from "./TrackCard"

type RawTrack = Omit<Track, NewTrackFieldsToOmit>

export type TracksManagerProps = {
  tracks: Array<RawTrack>,
  handleTracksChange: (rawTracks: Array<RawTrack>) => void,
}

export const TracksManager = (props: TracksManagerProps) => {
  const {
    tracks,
    handleTracksChange
  } = props

  const addTrack = () => handleTracksChange([
    ...tracks,
    {
      id: Math.round(Math.random() * 1_000_000),
      title: "Nova faixa",
      type: "AUDIO",
      index: 0
    }
  ])

  const updateTrack = (trackId: number, trackData: RawTrack) => {
    const updatedTracks = [...tracks]
    const indexToUpdate = tracks.findIndex(track => track.id === trackId)
    updatedTracks[indexToUpdate] = trackData

    handleTracksChange(updatedTracks)
  }

  const removeTrack = (trackId: number) => {
    const updatedTracks = tracks.filter(track => track.id !== trackId)

    handleTracksChange(updatedTracks)
  }

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
            handleTrackChange={updateTrack}
            removeTrack={removeTrack}
          />
        )
      }
    </>
  )
}
