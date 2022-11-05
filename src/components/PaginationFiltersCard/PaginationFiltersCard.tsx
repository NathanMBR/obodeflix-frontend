import {
    Card,
    Container,
    Divider,
    MenuItem,
    Modal,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import { OrderBy } from "../../types";

export interface PaginationFiltersCardProps<GenericOrderColumn extends string> {
    isOpen: boolean;
    handleClose: () => void;

    quantityPerPage: number;
    handleQuantityPerPageChange: (event: SelectChangeEvent<number>) => void;

    orderBy: OrderBy;
    handleOrderByChange: (event: SelectChangeEvent<OrderBy>) => void;

    orderColumns: Array<[GenericOrderColumn, string]>;
    handleOrderColumnChange: (event: SelectChangeEvent<GenericOrderColumn>) => void;
    currentOrderColumn: GenericOrderColumn;
}

export const PaginationFiltersCard = <GenericOrderColumn extends string>(props: PaginationFiltersCardProps<GenericOrderColumn>) => {
    const {
        isOpen,
        handleClose,

        quantityPerPage,
        handleQuantityPerPageChange,

        orderBy,
        handleOrderByChange,

        orderColumns,
        handleOrderColumnChange,
        currentOrderColumn
    } = props;

    return (
        <>
            <Modal open={isOpen} onClose={handleClose}>
                <Container maxWidth="sm">
                    <Paper elevation={12}>
                        <Card sx={{ padding: 8, paddingTop: 4, paddingBottom: 4, marginTop: "50%", textAlign: "center" }}>
                            <Typography variant="h4" component="h2">Filtros</Typography>

                            <Divider />
                            <Stack direction="row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                <Typography variant="body1">Quantidade por página</Typography>
                                <Select value={quantityPerPage} onChange={handleQuantityPerPageChange}>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </Stack>

                            <Stack direction="row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                <Typography variant="body1">Ordenar por</Typography>
                                <Select value={currentOrderColumn} onChange={handleOrderColumnChange}>
                                    {
                                        orderColumns.map(
                                            (orderColumn, index) => {
                                                const [value, label] = orderColumn;

                                                return (
                                                    <MenuItem
                                                        value={value}
                                                        key={index}
                                                    >
                                                        {label}
                                                    </MenuItem>
                                                );
                                            }
                                        )
                                    }
                                </Select>
                            </Stack>

                            <Stack direction="row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                <Typography variant="body1">Ordem</Typography>
                                <Select value={orderBy} onChange={handleOrderByChange}>
                                    <MenuItem value="asc">Crescente</MenuItem>
                                    <MenuItem value="desc">Decrescente</MenuItem>
                                </Select>
                            </Stack>
                        </Card>
                    </Paper>
                </Container>
            </Modal>
        </>
    )
}