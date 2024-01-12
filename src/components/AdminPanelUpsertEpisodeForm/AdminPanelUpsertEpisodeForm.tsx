import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  TextFieldProps
} from "@mui/material";
import {
  FormEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from "react";

import { DefaultHeader } from "../../components";
import {
  Episode,
  Season
} from "../../types";

export interface AdminPanelUpsertEpisodeFormProps {
  episode?: Episode;
  seasons: Array<Season>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isRequestLoading: boolean;
  areSeasonsLoading: boolean;
  handleSeasonChange: (_event: SyntheticEvent, season: Season | null) => void;
  handleSeasonSearch: (_event: SyntheticEvent, seasonName: string) => void;
};

export const AdminPanelUpsertEpisodeForm = (props: AdminPanelUpsertEpisodeFormProps) => {
  const {
    episode,
    seasons,
    handleSubmit,
    isRequestLoading,
    areSeasonsLoading,
    handleSeasonChange,
    handleSeasonSearch
  } = props;

  const nameRef = useRef<TextFieldProps>();
  const [seasonId, setSeasonId] = useState<number | null>(null);
  const durationRef = useRef<TextFieldProps>();
  const pathRef = useRef<TextFieldProps>();
  const positionRef = useRef<TextFieldProps>();

  useEffect(
    () => {
      if (episode) {
        if (nameRef.current)
          nameRef.current.value = episode.name;

        if (episode.seasonId)
          setSeasonId(episode.seasonId);

        if (durationRef.current)
          durationRef.current.value = episode.duration;

        if (pathRef.current)
          pathRef.current.value = episode.path;

        if (positionRef.current)
          positionRef.current.value = episode.position;
      }
    },
    [episode]
  );

  return (
    <>
      <Paper elevation={12}>
        <Card>
          <CardContent>
            <DefaultHeader style={{ textAlign: "center" }}>
              {
                episode
                  ? "Editar episódio"
                  : "Cadastrar episódio"
              }
            </DefaultHeader>

            <form onSubmit={handleSubmit}>
              <Grid container
                spacing={2}
              >
                <Grid item
                  xs={10.5}
                >
                  <TextField
                    name="name"
                    label="Nome"
                    inputRef={nameRef}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item
                  xs={1.5}
                >
                  <TextField
                    type="number"
                    name="position"
                    label="Posição"
                    inputRef={positionRef}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item
                  xs={9.5}
                >
                  <Autocomplete
                    options={seasons}
                    getOptionLabel={season => season.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, season) => {
                      handleSeasonChange(event, season);

                      if (season)
                        setSeasonId(season.id);
                    }}
                    onInputChange={handleSeasonSearch}
                    defaultValue={episode?.season || null}
                    renderInput={
                      params => <TextField
                        {...params}
                        InputProps={
                          {
                            ...params.InputProps,
                            endAdornment: <>
                              {
                                areSeasonsLoading
                                  ? <CircularProgress size={20} />
                                  : null
                              }
                              {
                                params.InputProps.endAdornment
                              }
                            </>
                          }
                        }
                        label="Temporada relacionada"
                        variant="outlined"
                      />
                    }
                    noOptionsText={
                      areSeasonsLoading
                        ? "Carregando..."
                        : "Não há episódios disponíveis."
                    }
                  />
                </Grid>

                <Grid item
                  xs={2.5}
                >
                  <TextField
                    type="number"
                    name="duration"
                    label="Duração (em segundos)"
                    inputRef={durationRef}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item
                  xs={12}
                >
                  <TextField
                    name="path"
                    label="Caminho"
                    inputRef={pathRef}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item
                  xs={12}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isRequestLoading}
                    fullWidth
                  >
                    {
                      isRequestLoading
                        ? <CircularProgress size={20}/>
                        : "Salvar"
                    }
                  </Button>
                </Grid>
              </Grid>

              <input
                type="hidden"
                name="seasonId"
                value={seasonId || undefined}
              />
            </form>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};
