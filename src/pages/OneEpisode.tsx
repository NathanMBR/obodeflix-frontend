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
  EditFAB,
  EpisodeInfo,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  type ReplyProps
} from "../components"
import {
  type Episode,
  EpisodeBuilder
} from "../types"
import { CommentsList } from "../layouts"
import { NotFound } from "../pages"
import { API_URL } from "../settings"

export type OneEpisodeParams = Record<"id", string>

export const OneEpisode = () => {
  const episodeId = Number(useParams<OneEpisodeParams>().id)

  if (Number.isNaN(episodeId) || episodeId <= 0)
    return <NotFound />

  const commentsListReplyReference: ReplyProps["reference"] = {
    key: "episodeId",
    value: episodeId
  }

  const [episode, setEpisode] = useState<Episode | undefined>(undefined)

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string>>()

  const userToken = localStorage.getItem("token")
  const userType = localStorage.getItem("type")
  const showEditFAB =
    !!userToken &&
    userType === "ADMIN" &&
    !isRequestLoading &&
    !!episode

  const handleEpisodeFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtEpisode = new EpisodeBuilder(data)
    setEpisode(builtEpisode)
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)
    history.back()
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetch(`${API_URL}/episode/get/${episodeId}`)
        .then(handleEpisodeFetchResponse)
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
            <EpisodeInfo episode={episode} />

            {
              episode
                ? <CommentsList
                  comments={episode.comments}
                  replyReference={commentsListReplyReference}
                  sx={{ marginTop: 8 }}
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

      <EditFAB
        href={`/admin/episodes/${episodeId}`}
        enabled={showEditFAB}
      />
    </>
  )
}
