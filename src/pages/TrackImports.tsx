import {
  type CSSProperties,
  useState,
  useEffect
} from "react"
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography
} from "@mui/material"

import {
  PaginationBuilder,
  type Season,
  type Episode,
  type NewTrackFieldsToOmit,
  type RawTrack,
  type Track,
  type TrackTypes
} from "../types"
import {
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard,
  TracksManager,
} from "../components"
import { API_URL } from "../settings"
import { NotFound } from "./NotFound"

export const TrackImports = () => {
  const userToken = localStorage.getItem("token")
  const hasPermissionToAccess = userToken && localStorage.getItem("type") === "ADMIN"
    if (!hasPermissionToAccess)
      return <NotFound />

  const [areSeasonsLoading, setAreSeasonsLoading] = useState(false)
  const [areEpisodesLoading, setAreEpisodesLoading] = useState(false)
  const [areTracksLoading, setAreTracksLoading] = useState(false)
  const [isUpdatingSeasonTracks, setIsUpdatingSeasonTracks] = useState(false)
  const [seasons, setSeasons] = useState<Array<Season>>([])
  const [episodes, setEpisodes] = useState<Array<Episode>>([])
  const [tracks, setTracks] = useState<Array<Omit<Track, NewTrackFieldsToOmit>>>([])
  const [seasonsSearch, setSeasonsSearch] = useState("")
  const [episodesSearch, setEpisodesSearch] = useState("")
  const [chosenSeason, setChosenSeason] = useState<Season | null>(null)
  const [chosenEpisodeId, setChosenEpisodeId] = useState<Episode["id"] | null>(null)
  const [seasonsSearchTimer, setSeasonsSearchTimer] = useState<number | null>(null)
  const [episodesSearchTimer, setEpisodesSearchTimer] = useState<number | null>(null)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined)
  const [wasImportSuccessful, setWasImportSuccessful] = useState(false)

  // search seasons
  useEffect(
    () => {
      setEpisodes([])
      setChosenEpisodeId(null)
      setAreSeasonsLoading(true)

      const timeInMillisecondsToWaitBeforeSearching = 350

      const fetchSeasons = async () => {
        const url = new URL(`${API_URL}/season/all`, window.location.origin)
        url.searchParams.append("page", "1")
        url.searchParams.append("quantity", "50")
        url.searchParams.append("orderColumn", "name")
        url.searchParams.append("orderBy", "asc")

        if (seasonsSearch.length > 0)
          url.searchParams.append("search", seasonsSearch)

        const urlString = url.toString()

        const response = await fetch(urlString)
        const data = await response.json()

        if (!response.ok) {
          if (data.reason)
            setReasons(data.reason)

          setStatusCode(response.status as ErrorCardStatusCodeProp)
          return
        }

        const builtPaginatedSeasons = new PaginationBuilder<Season>(data)
        setSeasons(builtPaginatedSeasons.data)
      }

      if (seasonsSearchTimer)
        clearTimeout(seasonsSearchTimer)

      const newSeasonsSearchTimer = setTimeout(
        () => {
          fetchSeasons()
            .catch(console.error)
            .finally(() => setAreSeasonsLoading(false))
        },
        timeInMillisecondsToWaitBeforeSearching
      )

      setSeasonsSearchTimer(newSeasonsSearchTimer)
    },
    [
      seasonsSearch
    ]
  )

  // search episodes
  useEffect(
    () => {
      if (!chosenSeason)
        return

      setAreEpisodesLoading(true)

      const timeInMillisecondsToWaitBeforeSearching = 350

      const fetchEpisodes = async () => {
        const url = new URL(`${API_URL}/episode/all`, window.location.origin)
        url.searchParams.append("page", "1")
        url.searchParams.append("quantity", "50")
        url.searchParams.append("orderColumn", "id")
        url.searchParams.append("orderBy", "asc")
        url.searchParams.append("seasonId", String(chosenSeason.id))

        if (episodesSearch.length > 0)
          url.searchParams.append("search", seasonsSearch)

        const urlString = url.toString()

        const response = await fetch(urlString)
        const data = await response.json()

        if (!response.ok) {
          if (data.reason)
            setReasons(data.reason)

          setStatusCode(response.status as ErrorCardStatusCodeProp)
          return
        }

        const builtPaginatedEpisodes = new PaginationBuilder<Episode>(data)
        setEpisodes(builtPaginatedEpisodes.data)
      }

      if (episodesSearchTimer)
        clearTimeout(episodesSearchTimer)

      const newEpisodesSearchTimer = setTimeout(
        () => {
          fetchEpisodes()
            .catch(console.error)
            .finally(() => setAreEpisodesLoading(false))
        },
        timeInMillisecondsToWaitBeforeSearching
      )

      setEpisodesSearchTimer(newEpisodesSearchTimer)
    },
    [
      episodesSearch,
      chosenSeason
    ]
  )

  // get episode tracks
  useEffect(
    () => {
      if (!chosenEpisodeId)
        return

      setAreTracksLoading(true)

      const fetchTracks = async () => {
        const url = new URL(`${API_URL}/episode/tracks/${chosenEpisodeId}`, window.location.origin)
        const urlString = url.toString()
        const response = await fetch(
          urlString,

          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          if (data.reason)
            setReasons(data.reason)

          setStatusCode(response.status as ErrorCardStatusCodeProp)
          return
        }

        const rawTracks = data as Array<RawTrack>
        const builtTracks = rawTracks
          .filter(rawTrack => rawTrack.type !== "VIDEO")
          .map(
            rawTrack => {
              const randomId = Math.round(Math.random() * 1_000_000)
              const track = {
                ...rawTrack,
                id: randomId,
                type: rawTrack.type as TrackTypes
              }

              return track
            }
          )

        setTracks(builtTracks)
      }

      fetchTracks()
        .catch(console.error)
        .finally(() => setAreTracksLoading(false))
    },
    [
      chosenEpisodeId
    ]
  )

  const updateSeasonTracks = async () => {
    if (!chosenSeason)
      return

    setIsUpdatingSeasonTracks(true)

    const url = new URL(`${API_URL}/season/update/${chosenSeason.id}`, window.location.origin)
    const urlString = url.toString()
    const body = {
      ...chosenSeason,
      tracks
    }

    const response = await fetch(
      urlString,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify(body)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (data.reason)
        setReasons(data.reason)

      setStatusCode(response.status as ErrorCardStatusCodeProp)
      setIsUpdatingSeasonTracks(false)
      return
    }

    setIsUpdatingSeasonTracks(false)
    setWasImportSuccessful(true)
  }

  const loadingStyle: CSSProperties = {
    textAlign: "center",
    width: "100%",
    margin: "16px 0"
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        mb={1}
      >
        Importar Faixas
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Typography
        variant="h5"
        component="h3"
        mb={2}
      >
        Passo 1: Selecionar temporada
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={seasons}
            noOptionsText={areSeasonsLoading ? "Carregando..." : "Não há temporadas disponíveis."}
            getOptionLabel={season => season.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_event, season) => setChosenSeason(season)}
            onInputChange={(_event, seasonName) => setSeasonsSearch(seasonName)}
            defaultValue={null}
            renderInput={
              params => <TextField
                {...params}
                label="Temporada"
                variant="outlined"
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
              />
            }
          />
        </Grid>
      </Grid>

      {
        !chosenSeason
          ? null
          : <>
            <Typography
              variant="h5"
              component="h3"
              mt={4}
              mb={2}
            >
              Passo 2: Selecionar episódio de referência
            </Typography>

            <Grid item xs={12}>
              <Autocomplete
                options={episodes}
                noOptionsText={areEpisodesLoading ? "Carregando..." : "Não há episódios disponíveis."}
                getOptionLabel={episode => episode.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_event, episode) => setChosenEpisodeId(episode?.id || null)}
                onInputChange={(_event, episodeName) => setEpisodesSearch(episodeName)}
                defaultValue={null}
                renderInput={
                  params => <TextField
                    {...params}
                    label="Temporada"
                    variant="outlined"
                    InputProps={
                      {
                        ...params.InputProps,
                        endAdornment: <>
                          {
                            areEpisodesLoading
                              ? <CircularProgress size={20} />
                              : null
                          }
                          {
                            params.InputProps.endAdornment
                          }
                        </>
                      }
                    }
                  />
                }
              />
            </Grid>
          </>
      }

      {
        !chosenSeason || !chosenEpisodeId
          ? null
          : <>
            <Typography
              variant="h5"
              component="h3"
              mt={4}
              mb={2}
            >
              Passo 3: Editar faixas
            </Typography>

            {
              areTracksLoading
                ? <Box sx={loadingStyle} >
                  <CircularProgress />
                </Box>
                : <>
                  <TracksManager
                    tracks={tracks}
                    handleTracksChange={changedTracks => setTracks(changedTracks)}
                  />
                </>
            }

            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={isUpdatingSeasonTracks}
                onClick={updateSeasonTracks}
                fullWidth
              >
                {
                  isUpdatingSeasonTracks
                    ? <CircularProgress size={24} />
                    : "Importar faixas"
                }
              </Button>
            </Grid>
          </>
      }

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        reasons={reasons}
        handleClose={() => {
          setStatusCode(null)
          setReasons(undefined)
        }}
      />

      <SuccessCard
        message="Faixas importadas com sucesso!"
        isOpen={wasImportSuccessful}
        handleClose={() => {
          setWasImportSuccessful(false)
          window.history.back()
        }}
      />
    </>
  )
}
