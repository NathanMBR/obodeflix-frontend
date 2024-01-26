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
  AdminPanelDeleteTagCard,
  AdminPanelTagTable,
  ErrorCard,
  type ErrorCardStatusCodeProp,
  SuccessCard
} from "../components"
import {
  type OrderBy,
  type Pagination,
  PaginationBuilder,
  type Tag,
  type TagOrderColumn
} from "../types"
import { NotFound } from "../pages"
import { PaginatedContent } from "../layouts"
import { API_URL } from "../settings"

export const ManageTags = () => {
  const userToken = localStorage.getItem("token")
  const hasPermissionToAccess = !!userToken && localStorage.getItem("type") === "ADMIN"
  if (!hasPermissionToAccess)
    return <NotFound />

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null)

  const [page, setPage] = useState(1)
  const [quantity, setQuantity] = useState(50)
  const [orderColumn, setOrderColumn] = useState<TagOrderColumn>("name")
  const [orderBy, setOrderBy] = useState<OrderBy>("asc")
  const [search, setSearch] = useState("")

  const [paginatedTags, setPaginatedTags] = useState<Pagination<Tag> | null>(null)
  const [tags, setTags] = useState<Array<Tag>>([])

  const [deleteTagCardData, setDeleteTagCardData] = useState<Tag | null>(null)
  const [showSuccessCard, setShowSuccessCard] = useState(false)

  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const handleOrderColumnChange = (event: SelectChangeEvent<TagOrderColumn>) => {
    setOrderColumn(event.target.value as TagOrderColumn)
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

  const handleFetchAllTagsResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    const data = await response.json()
    const builtPaginatedTags = new PaginationBuilder<Tag>(data)
    setPaginatedTags(builtPaginatedTags)
  }

  const fetchAllTags = async () => {
    try {
      const url = new URL(`${API_URL}/tag/all`, window.location.origin)
      url.searchParams.append("page", String(page))
      url.searchParams.append("quantity", String(quantity))
      url.searchParams.append("orderColumn", String(orderColumn))
      url.searchParams.append("orderBy", String(orderBy))

      if (search)
        url.searchParams.append("search", search)

      const urlString = url.toString()
      const response = await fetch(urlString)
      await handleFetchAllTagsResponse(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequestLoading(false)
    }
  }

  const handleDeleteTagResponse = async (response: Response) => {
    if (!response.ok)
      return setStatusCode(response.status as ErrorCardStatusCodeProp)

    setShowSuccessCard(true)
  }

  const getOpenDeleteTagCardHandler = (tag: Tag) => {
    const handleOpenDeleteTagCard = () => {
      setDeleteTagCardData(tag)
    }

    return handleOpenDeleteTagCard
  }

  const getDeleteTagHandler = (tag: Tag | null) => {
    const finishDeleteProcess = () => {
      setDeleteTagCardData(null)

      fetchAllTags()
    }

    return () => {
      if (!tag)
        return

      const url = new URL(`${API_URL}/tag/inactivate/${tag.id}`, window.location.origin)
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
        .then(handleDeleteTagResponse)
        .catch(console.error)
        .finally(finishDeleteProcess)
    }
  }

  const handleDeleteTagCardClose = () => {
    setDeleteTagCardData(null)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
  }

  useEffect(
    () => {
      setIsRequestLoading(true)

      fetchAllTags()
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
      paginatedTags
        ? setTags(paginatedTags.data)
        : setTags([])

      const isCurrentPageEmpty = paginatedTags &&
        paginatedTags.data.length <= 0 &&
        paginatedTags.currentPage > 1

      if (isCurrentPageEmpty)
        setPage(1)
    },

    [
      paginatedTags
    ]
  )

  const noContentWarning = <Typography variant="body1">Não há tags cadastradas.</Typography>

  return (
    <Box sx={{ position: "relative" }}>
      <PaginatedContent<TagOrderColumn>
        contentTitle="Gerenciar tags"
        isRequestLoading={isRequestLoading}
        currentQuantity={tags.length}
        totalQuantity={paginatedTags?.totalQuantity || 0}
        noContent={noContentWarning}

        newSearch={search}
        handleSearchChange={handleSearchChange}

        quantityPerPage={quantity}
        handleQuantityPerPageChange={handleQuantityChange}

        page={page}
        handlePageChange={handlePageChange}
        lastPage={paginatedTags?.lastPage || 1}

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
        <AdminPanelTagTable
          data={tags}
          getDeleteHandler={getOpenDeleteTagCardHandler}
        />
      </PaginatedContent>

      <AdminPanelAddContentFAB href="/admin/tags/0" />

      <AdminPanelDeleteTagCard
        tag={deleteTagCardData}
        isOpen={!!deleteTagCardData}
        handleClose={handleDeleteTagCardClose}
        handleDelete={getDeleteTagHandler(deleteTagCardData)}
      />

      <ErrorCard
        isOpen={!!statusCode}
        statusCode={statusCode}
        handleClose={handleErrorClose}
        reasons="Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."
      />

      <SuccessCard
        message="Tag deletada com sucesso!"
        isOpen={showSuccessCard}
        handleClose={() => setShowSuccessCard(false)}
      />
    </Box>
  )
}
