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
  AdminPanelDeleteSeasonCard,
  AdminPanelSeasonTable,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import {
  type OrderBy,
  type Pagination,
  PaginationBuilder,
  type Season,
  type SeasonOrderColumn
} from "../types"
import { NotFound } from "../pages"
import { PaginatedContent } from "../layouts"
import { API_URL } from "../settings"

export const ManageSeasons = () => {
  const userToken = localStorage.getItem("token")
  const hasPermissionToAccess = userToken && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)

  const [page, setPage] = useState(1)
  const [quantity, setQuantity] = useState(50)
  const [orderColumn, setOrderColumn] = useState<SeasonOrderColumn>("name")
  const [orderBy, setOrderBy] = useState<OrderBy>("asc")
  const [search, setSearch] = useState("")

  const [paginatedSeasons, setPaginatedSeasons] = useState<Pagination<Season> | null>(null)
  const [seasons, setSeasons] = useState<Array<Season>>([])

  const [deleteSeasonCardData, setDeleteSeasonCardData] = useState<Season | null>(null)
  const [showSuccessCard, setShowSuccessCard] = useState(false)

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const handleOrderColumnChange = (event: SelectChangeEvent<SeasonOrderColumn>) => {
    setOrderColumn(event.target.value as SeasonOrderColumn)
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

  const handleFetchAllSeasonsResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    const data = await response.json()
    const builtPaginatedSeasons = new PaginationBuilder<Season>(data)
    setPaginatedSeasons(builtPaginatedSeasons)
  }

  const fetchAllSeasons = async () => {
    try {
      const url = new URL(`${API_URL}/season/all`, window.location.origin)
      url.searchParams.append("page", String(page))
      url.searchParams.append("quantity", String(quantity))
      url.searchParams.append("orderColumn", String(orderColumn))
      url.searchParams.append("orderBy", String(orderBy))

      if (search)
        url.searchParams.append("search", search)

      const urlString = url.toString()
      const response = await fetch(urlString)
      await handleFetchAllSeasonsResponse(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequestLoading(false)
    }
  }

  const handleDeleteSeasonResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    setShowSuccessCard(true)
  }

  const getOpenDeleteSeasonCardHandler = (season: Season) => {
    const handleOpenDeleteSeasonCard = () => {
      setDeleteSeasonCardData(season)
    }

    return handleOpenDeleteSeasonCard
  }

  const getDeleteSeasonHandler = (season: Season | null) => {
    const finishDeleteProcess = () => {
      setDeleteSeasonCardData(null)

      fetchAllSeasons()
    }

    return () => {
      if (!season)
        return

      const url = new URL(`${API_URL}/season/inactivate/${season.id}`, window.location.origin)
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
        .then(handleDeleteSeasonResponse)
        .catch(console.error)
        .finally(finishDeleteProcess)
    }
  }

  const handleDeleteSeasonCardClose = () => {
    setDeleteSeasonCardData(null)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetchAllSeasons()
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
      paginatedSeasons
        ? setSeasons(paginatedSeasons.data)
        : setSeasons([])

      const isCurrentPageEmpty = paginatedSeasons &&
        paginatedSeasons.data.length <= 0 &&
        paginatedSeasons.currentPage > 1

      if (isCurrentPageEmpty)
        setPage(1)
    },

    [
      paginatedSeasons
    ]
  )

  const noContentWarning = <Typography variant="body1">Não há temporadas cadastradas.</Typography>

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <PaginatedContent<SeasonOrderColumn>
          contentTitle="Gerenciar temporadas"
          isRequestLoading={isRequestLoading}
          currentQuantity={seasons.length}
          totalQuantity={paginatedSeasons?.totalQuantity || 0}
          noContent={noContentWarning}

          newSearch={search}
          handleSearchChange={handleSearchChange}

          quantityPerPage={quantity}
          handleQuantityPerPageChange={handleQuantityChange}

          page={page}
          handlePageChange={handlePageChange}
          lastPage={paginatedSeasons?.lastPage || 1}

          orderBy={orderBy}
          handleOrderByChange={handleOrderByChange}

          orderColumns={[
            ["id", "ID"],
            ["name", "Nome"],
            ["position", "Posição"],
            ["updatedAt", "Recentemente atualizado"]
          ]}
          handleOrderColumnChange={handleOrderColumnChange}
          currentOrderColumn={orderColumn}
        >
          <AdminPanelSeasonTable
            seasons={seasons}
            getDeleteSeasonHandler={getOpenDeleteSeasonCardHandler}
          />
        </PaginatedContent>

        <AdminPanelAddContentFAB href="/admin/seasons/0" />

        <AdminPanelDeleteSeasonCard
          season={deleteSeasonCardData}
          isOpen={!!deleteSeasonCardData}
          handleClose={handleDeleteSeasonCardClose}
          handleDelete={getDeleteSeasonHandler(deleteSeasonCardData)}
        />

        <ErrorCard
          isOpen={!!statusCode}
          statusCode={statusCode}
          handleClose={handleErrorClose}
          reasons="Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."
        />

        <SuccessCard
          message="Temporada deletada com sucesso!"
          isOpen={showSuccessCard}
          handleClose={() => setShowSuccessCard(false)}
        />
      </Box>
    </>
  )
}
