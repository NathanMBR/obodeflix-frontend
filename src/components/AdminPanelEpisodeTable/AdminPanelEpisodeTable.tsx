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
    Delete,
    Visibility
} from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";
import { Link } from "react-router-dom";

import { Episode } from "../../types";
import { transformExhibitionData } from "../../helpers";

export interface AdminPanelEpisodeTableProps {
    episodes: Array<Episode>;
    getDeleteEpisodeHandler: (episode: Episode) => () => void;
}

export const AdminPanelEpisodeTable = (props: AdminPanelEpisodeTableProps) => {
    const {
        episodes,
        getDeleteEpisodeHandler
    } = props;

    const episodesFormat: Array<[keyof Episode, string]> = [
        ["id", "ID"],
        ["name", "Nome"],
        ["seasonId", "Temporada relacionada"],
        ["duration", "Duração"],
        ["position", "Posição"],
        ["createdAt", "Criado em"],
        ["updatedAt", "Atualizado em"]
    ];

    const columnsToAlign: Array<keyof Episode> = [
        "seasonId",
        "position",
        "duration"
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
                                episodesFormat.map(
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
                            episodes.map(
                                row => <TableRow key={row.id}>
                                    {
                                        episodesFormat.map(
                                            ([columnName]) => {
                                                const currentColumnData = row[columnName];
                                                const dataToExhibit = transformExhibitionData(currentColumnData, columnName);

                                                return <TableCell
                                                    key={columnName}
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
                                                >
                                                    {
                                                        columnName === "seasonId"
                                                            ? <Tooltip title="Ver temporada">
                                                                <Link to={`/season/${dataToExhibit}`}>
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
                                            <Tooltip title="Editar episódio">
                                                <Link to={`/admin/episodes/${row.id}`}>
                                                    <IconButton>
                                                        <Edit sx={actionIconsStyle} />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>

                                            <Tooltip title="Excluir episódio">
                                                <IconButton onClick={getDeleteEpisodeHandler(row)}>
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