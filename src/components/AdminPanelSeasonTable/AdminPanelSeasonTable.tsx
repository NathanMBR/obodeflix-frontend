import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material"
import {
  Edit,
  Delete,
  Visibility
} from "@mui/icons-material"
import type { CSSProperties } from "react"
import { Link } from "react-router-dom"

import type { Season } from "../../types"
import { transformExhibitionData } from "../../helpers"

export interface AdminPanelSeasonTableProps {
  seasons: Array<Season>
  getDeleteSeasonHandler: (season: Season) => () => void
}

export const AdminPanelSeasonTable = (props: AdminPanelSeasonTableProps) => {
  const {
    seasons,
    getDeleteSeasonHandler
  } = props

  const seasonsFormat: Array<[keyof Season, string]> = [
    ["id", "ID"],
    ["name", "Nome"],
    ["type", "Tipo"],
    ["position", "Posição"],
    ["seriesId", "Série relacionada"],
    ["createdAt", "Criado em"],
    ["updatedAt", "Atualizado em"]
  ]

  const columnsToAlign: Array<keyof Season> = [
    "type",
    "position",
    "seriesId"
  ]

  const actionIconsStyle: CSSProperties = {
    color: "#777"
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {
                seasonsFormat.map(
                  ([columnName, exhibitionName]) => <TableCell
                    key={columnName}
                    sx={{ textAlign: columnsToAlign.includes(columnName) ? "center" : "default" }}
                  >
                    {
                      exhibitionName
                    }
                  </TableCell>
                )
              }
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              seasons.map(
                row => <TableRow key={row.id}>
                  {
                    seasonsFormat.map(
                      ([columnName]) => {
                        const currentColumnData = row[columnName]
                        const dataToExhibit = transformExhibitionData(currentColumnData, columnName)

                        return <TableCell
                          sx={
                            {
                              fontStyle: dataToExhibit === "(vazio)"
                                ? "italic"
                                : "normal",

                              textAlign: columnsToAlign.includes(columnName)
                                ? "center"
                                : "default"
                            }
                          }
                          key={columnName}
                        >
                          {
                            columnName === "seriesId"
                              ? <Tooltip title="Ver série">
                                <Link to={`/series/${dataToExhibit}`}>
                                  <IconButton>
                                    <Visibility />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                              : dataToExhibit
                          }
                        </TableCell>
                      }
                    )
                  }

                  <TableCell>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "center" }}
                    >
                      <Tooltip title="Editar temporada">
                        <Link to={`/admin/seasons/${row.id}`}>
                          <IconButton>
                            <Edit sx={actionIconsStyle} />
                          </IconButton>
                        </Link>
                      </Tooltip>

                      <Tooltip title="Excluir temporada">
                        <IconButton onClick={getDeleteSeasonHandler(row)}>
                          <Delete sx={actionIconsStyle} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
