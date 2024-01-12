import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import {
  useState,
  useEffect,
  type CSSProperties
} from "react";
import { Delete } from "@mui/icons-material";

import type {
  Track,
  TrackTypes,
  NewTrackFieldsToOmit
} from "../../types";

export type TrackCardProps = {
  track: Omit<Track, NewTrackFieldsToOmit>;
  handleTrackChange: (index: number, trackData: Omit<Track, NewTrackFieldsToOmit>) => void;
  removeTrack: (index: number) => void
}

export const TrackCard = (props: TrackCardProps) => {
  const {
    track,
    handleTrackChange,
    removeTrack
  } = props;

  interface TrackTypeOption {
    type: TrackTypes;
    label: string;
  }
  const trackTypeOptions: Array<TrackTypeOption> = [
    {
      type: "AUDIO",
      label: "Áudio"
    },

    {
      type: "SUBTITLE",
      label: "Legenda"
    }
  ]

  const [trackTitle, setTrackTitle] = useState(track.title);
  const [trackType, setTrackType] = useState(track.type);
  const [trackIndex, setTrackIndex] = useState(track.index);

  useEffect(
    () => {
      handleTrackChange(
        track.id,

        {
          ...track,
          title: trackTitle,
          type: trackType,
          index: trackIndex
        }
      )
    },

    [
      trackTitle,
      trackType,
      trackIndex
    ]
  );

  const boxStyle: CSSProperties = {
    marginBottom: 4,
    padding: 2
  }

  const fieldsStyle: CSSProperties = {
    marginBottom: 2
  }

  return (
    <Paper elevation={6}>
      <Box sx={boxStyle}>
        <TextField
          name="track-title"
          label="Título da faixa"
          value={trackTitle}
          sx={fieldsStyle}
          onChange={event => setTrackTitle(event.target.value)}
          required
          fullWidth
        />

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Box width="50%">
            <Stack
              gap={2}
              direction="row"
            >
              <FormControl fullWidth>
                <InputLabel id="track-type">Tipo da faixa</InputLabel>
                <Select
                  labelId="track-type"
                  label="Tipo da faixa"
                  defaultValue={trackTypeOptions[0].type}
                  onChange={event => setTrackType(event.target.value as TrackTypes)}
                  fullWidth
                >
                  {
                    trackTypeOptions.map(
                      option => <MenuItem
                        key={option.type}
                        value={option.type}
                      >
                        {option.label}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>

              <TextField
                name="track-index"
                label="Índice da faixa"
                type="number"
                value={trackIndex}
                inputProps={{ min: 0 }}
                onChange={event => setTrackIndex(Number(event.target.value) || 0)}
                required
                fullWidth
              />
            </Stack>
          </Box>

          <Box sx={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}>
            <Tooltip
              title="Remover faixa"
              placement="left"
            >
              <IconButton onClick={() => removeTrack(track.id)}>
                <Delete sx={{ color: "#777" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
