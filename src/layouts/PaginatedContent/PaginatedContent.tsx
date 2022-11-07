import {
    CircularProgress,
    Divider,
    IconButton,
    Pagination as MUIPagination,
    SelectChangeEvent,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import {
    ChangeEvent,
    useState
} from "react";

import {
    OrderBy,
    ReactContent
} from "../../types";
import { PaginationFiltersCard } from "../../components";

export interface PaginatedContentProps<GenericOrderColumn extends string> {
    children?: ReactContent;
    contentTitle: string;
    hidePaginationContent?: boolean;
    isRequestLoading: boolean;
    currentQuantity: number;
    totalQuantity: number;
    noContent?: ReactContent;

    quantityPerPage: number;
    handleQuantityPerPageChange: (event: SelectChangeEvent<number>) => void;

    page: number;
    handlePageChange: (event: ChangeEvent<unknown>, newPageValue: number) => void;
    lastPage: number;

    orderBy: OrderBy;
    handleOrderByChange: (event: SelectChangeEvent<OrderBy>) => void;

    orderColumns: Array<[GenericOrderColumn, string]>;
    handleOrderColumnChange: (event: SelectChangeEvent<GenericOrderColumn>) => void;
    currentOrderColumn: GenericOrderColumn;
}

export const PaginatedContent = <GenericOrderColumn extends string>(props: PaginatedContentProps<GenericOrderColumn>) => {
    const {
        children,
        contentTitle,
        hidePaginationContent,
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
        currentOrderColumn
    } = props;

    const stackStyle = {
        justifyContent: "space-between",
        alignItems: "center"
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleToggleFilters = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <>
            <Stack direction="row" sx={stackStyle}>
                <Typography variant="h4" component="h2">{contentTitle}</Typography>

                {
                    hidePaginationContent || isRequestLoading
                        ? null
                        : <>
                            <MUIPagination
                                page={page}
                                count={lastPage}
                                onChange={handlePageChange}
                                hidePrevButton
                                hideNextButton
                                showFirstButton
                                showLastButton
                            />
                        </>
                }
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
                                                `Exibindo ${currentQuantity} de ${totalQuantity} resultado${totalQuantity > 1 ? "s" : ""}`
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
        </>
    );
}