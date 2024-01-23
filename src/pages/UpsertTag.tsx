import {
  Box,
  CircularProgress
} from "@mui/material"
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useState
} from "react"
import { useParams } from "react-router-dom"

import {
  AdminPanelUpsertTagForm,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import {
  type Tag,
  TagBuilder
} from "../types"
import { NotFound } from "../pages"
import { API_URL } from "../settings"

export type UpsertTagParams = Record<"id", string>

export const UpsertTag = () => {
  const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const tagId = Number(useParams<UpsertTagParams>().id)
  if (Number.isNaN(tagId) || tagId < 0)
    return <NotFound />

  const [shouldRenderTable, setShouldRenderTable] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [tag, setTag] = useState<Tag | undefined>(undefined)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined)
  const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false)

  const managementScreenPath = "/admin/tags"

  const notRenderedTableBoxStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const handleGetFetchResponse = async (response: Response) => {
    try {
      const data = await response.json()

      if (!response.ok) {
        setStatusCode(response.status as ErrorCardStatusCodeProp)

        if (data.reason)
          setReasons(data.reason)

        return
      }

      const builtTag = new TagBuilder(data)
      setTag(builtTag)
    } catch (error) {
      console.error(error)
    } finally {
      setShouldRenderTable(true)
    }
  }

  const handleUpsertFetchResponse = async (response: Response) => {
    try {
      const data = await response.json()

      if (!response.ok) {
        setStatusCode(response.status as ErrorCardStatusCodeProp)

        if (data.reason)
          setReasons(data.reason)

        return
      }

      setWasUpsertSuccessful(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpsertSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRequestLoading(true)

    const nameInput = event.currentTarget.elements.namedItem("name") as HTMLInputElement | null
    if (!nameInput)
      return

    const upsertTagPayload = {
      name: nameInput.value
    }

    const URLToFetch = tagId > 0
      ? `${API_URL}/tag/update/${tagId}`
      : `${API_URL}/tag/create`

    fetch(
      URLToFetch,

      {
        method: tagId > 0
          ? "PUT"
          : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(upsertTagPayload)
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
      window.location.href = managementScreenPath
  }

  const handleSuccessCardClose = () => {
    setWasUpsertSuccessful(false)
    window.location.href = managementScreenPath
  }

  useEffect(
    () => {
      if (tagId > 0) {
        setIsRequestLoading(true)

        fetch(`${API_URL}/tag/get/${tagId}`)
          .then(handleGetFetchResponse)
          .catch(console.error)
          .finally(() => setIsRequestLoading(false))

        return
      }

      setShouldRenderTable(true)
    },
    []
  )

  return (
    <>
      {
        shouldRenderTable
          ? <AdminPanelUpsertTagForm
            tag={tag}
            handleSubmit={handleUpsertSubmit}
            isRequestLoading={isRequestLoading}
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
        message={tagId > 0 ? "Tag editada com sucesso!" : "Tag cadastrada com sucesso!"}
        isOpen={wasUpsertSuccessful}
        handleClose={handleSuccessCardClose}
      />
    </>
  )
}
