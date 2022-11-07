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
import { Link } from "react-router-dom";
import { CSSProperties } from "@mui/styled-engine";

import { Series } from "../../types";
import { transformExhibitionData } from "../../helpers";

export interface AdminPanelSeriesTableProps {
    data: Array<Series>
    dataFormat: Array<[keyof Series, string]>
};

const actionIconsStyle: CSSProperties = {
    color: "#777"
};

export const AdminPanelSeriesTable = (props: AdminPanelSeriesTableProps) => {
    const {
        data,
        dataFormat
    } = props;

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                dataFormat.map(
                                    ([columnName, exhibitionName]) => <TableCell key={columnName}>{exhibitionName}</TableCell>
                                )
                            }
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            data.map(
                                row => <TableRow key={row.id}>
                                    {
                                        dataFormat.map(
                                            ([columnName]) => {
                                                const dataToExhibit = transformExhibitionData(row[columnName]);

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
                                                    {dataToExhibit}
                                                </TableCell>;
                                            }
                                        )
                                    }
                                    <TableCell>
                                        <Stack direction="row">
                                            <Tooltip title="Editar série">
                                                <Link to={`/admin/series/${row.id}`}>
                                                    <IconButton>
                                                        <Edit sx={actionIconsStyle} />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>

                                            <Tooltip title="Excluir série">
                                                <IconButton>
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