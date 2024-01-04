import {
  useState,
  useEffect,
  type CSSProperties
} from "react"
import {
  Box,
  CircularProgress,
  Divider,
  Typography
} from "@mui/material"

import {
  type ErrorCardStatusCodeProp,
  ErrorCard
} from "../components"
import { API_URL } from "../settings"

import { NotFound } from "./NotFound"

export const UnusedFolders = () => {
  const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
  if (!hasPermissionToAccess)
    return <NotFound />;

  const [unusedFolders, setUnusedFolders] = useState<Array<string>>([])
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined)

  const handleUnusedFoldersFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason) {
        setReasons(data.reason)
      }

      return
    }

    setUnusedFolders(data)
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)
    history.back()
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetch(
        `${API_URL}/raw/folder/unused`,

        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
        .then(handleUnusedFoldersFetchResponse)
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
            <Typography
              variant="h4"
              component="h2"
            >
              Relatório de Pastas Não-Utilizadas
            </Typography>

            <Divider />

            <ul>
              {
                unusedFolders.map(
                  (unusedFolder, index) => <li key={index}>{ unusedFolder }</li>
                )
              }
            </ul>
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
