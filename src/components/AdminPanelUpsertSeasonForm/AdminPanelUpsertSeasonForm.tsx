import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material"
import {
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react"

import {
  DefaultHeader,
  SaveFAB,
  TracksManager
} from "../../components"
import type {
  Season,
  SeasonTypes,
  Series,
  Track,
  NewTrackFieldsToOmit
} from "../../types"

export interface AdminPanelUpsertSeasonFormProps {
  season?: Season
  series: Array<Series>
  tracks: Array<Omit<Track, NewTrackFieldsToOmit>>
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  isRequestLoading: boolean
  areSeriesLoading: boolean
  showSeriesAlternativeNames: boolean
  handleToggleSeriesNames: () => void
  handleToggleExcludeFromRecent: (event: ChangeEvent<HTMLInputElement>) => void
  handleSeriesChange: (_event: SyntheticEvent, series: Series | null) => void
  handleSeriesSearch: (_event: SyntheticEvent, seriesName: string) => void
  handleTracksChange: (tracks: Array<Omit<Track, NewTrackFieldsToOmit>>) => void
}

export const AdminPanelUpsertSeasonForm = (props: AdminPanelUpsertSeasonFormProps) => {
  const {
    season,
    series,
    tracks,
    handleSubmit,
    isRequestLoading,
    areSeriesLoading,
    showSeriesAlternativeNames,
    handleToggleSeriesNames,
    handleToggleExcludeFromRecent,
    handleSeriesChange,
    handleSeriesSearch,
    handleTracksChange
  } = props

  type SeasonTypeInputValue = SeasonTypes | ""

  const [name, setName] = useState("")
  const [seasonType, setSeasonType] = useState<SeasonTypeInputValue>("")
  const [position, setPosition] = useState(1)
  const [seriesId, setSeriesId] = useState<number | null>(null)
  const [imageAddress, setImageAddress] = useState("")
  const [description, setDescription] = useState("")

  useEffect(
    () => {
      if (!season)
        return

      setName(season.name)
      setPosition(season.position)
      setSeasonType(season.type)
      setSeriesId(season.seriesId)
      setImageAddress(season.imageAddress || "")
      setDescription(season.description || "")
    },
    [season]
  )

  const handleSeasonTypeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newSeasonType = event.target.value as SeasonTypeInputValue

    setSeasonType(newSeasonType)
  }

  const importSeriesData = () => {
    if (!seriesId)
      return

    const chosenSeries = series.find(oneSeries => oneSeries.id === seriesId)
    if (!chosenSeries)
      return console.error("Expected chosen series")

    setName(chosenSeries.mainName)
    setDescription(chosenSeries.description || "")
    setImageAddress(chosenSeries.imageAddress || "")
    setPosition(1)
  }

  return (
    <>
      <DefaultHeader style={{ textAlign: "center" }}>
        {
          season
            ? "Editar temporada"
            : "Cadastrar temporada"
        }
      </DefaultHeader>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={8.5}>
            <TextField
              name="name"
              label="Nome"
              value={name}
              onChange={event => setName(event.target.value)}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              select
              name="type"
              label="Tipo"
              onChange={handleSeasonTypeChange}
              SelectProps={{ value: seasonType }}
              required
              fullWidth
            >
              <MenuItem value="TV">TV</MenuItem>
              <MenuItem value="MOVIE">Filme</MenuItem>
              <MenuItem value="OTHER">Outro</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={1.5}>
            <TextField
              type="number"
              name="position"
              label="Posição"
              value={position}
              onChange={event => setPosition(Number(event.target.value) || 1)}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={8.5}>
            <Autocomplete
              options={series}
              getOptionLabel={
                series => showSeriesAlternativeNames && series.alternativeName
                  ? series.alternativeName
                  : series.mainName
              }
              isOptionEqualToValue={
                (option, value) => option.id === value.id
              }
              onChange={(_event, series) => {
                handleSeriesChange(_event, series)

                setSeriesId(series?.id || null)
              }}
              onInputChange={handleSeriesSearch}
              defaultValue={season?.series || null}
              renderInput={
                params => <TextField
                  {...params}
                  InputProps={
                    {
                      ...params.InputProps,
                      endAdornment: <>
                        {
                          areSeriesLoading
                            ? <CircularProgress size={20} />
                            : null
                        }
                        {
                          params.InputProps.endAdornment
                        }
                      </>
                    }
                  }
                  label="Série relacionada"
                  variant="outlined"
                />
              }
              noOptionsText={
                areSeriesLoading
                  ? "Carregando..."
                  : "Não há séries disponíveis."
              }
            />
          </Grid>

          <Grid item xs={2}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch onClick={handleToggleSeriesNames} />
                }
                label="Exibir nomes alternativos"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={1.5}>
            <Button
              variant="contained"
              size="small"
              disabled={!seriesId}
              onClick={importSeriesData}
              fullWidth
            >
              Usar dados <br /> da série
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="imageAddress"
              label="Link da imagem"
              value={imageAddress}
              onChange={event => setImageAddress(event.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Descrição"
              minRows={6}
              value={description}
              onChange={event => setDescription(event.target.value)}
              multiline
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onClick={handleToggleExcludeFromRecent as any}
                    defaultChecked={season?.excludeFromMostRecent}
                    name="exclude-from-most-recent"
                  />
                }
                label="Ocultar temporada na lista de mais recentes"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 1, mt: 2 }} />

            <TracksManager
              tracks={tracks}
              handleTracksChange={handleTracksChange}
            />
          </Grid>
        </Grid>

        {
          seriesId
            ? <input
              value={seriesId}
              type="hidden"
              name="seriesId"
            />
            : null
        }

        <SaveFAB
          loading={isRequestLoading}
          submit
        />
      </form>
    </>
  )
}
