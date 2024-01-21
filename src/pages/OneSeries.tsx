import {
  Box,
  CircularProgress
} from "@mui/material"
import {
  type CSSProperties,
  useEffect,
  useState
} from "react"
import { useParams } from "react-router-dom"

import {
  ErrorCard,
  type ErrorCardStatusCodeProp,
  type ReplyProps,
  SeriesInfo
} from "../components"
import {
  type Season,
  type Series,
  SeriesBuilder,
  type Pagination,
  PaginationBuilder
} from "../types"
import { NotFound } from "../pages"
import { API_URL } from "../settings"
import { CommentsList } from "../layouts"

export type OneSeriesParams = Record<"id", string>

export const OneSeries = () => {
  const seriesId = Number(useParams<OneSeriesParams>().id)

  if (Number.isNaN(seriesId) || seriesId <= 0)
    return <NotFound />

  const commentsListReplyReference: ReplyProps["reference"] = {
    key: "seriesId",
    value: seriesId
  }

  const [series, setSeries] = useState<Series | undefined>(undefined)

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string>>()

  const [seriesSeasons, setSeriesSeasons] = useState<Pagination<Season> | null>(null)

  const handleSeasonsResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtPagination = new PaginationBuilder<Season>(data)
    setSeriesSeasons(builtPagination)
    console.log(builtPagination.data)
  }

  const handleFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtSeries = new SeriesBuilder(data)
    setSeries(builtSeries)

    fetch(`${API_URL}/season/all?seriesId=${seriesId}&orderColumn=position&orderBy=asc`)
      .then(handleSeasonsResponse)
      .catch(console.error)
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)
    window.location.href = "/series"
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetch(`${API_URL}/series/get/${seriesId}`)
        .then(handleFetchResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))
    },
    []
  )

  const loadingStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  return (
    <>
      {
        isRequestLoading
          ? <Box sx={loadingStyle}>
            <CircularProgress />
          </Box>
          : <>
            <SeriesInfo
              series={series}
              seasons={seriesSeasons?.data}
              sx={{ marginBottom: 4 }}
            />

            {
              series
                ? <CommentsList
                  comments={series.comments}
                  replyReference={commentsListReplyReference}
                />
                : null
            }
          </>
      }

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        reasons={reasons}
        handleClose={handleErrorCardClose}
      />
    </>
  )
}
