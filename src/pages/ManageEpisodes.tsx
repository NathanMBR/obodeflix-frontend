import {
  Box,
  type SelectChangeEvent,
  Typography
} from "@mui/material"
import {
  type ChangeEvent,
  useState,
  useEffect
} from "react"

import {
  AdminPanelAddContentFAB,
  AdminPanelDeleteEpisodeCard,
  AdminPanelEpisodeTable,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import {
  type OrderBy,
  type Pagination,
  PaginationBuilder,
  type Episode,
  type EpisodeOrderColumn
} from "../types"
import { NotFound } from "../pages"
import { PaginatedContent } from "../layouts"
import { API_URL } from "../settings"

export const ManageEpisodes = () => {
  const userToken = localStorage.getItem("token")
  const hasPermissionToAccess = !!userToken && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)

  const [page, setPage] = useState(1)
  const [quantity, setQuantity] = useState(50)
  const [orderColumn, setOrderColumn] = useState<EpisodeOrderColumn>("name")
  const [orderBy, setOrderBy] = useState<OrderBy>("asc")
  const [search, setSearch] = useState("")

  const [paginatedEpisodes, setPaginatedEpisodes] = useState<Pagination<Episode> | null>(null)
  const [episodes, setEpisodes] = useState<Array<Episode>>([])

  const [deleteEpisodeCardData, setDeleteEpisodeCardData] = useState<Episode | null>(null)
  const [showSuccessCard, setShowSuccessCard] = useState(false)

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

  const handleErrorClose = () => {
    setStatusCode(null)
    window.location.href = "/"
  }

  const handleFetchAllEpisodesResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    const data = await response.json()
    const builtPaginatedEpisodes = new PaginationBuilder<Episode>(data)
    setPaginatedEpisodes(builtPaginatedEpisodes)
  }

  const fetchAllEpisodes = async () => {
    try {
      const url = new URL(`${API_URL}/episode/all`, window.location.origin)
      url.searchParams.append("page", String(page))
      url.searchParams.append("quantity", String(quantity))
      url.searchParams.append("orderColumn", String(orderColumn))
      url.searchParams.append("orderBy", String(orderBy))

      if (search)
        url.searchParams.append("search", search)

      const urlString = url.toString()
      const response = await fetch(urlString)
      await handleFetchAllEpisodesResponse(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequestLoading(false)
    }
  }

  const handleDeleteEpisodeResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    setShowSuccessCard(true)
  }

  const getOpenDeleteEpisodeCardHandler = (episode: Episode) => {
    const handleOpenDeleteEpisodeCard = () => {
      setDeleteEpisodeCardData(episode)
    }

    return handleOpenDeleteEpisodeCard
  }

  const getDeleteEpisodeHandler = (episode: Episode | null) => {
    const finishDeleteProcess = () => {
      setDeleteEpisodeCardData(null)

      fetchAllEpisodes()
    }

    return () => {
      if (!episode)
        return

      const url = new URL(`${API_URL}/episode/inactivate/${episode.id}`, window.location.origin)
      const urlString = url.toString()

      fetch(
        urlString,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
        .then(handleDeleteEpisodeResponse)
        .catch(console.error)
        .finally(finishDeleteProcess)
    }
  }

  const handleDeleteEpisodeCardClose = () => {
    setDeleteEpisodeCardData(null)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetchAllEpisodes()
    },

    [
      page,
      quantity,
      orderColumn,
      orderBy,
      search
    ]
  )

  useEffect(
    () => {
      paginatedEpisodes
        ? setEpisodes(paginatedEpisodes.data)
        : setEpisodes([])

      const isCurrentPageEmpty = paginatedEpisodes &&
        paginatedEpisodes.data.length <= 0 &&
        paginatedEpisodes.currentPage > 1

      if (isCurrentPageEmpty)
        setPage(1)
    },

    [
      paginatedEpisodes
    ]
  )

  const noContentWarning = <Typography variant="body1">Não há episódios cadastrados.</Typography>

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <PaginatedContent<EpisodeOrderColumn>
          contentTitle="Gerenciar episódios"
          hidePaginationContent={episodes.length <= 0}
          isRequestLoading={isRequestLoading}
          currentQuantity={episodes.length}
          totalQuantity={paginatedEpisodes?.totalQuantity || 0}
          noContent={noContentWarning}

          newSearch={search}
          handleSearchChange={handleSearchChange}

          quantityPerPage={quantity}
          handleQuantityPerPageChange={handleQuantityChange}

          page={page}
          handlePageChange={handlePageChange}
          lastPage={paginatedEpisodes?.lastPage || 1}

          orderBy={orderBy}
          handleOrderByChange={handleOrderByChange}

          orderColumns={[
            ["id", "ID"],
            ["name", "Nome"],
            ["updatedAt", "Recentemente atualizado"]
          ]}
          handleOrderColumnChange={handleOrderColumnChange}
          currentOrderColumn={orderColumn}
        >
          <AdminPanelEpisodeTable
            episodes={episodes}
            getDeleteEpisodeHandler={getOpenDeleteEpisodeCardHandler}
          />
        </PaginatedContent>

        <AdminPanelAddContentFAB href="/admin/episodes/0" />

        <AdminPanelDeleteEpisodeCard
          episode={deleteEpisodeCardData}
          isOpen={!!deleteEpisodeCardData}
          handleClose={handleDeleteEpisodeCardClose}
          handleDelete={getDeleteEpisodeHandler(deleteEpisodeCardData)}
        />

        <ErrorCard
          isOpen={!!statusCode}
          statusCode={statusCode}
          handleClose={handleErrorClose}
          reasons="Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."
        />

        <SuccessCard
          message="Episódio deletado com sucesso!"
          isOpen={showSuccessCard}
          handleClose={() => setShowSuccessCard(false)}
        />
      </Box>
    </>
  )
}
