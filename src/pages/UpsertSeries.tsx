import {
  Box,
  CircularProgress
} from "@mui/material"
import {
  type FormEvent,
  type SyntheticEvent,
  useEffect,
  useState
} from "react"
import { useParams } from "react-router-dom"

import {
  AdminPanelUpsertSeriesForm,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import { NotFound } from "../pages"
import {
  PaginationBuilder,
  type Season,
  type Series,
  SeriesBuilder,
  type Tag,
} from "../types"
import { API_URL } from "../settings"

export type UpsertSeriesParams = Record<"id", string>

export const UpsertSeries = () => {
  if (!localStorage.getItem("token") || localStorage.getItem("type") !== "ADMIN")
    return <NotFound />

  const seriesId = Number(useParams<UpsertSeriesParams>().id)
  if (Number.isNaN(seriesId) || seriesId < 0)
    return <NotFound />

  const [shouldRenderTable, setShouldRenderTable] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [areSeasonsLoading, setAreSeasonsLoading] = useState(false)
  const [areTagsLoading, setAreTagsLoading] = useState(true)
  const [series, setSeries] = useState<Series | undefined>(undefined)
  const [seasons, setSeasons] = useState<Array<Season>>([])
  const [tags, setTags] = useState<Array<Tag>>([])
  const [seriesTags, setSeriesTags] = useState<Array<Tag["id"]>>([])
  const [tagSearch, setTagSearch] = useState("")
  const [tagSearchTimer, setTagSearchTimer] = useState<number | null>(null)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string>>()
  const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false)

  useEffect(
    () => {
      if (seriesId > 0) {
        setIsRequestLoading(true)

        fetch(`${API_URL}/series/get/${seriesId}`)
          .then(handleGetFetchResponse)
          .catch(console.error)
          .finally(() => setIsRequestLoading(false))
      } else
        setShouldRenderTable(true)

      fetch(`${API_URL}/tag/all?page=1&quantity=50&orderColumn=name&orderBy=asc`)
        .then(handleTagsResponse)
        .catch(console.error)
        .finally(() => setAreTagsLoading(false))
    },
    []
  )

  useEffect(
    () => {
      setAreTagsLoading(false)
      const timeInMillisecondsToWaitBeforeSearching = 300

      if (tagSearchTimer)
        clearTimeout(tagSearchTimer)

      const newTagSearchTimer = setTimeout(
        () => {
          setAreTagsLoading(true)

          fetch(
            `${API_URL}/tag/all?page=1&quantity=50&orderColumn=name&orderBy=asc${tagSearch.length > 0 ? `&search=${tagSearch}` : ""}`
          )
            .then(handleTagsResponse)
            .catch(console.error)
            .finally(() => setAreTagsLoading(false))
        },
        timeInMillisecondsToWaitBeforeSearching
      )

      setTagSearchTimer(newTagSearchTimer)
    },
    [tagSearch]
  )

  useEffect(
    () => {
      if (!series)
        return

      setAreSeasonsLoading(true)

      const url = new URL(`${API_URL}/season/all`, window.location.origin)
      url.searchParams.set("seriesId", String(series.id))
      url.searchParams.set("orderColumn", "position")
      url.searchParams.set("orderBy", "asc")

      const stringUrl = url.toString()
      fetch(stringUrl)
        .then(handleGetSeasonsResponse)
        .catch(console.error)
        .finally(() => setAreSeasonsLoading(false))
    },

    [series]
  )

  const handleGetSeasonsResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok)
      return

    const builtPaginatedSeasons = new PaginationBuilder<Season>(data)
    setSeasons(builtPaginatedSeasons.data)
  }

  const handleTagsResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok)
      return setTags([])

    const builtPaginatedTags = new PaginationBuilder<Tag>(data)
    setTags(builtPaginatedTags.data)
  }

  const handleGetFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)
      setShouldRenderTable(true)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtSeries = new SeriesBuilder(data)
    setSeries(builtSeries)
    setSeriesTags(builtSeries.seriesTags.map(({ tag }) => tag.id))
    setShouldRenderTable(true)
  }

  const handleUpsertFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)
      if (data.reason)
        setReasons(data.reason)

      return
    }

    setWasUpsertSuccessful(true)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRequestLoading(true)

    const mainNameInput = event.currentTarget.elements.namedItem("mainName") as HTMLInputElement | null
    if (!mainNameInput)
      return

    const mainNameLanguageInput = event.currentTarget.elements.namedItem("mainNameLanguage") as HTMLInputElement | null
    if (!mainNameLanguageInput)
      return

    const alternativeNameInput = event.currentTarget.elements.namedItem("alternativeName") as HTMLInputElement | null
    if (!alternativeNameInput)
      return

    const descriptionInput = event.currentTarget.elements.namedItem("description") as HTMLInputElement | null
    if (!descriptionInput)
      return

    const imageAddressInput = event.currentTarget.elements.namedItem("imageAddress") as HTMLInputElement | null
    if (!imageAddressInput)
      return

    const upsertSeriesPayload = {
      mainName: mainNameInput.value,
      mainNameLanguage: mainNameLanguageInput.value,
      alternativeName: alternativeNameInput.value || null,
      description: descriptionInput.value || null,
      imageAddress: imageAddressInput.value || null,
      tags: seriesTags,
      seasonsOrder: seasons.map(
        (season, index) => {
          return {
            id: season.id,
            position: index + 1
          }
        }
      )
    }

    if (seriesId > 0) {
      fetch(
        `${API_URL}/series/update/${seriesId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(upsertSeriesPayload)
        }
      )
        .then(handleUpsertFetchResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))

      return
    }

    fetch(
      `${API_URL}/series/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(upsertSeriesPayload)
      }
    )
      .then(handleUpsertFetchResponse)
      .catch(console.error)
      .finally(() => setIsRequestLoading(false))
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)

    if (statusCode === 404)
      window.location.href = "/admin/series"
  }

  const handleSuccessCardClose = () => {
    setWasUpsertSuccessful(false)
    window.location.href = "/admin/series"
  }

  const handleTagsChange = (
    _event: SyntheticEvent,
    tags: Array<Tag>
  ) => {
    setSeriesTags(tags.map(tag => tag.id))
  }

  const handleTagSearch = (
    _event: SyntheticEvent,
    value: string
  ) => {
    setTagSearch(value)
  }

  const handleSeasonsChange = (seasons: Array<Season>) => {
    setSeasons(seasons)
  }

  return (
    <>
      {
        shouldRenderTable
          ? <AdminPanelUpsertSeriesForm
            series={series}
            tags={tags}
            seasons={seasons}
            isRequestLoading={isRequestLoading}
            areTagsLoading={areTagsLoading}
            areSeasonsLoading={areSeasonsLoading}
            handleSubmit={handleSubmit}
            handleTagsChange={handleTagsChange}
            handleTagSearch={handleTagSearch}
            handleSeasonsChange={handleSeasonsChange}
          />
          : <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
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
        message={seriesId > 0 ? "Série editada com sucesso!" : "Série cadastrada com sucesso!"}
        isOpen={wasUpsertSuccessful}
        handleClose={handleSuccessCardClose}
      />
    </>
  )
}
