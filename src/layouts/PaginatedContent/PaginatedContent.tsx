import {
  CircularProgress,
  Divider,
  IconButton,
  Pagination as MUIPagination,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material"
import {
  type CSSProperties,
  type ChangeEvent,
  useEffect,
  useState
} from "react"
import { Tune } from "@mui/icons-material"

import type {
  OrderBy,
  ReactContent
} from "../../types"
import { PaginationFiltersCard } from "../../components"

export interface PaginatedContentProps<GenericOrderColumn extends string> {
  children?: ReactContent
  contentTitle: string
  isRequestLoading: boolean
  currentQuantity: number
  totalQuantity: number
  noContent?: ReactContent

  quantityPerPage: number
  handleQuantityPerPageChange: (event: SelectChangeEvent<number>) => void

  page: number
  handlePageChange: (event: ChangeEvent<unknown>, newPageValue: number) => void
  lastPage: number

  orderBy: OrderBy
  handleOrderByChange: (event: SelectChangeEvent<OrderBy>) => void

  orderColumns: Array<[GenericOrderColumn, string]>
  handleOrderColumnChange: (event: SelectChangeEvent<GenericOrderColumn>) => void
  currentOrderColumn: GenericOrderColumn

  newSearch: string
  handleSearchChange: (search: string) => void
}

export const PaginatedContent = <GenericOrderColumn extends string>(props: PaginatedContentProps<GenericOrderColumn>) => {
  const {
    children,
    contentTitle,
    isRequestLoading,
    currentQuantity,
    totalQuantity,
    noContent,

    quantityPerPage,
    handleQuantityPerPageChange,

    page,
    handlePageChange,
    lastPage,

    orderBy,
    handleOrderByChange,

    orderColumns,
    handleOrderColumnChange,
    currentOrderColumn,

    newSearch,
    handleSearchChange
  } = props

  const stackStyle: CSSProperties = {
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 2
  }

  const searchFieldStyle: Record<"& fieldset", CSSProperties> & CSSProperties = {
    ["& fieldset"]: {
      borderRadius: "20px"
    }
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [searchTimer, setSearchTimer] = useState<number | null>(null)

  useEffect(
    () => {
      const timeInMillisecondsToWaitBeforeSearching = 300

      if (searchTimer)
        clearTimeout(searchTimer)

      const newSearchTimer = setTimeout(
        () => {
          handleSearchChange(search)
          clearTimeout(newSearchTimer)
        },
        timeInMillisecondsToWaitBeforeSearching
      )

      setSearchTimer(newSearchTimer)
    },

    [
      search
    ]
  )

  const handleToggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <>
      <Stack direction="row" sx={stackStyle}>
        <Typography variant="h4" component="h2">{contentTitle}</Typography>

        <TextField
          sx={searchFieldStyle}
          onChange={onSearchInputChange}
          defaultValue={newSearch}
          size="small"
          variant="outlined"
          placeholder="Pesquisar"
        />

        <MUIPagination
          page={page}
          count={lastPage}
          onChange={handlePageChange}
          hidePrevButton
          hideNextButton
          showFirstButton
          showLastButton
        />
      </Stack>
      <Divider style={{ marginBottom: 16 }} />
      {
        isRequestLoading
          ? <div style={{ textAlign: "center", height: "70vh" }}>
            <CircularProgress />
          </div>
          : <>
            {
              currentQuantity > 0
                ? <>
                  <Stack direction="row" sx={stackStyle}>
                    <Typography variant="body1">
                      {
                        `Exibindo ${quantityPerPage * (page - 1) + 1} - ${Math.min(quantityPerPage * page, totalQuantity)} (${currentQuantity}) de ${totalQuantity} resultado${totalQuantity > 1 ? "s" : ""}`
                      }
                    </Typography>
                    <IconButton onClick={handleToggleFilters}>
                      <Tooltip title="Gerenciar filtros">
                        <Tune color="inherit" />
                      </Tooltip>
                      <PaginationFiltersCard<GenericOrderColumn>
                        isOpen={isFilterOpen}
                        handleClose={handleToggleFilters}

                        quantityPerPage={quantityPerPage}
                        handleQuantityPerPageChange={handleQuantityPerPageChange}

                        orderBy={orderBy}
                        handleOrderByChange={handleOrderByChange}

                        orderColumns={orderColumns}
                        handleOrderColumnChange={handleOrderColumnChange}
                        currentOrderColumn={currentOrderColumn}
                      />
                    </IconButton>
                  </Stack>

                  {
                    children
                  }
                </>
                : <>
                  {
                    noContent
                  }
                </>
            }
          </>
      }
      <Divider style={{ marginTop: 32, marginBottom: 16 }} />
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "right" }}>
        <MUIPagination
          page={page}
          count={lastPage}
          onChange={handlePageChange}
          hidePrevButton
          hideNextButton
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  )
}
