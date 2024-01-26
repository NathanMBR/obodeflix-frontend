import {
  type CSSProperties,
  type FormEvent,
  type SyntheticEvent,
  useEffect,
  useState
} from "react"
import {
  Box,
  CircularProgress
} from "@mui/material"
import { useParams } from "react-router-dom"

import {
  AdminPanelUpsertEpisodeForm,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import {
  PaginationBuilder,
  type Episode,
  EpisodeBuilder
} from "../types"
import { NotFound } from "../pages"
import { API_URL } from "../settings"

export type UpsertEpisodeParams = Record<"id", string>

export const UpsertEpisode = () => {
  const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const episodeId = Number(useParams<UpsertEpisodeParams>().id)
  if (Number.isNaN(episodeId) || episodeId < 0)
    return <NotFound />

  const [shouldRenderTable, setShouldRenderTable] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [areSeasonsLoading, setAreSeasonsLoading] = useState(true)
  const [episode, setEpisode] = useState<Episode>()
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined)
  const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false)
  const [seasonsSearch, setSeasonsSearch] = useState("")
  const [seasons, setSeasons] = useState<Array<Episode["season"]>>([])
  const [seasonsSearchTimer, setSeasonsSearchTimer] = useState<number | null>(null)
  const [_seasonId, setSeasonId] = useState<Episode["seasonId"] | null>(null)

  const managementScreenPath = "/admin/episodes"

  const notRenderedTableBoxStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const handleGetEpisodeFetchResponse = async (response: Response) => {
    try {
      const episodeData = await response.json()

      if (!response.ok) {
        setStatusCode(response.status as ErrorCardStatusCodeProp)

        if (episodeData.reason)
          setReasons(episodeData.reason)

        return
      }

      const builtEpisode = new EpisodeBuilder(episodeData)
      setEpisode(builtEpisode)
    } catch (error) {
      console.error(error)
    } finally {
      setShouldRenderTable(true)
    }
  }

  const handleUpsertEpisodeFetchResponse = async (response: Response) => {
    try {
      const episodeData = await response.json()

      if (!response.ok) {
        setStatusCode(response.status as ErrorCardStatusCodeProp)

        if (episodeData.reason)
          setReasons(episodeData.reason)

        return
      }

      setWasUpsertSuccessful(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpsertEpisodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRequestLoading(true)

    const nameInput = event
      .currentTarget
      .elements
      .namedItem("name") as HTMLInputElement | null

    if (!nameInput)
      return

    const seasonIdInput = event
      .currentTarget
      .elements
      .namedItem("seasonId") as HTMLInputElement | null

    if (!seasonIdInput)
      return

    const durationInput = event
      .currentTarget
      .elements
      .namedItem("duration") as HTMLInputElement | null

    if (!durationInput)
      return

    const pathInput = event
      .currentTarget
      .elements
      .namedItem("path") as HTMLInputElement | null

    if (!pathInput)
      return

    const positionInput = event
      .currentTarget
      .elements
      .namedItem("position") as HTMLInputElement | null

    if (!positionInput)
      return

    const upsertEpisodePayload = {
      name: nameInput.value,
      seasonId: Number(seasonIdInput.value),
      duration: Number(durationInput.value),
      path: pathInput.value,
      position: Number(positionInput.value)
    }

    if (episodeId > 0)
      return fetch(
        `${API_URL}/episode/update/${episodeId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(upsertEpisodePayload)
        }
      )
        .then(handleUpsertEpisodeFetchResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))

      return fetch(
        `${API_URL}/episode/create`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(upsertEpisodePayload)
        }
      )
        .then(handleUpsertEpisodeFetchResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)

    if (statusCode === 404)
      window.location.href = managementScreenPath
  }

  const handleSuccessCardClose = () => {
    setWasUpsertSuccessful(false)
    window.location.href = managementScreenPath
  }

  const handleSeasonsResponse = async (response: Response) => {
    try {
      const seasonsData = await response.json()

      if (!response.ok)
        return setSeasons([])

      const builtPaginatedSeasons = new PaginationBuilder<Episode["season"]>(seasonsData)
      setSeasons(builtPaginatedSeasons.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSeasonsSearch = (_event: SyntheticEvent, seasonName: string) => {
    setSeasonsSearch(seasonName)
  }

  const handleSeasonsChange = (_event: SyntheticEvent, season: Episode["season"] | null) => {
    setSeasonId(season?.id || null)
  }

  useEffect(
    () => {
      if (episodeId > 0) {
        setIsRequestLoading(true)

        fetch(`${API_URL}/episode/get/${episodeId}`)
          .then(handleGetEpisodeFetchResponse)
          .catch(console.error)
          .finally(() => setIsRequestLoading(false))
      } else
        setShouldRenderTable(true)

      fetch(`${API_URL}/season/all?page=1&quantity=50&orderColumn=name&orderBy=asc${seasonsSearch.length > 0 ? `&search=${seasonsSearch}` : ""}`)
        .then(handleSeasonsResponse)
        .catch(console.error)
        .finally(() => setAreSeasonsLoading(false))
    },
    []
  )

  useEffect(
    () => {
      setAreSeasonsLoading(true)
      const timeInMillisecondsToWaitBeforeSearching = 300

      if (seasonsSearchTimer)
        clearTimeout(seasonsSearchTimer)

      const newSeasonsSearchTimer = setTimeout(
        () => {
          fetch(
            `${API_URL}/season/all?page=1&quantity=50&orderColumn=name&orderBy=asc${seasonsSearch.length > 0 ? `&search=${seasonsSearch}` : ""}`
          )
            .then(handleSeasonsResponse)
            .catch(console.error)
            .finally(() => setAreSeasonsLoading(false))
        },
        timeInMillisecondsToWaitBeforeSearching
      )

      setSeasonsSearchTimer(newSeasonsSearchTimer)
    },

    [seasonsSearch]
  )

  return (
    <>
      {
        shouldRenderTable
          ? <AdminPanelUpsertEpisodeForm
            episode={episode}
            seasons={seasons}
            handleSubmit={handleUpsertEpisodeSubmit}
            handleSeasonSearch={handleSeasonsSearch}
            handleSeasonChange={handleSeasonsChange}
            isRequestLoading={isRequestLoading}
            areSeasonsLoading={areSeasonsLoading}
          />
          : <Box sx={notRenderedTableBoxStyle}>
            <CircularProgress />
          </Box>
      }

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        reasons={reasons}
        handleClose={handleErrorCardClose}
      />

      <SuccessCard
        message={episodeId > 0 ? "Episódio editado com sucesso!" : "Episódio criado com sucesso!"}
        isOpen={wasUpsertSuccessful}
        handleClose={handleSuccessCardClose}
      />
    </>
  )
}
