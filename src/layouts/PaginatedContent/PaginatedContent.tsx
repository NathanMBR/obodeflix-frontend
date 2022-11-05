import {
    CircularProgress,
    Divider,
    IconButton,
    Pagination as MUIPagination,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import {
    ChangeEvent,
    useState
} from "react";

import { OrderBy } from "../../types";
import { PaginationFiltersCard } from "../../components";

export interface PaginatedContentProps<GenericOrderColumn extends string> {
    children?: JSX.Element | Array<JSX.Element>;
    contentTitle: string;
    hidePaginationContent?: boolean;
    isRequestLoading: boolean;
    currentQuantity: number;
    totalQuantity: number;
    noContentMessage: string;

    quantityPerPage: number;
    handleQuantityPerPageChange: (event: SelectChangeEvent<number>) => void;

    page: number;
    handlePageChange: (event: ChangeEvent<unknown>, newPageValue: number) => void;
    lastPage: number;

    orderBy: OrderBy;
    handleOrderByChange: (event: SelectChangeEvent<OrderBy>) => void;

    orderColumns: Array<[GenericOrderColumn, string]>;
    handleOrderColumnChange: (event: SelectChangeEvent<GenericOrderColumn>) => void;
}

export const PaginatedContent = <GenericOrderColumn extends string>(props: PaginatedContentProps<GenericOrderColumn>) => {
    const {
        children,
        contentTitle,
        hidePaginationContent,
        isRequestLoading,
        currentQuantity,
        totalQuantity,
        noContentMessage,

        quantityPerPage,
        handleQuantityPerPageChange,

        page,
        handlePageChange,
        lastPage,

        orderBy,
        handleOrderByChange,

        orderColumns,
        handleOrderColumnChange
    } = props;

    const stackStyle = {
        justifyContent: "space-between",
        alignItems: "center"
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleToggleFilters = () => {
        setIsFilterOpen(!isFilterOpen);
    }

    return (
        <>
            <Stack direction="row" sx={stackStyle}>
                <Typography variant="h4" component="h2">{contentTitle}</Typography>

                {
                    !hidePaginationContent
                        ? <>
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
                        : null
                }
            </Stack>
            <Divider style={{ marginBottom: 16 }} />
            {
                isRequestLoading
                    ? <>
                        {
                            currentQuantity > 0
                                ? <>
                                    <Stack direction="row" sx={stackStyle}>
                                        <Typography variant="body1">Exibindo {currentQuantity} de {totalQuantity}</Typography>
                                        <IconButton>
                                            <Tune color="inherit" />
                                            <PaginationFiltersCard<GenericOrderColumn>
                                                isOpen={isFilterOpen}
                                                handleClose={handleToggleFilters}

                                                quantityPerPage={quantityPerPage}
                                                handleQuantityPerPageChange={handleQuantityPerPageChange}

                                                orderBy={orderBy}
                                                handleOrderByChange={handleOrderByChange}

                                                orderColumns={orderColumns}
                                                handleOrderColumnChange={handleOrderColumnChange}
                                            />
                                        </IconButton>
                                    </Stack>

                                    {
                                        children
                                    }
                                </>
                                : <>
                                    <Typography variant="body1">{noContentMessage}</Typography>
                                </>
                        }
                    </>
                    : <div style={{ textAlign: "center", height: "70vh" }}>
                        <CircularProgress />
                    </div>
            }
        </>
    );
}