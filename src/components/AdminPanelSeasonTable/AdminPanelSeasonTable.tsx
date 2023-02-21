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
} from "@mui/material";
import {
    Edit,
    Delete
} from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";
import { Link } from "react-router-dom";

import { Season } from "../../types";
import { transformExhibitionData } from "../../helpers";

export interface AdminPanelSeasonTableProps {
    seasons: Array<Season>;
    getDeleteSeasonHandler: (season: Season) => () => void;
};

export const AdminPanelSeasonTable = (props: AdminPanelSeasonTableProps) => {
    const {
        seasons,
        getDeleteSeasonHandler
    } = props;

    const seasonsFormat: Array<[keyof Season, string]> = [
        ["id", "ID"],
        ["name", "Nome"],
        ["type", "Tipo"],
        ["position", "Posição"],
        ["seriesId", "ID da Série"],
        ["createdAt", "Criado em"],
        ["updatedAt", "Atualizado em"]
    ];

    const actionIconsStyle: CSSProperties = {
        color: "#777"
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                seasonsFormat.map(
                                    ([columnName, exhibitionName]) => <TableCell key={columnName}>
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
                                                const currentColumnData = row[columnName];

                                                const columnsToIgnore = [
                                                    "id"
                                                ];

                                                const dataToExhibit = columnsToIgnore.includes(columnName)
                                                    ? String(currentColumnData)
                                                    : transformExhibitionData(currentColumnData);

                                                return <TableCell
                                                    sx={
                                                        {
                                                            fontStyle: dataToExhibit === "(vazio)"
                                                                ? "italic"
                                                                : "normal"
                                                        }
                                                    }
                                                    key={columnName}
                                                >
                                                    {
                                                        dataToExhibit
                                                    }
                                                </TableCell>;
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
    );
};