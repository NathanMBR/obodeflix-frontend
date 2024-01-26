import {
  Box,
  CircularProgress,
  Grid,
  type SelectChangeEvent,
  Typography
} from "@mui/material"
import {
  type ChangeEvent,
  type CSSProperties,
  useEffect,
  useState
} from "react"
import { useParams } from "react-router-dom"

import {
  EditFAB,
  EpisodeCard,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SeasonInfo
} from "../components"
import {
  type Season,
  SeasonBuilder,
  type Episode,
  type Pagination,
  PaginationBuilder,
  type EpisodeOrderColumn,
  type OrderBy
} from "../types"
import { PaginatedContent } from "../layouts"
import { NotFound } from "../pages"
import { API_URL } from "../settings"

export type OneSeasonParams = Record<"id", string>

export const OneSeason = () => {
  const seasonId = Number(useParams<OneSeasonParams>().id)

  if (Number.isNaN(seasonId) || seasonId <= 0)
    return <NotFound />

  const [season, setSeason] = useState<Season | undefined>(undefined)

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)
  const [reasons, setReasons] = useState<string | Array<string>>()

  const [paginatedSeasonEpisodes, setPaginatedSeasonEpisodes] = useState<Pagination<Episode> | null>(null)
  const [episodes, setEpisodes] = useState<Array<Episode>>([])
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [quantity, setQuantity] = useState(50)
  const [orderColumn, setOrderColumn] = useState<EpisodeOrderColumn>("position")
  const [orderBy, setOrderBy] = useState<OrderBy>("asc")
  const [search, setSearch] = useState("")

  const userToken = localStorage.getItem("token")
  const userType = localStorage.getItem("type")
  const showEditFAB =
    !!userToken &&
    userType === "ADMIN" &&
    !isRequestLoading &&
    !!season

  const handleSeasonFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtSeason = new SeasonBuilder(data)
    setSeason(builtSeason)
  }

  const handleEpisodesFetchResponse = async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      setStatusCode(response.status as ErrorCardStatusCodeProp)

      if (data.reason)
        setReasons(data.reason)

      return
    }

    const builtPaginatedSeasonEpisodes = new PaginationBuilder<Episode>(data)
    setPaginatedSeasonEpisodes(builtPaginatedSeasonEpisodes)
  }

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const handleOrderColumnChange = (event: SelectChangeEvent<EpisodeOrderColumn>) => {
    setOrderColumn(event.target.value as EpisodeOrderColumn)
  }

  const handleOrderByChange = (event: SelectChangeEvent<OrderBy>) => {
    setOrderBy(event.target.value as OrderBy)
  }

  const handleQuantityChange = (event: SelectChangeEvent<number>) => {
    const newQuantity = Number(event.target.value)

    if (Number.isNaN(newQuantity))
      return

    setQuantity(newQuantity)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  const handleErrorCardClose = () => {
    setStatusCode(null)
    setReasons(undefined)
    history.back()
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetch(`${API_URL}/season/get/${seasonId}`)
        .then(handleSeasonFetchResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false))
    },

    []
  )

  useEffect(
    () => {
      if (!season)
        return

      setIsEpisodesLoading(true)

      fetch(`${API_URL}/episode/all?seasonId=${season.id}&page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}${search ? `&search=${search}` : ""}`)
        .then(handleEpisodesFetchResponse)
        .catch(console.error)
        .finally(() => setIsEpisodesLoading(false))
    },

    [
      season,
      page,
      quantity,
      orderColumn,
      orderBy,
      search
    ]
  )

  useEffect(
    () => {
      paginatedSeasonEpisodes
        ? setEpisodes(paginatedSeasonEpisodes.data)
        : setEpisodes([])

      const isCurrentPageEmpty = paginatedSeasonEpisodes &&
        paginatedSeasonEpisodes.data.length <= 0 &&
        paginatedSeasonEpisodes.currentPage > 1

      if (isCurrentPageEmpty)
        setPage(1)
    },

    [paginatedSeasonEpisodes]
  )

  const loadingStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const noEpisodeMessage = <>
    <Typography variant="body1">Não há episódios a serem exibidos.</Typography>
  </>

  return (
    <>
      {
        isRequestLoading
          ? <Box sx={loadingStyle}>
            <CircularProgress />
          </Box>
          : <>
            <SeasonInfo
              season={season}
              sx={{ marginBottom: 4 }}
            />

            <PaginatedContent<EpisodeOrderColumn>
              contentTitle="Episódios"
              isRequestLoading={isEpisodesLoading}
              currentQuantity={episodes.length}
              totalQuantity={paginatedSeasonEpisodes?.totalQuantity || 0}
              noContent={noEpisodeMessage}

              newSearch={search}
              handleSearchChange={handleSearchChange}

              quantityPerPage={quantity}
              handleQuantityPerPageChange={handleQuantityChange}

              page={page}
              handlePageChange={handlePageChange}
              lastPage={paginatedSeasonEpisodes?.lastPage || 1}

              orderBy={orderBy}
              handleOrderByChange={handleOrderByChange}

              orderColumns={
                [
                  ["id", "ID"],
                  ["name", "Nome"],
                  ["position", "Ordem cronológica"],
                  ["updatedAt", "Recentemente atualizado"],
                ]
              }
              handleOrderColumnChange={handleOrderColumnChange}
              currentOrderColumn={orderColumn}
            >
              <Grid container spacing={2}>
                {
                  episodes.map(
                    (episode, index) => <EpisodeCard
                      key={index}
                      episode={episode}
                    />
                  )
                }
              </Grid>
            </PaginatedContent>
          </>
      }

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        reasons={reasons}
        handleClose={handleErrorCardClose}
      />

      <EditFAB
        href={`/admin/seasons/${seasonId}`}
        enabled={showEditFAB}
      />
    </>
  )
}
