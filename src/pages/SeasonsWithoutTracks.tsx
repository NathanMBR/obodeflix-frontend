import {
  type CSSProperties,
  useState,
  useEffect
} from "react"
import {
  Box,
  CircularProgress,
  Divider,
  Typography
} from "@mui/material"
import { Link } from "react-router-dom"

import {
  ErrorCard,
  type ErrorCardStatusCodeProp
} from "../components"
import type { Season } from "../types"
import { API_URL } from "../settings"
import { NotFound } from "./NotFound"

import "./SeasonsWithoutTracks.css"

type SeasonWithoutTracks = Pick<Season, "id" | "name">

export const SeasonsWithoutTracks = () => {
  const userToken = localStorage.getItem("token")
  const hasPermissionToAccess = userToken && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const [seasons, setSeasons] = useState<Array<SeasonWithoutTracks>>([])
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined)

  const loadingStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    paddingTop: "50%",
    transform: "translateY(-50%)"
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      const fetchSeasonsWithoutTracks = async () => {
        const url = new URL(`${API_URL}/season/no-tracks`, window.location.origin)
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
          if (data.reasons)
            setReasons(data.reasons)

          return setStatusCode(response.status as ErrorCardStatusCodeProp)
        }

        setSeasons(data)
      }

      fetchSeasonsWithoutTracks()
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))
    },
    []
  )

  if (isRequestLoading)
    return (
      <Box sx={loadingStyle}>
        <CircularProgress />
      </Box>
    )

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
      >
        Relatório de Temporadas sem Faixas
      </Typography>

      <Divider />

      {
        seasons.length <= 0
          ? <Typography variant="body1">
            Não há temporadas sem faixas.
          </Typography>
          : <ul>
              {
                seasons.map(
                  season => <li
                    className="link"
                    key={season.id}
                  >
                    <Link to={`/seasons/${season.id}`}>{season.name}</Link>
                  </li>
                )
              }
          </ul>
      }

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        reasons={reasons}
        handleClose={
          () => {
            setStatusCode(null)
            setReasons(undefined)
          }
        }
      />
    </>
  );
};
