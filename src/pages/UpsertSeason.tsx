import {
    Box,
    CircularProgress
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    FormEvent,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useParams } from "react-router-dom";

import {
    AdminPanelUpsertSeasonForm,
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../components";
import { NotFound } from "../pages";
import {
    PaginationBuilder,
    Season,
    SeasonBuilder
} from "../types";
import { API_URL } from "../settings";

export type UpsertSeasonParams = Record<"id", string>;

export const UpsertSeason = () => {
    const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const seasonId = Number(useParams<UpsertSeasonParams>().id);
    if (Number.isNaN(seasonId) || seasonId < 0)
        return <NotFound />;

    const [shouldRenderTable, setShouldRenderTable] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [areSeriesLoading, setAreSeriesLoading] = useState(true);
    const [season, setSeason] = useState<Season | undefined>(undefined);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);
    const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false);
    const [showSeriesAlternativeNames, setShowSeriesAlternativeNames] = useState(false);
    const [seriesSearch, setSeriesSearch] = useState("");
    const [series, setSeries] = useState<Array<Season["series"]>>([]);
    const [seriesSearchTimer, setSeriesSearchTimer] = useState<number | null>(null);
    const [_seriesId, setSeriesId] = useState<Season["seriesId"] | null>(null);

    const managementScreenPath = "/admin/seasons";

    const notRenderedTableBoxStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const handleGetSeasonFetchResponse = async (response: Response) => {
        try {
            const seasonData = await response.json();

            if (!response.ok) {
                setStatusCode(response.status as ErrorCardStatusCodeProp);

                if (seasonData.reason)
                    setReasons(seasonData.reason);

                return;
            }

            const builtSeason = new SeasonBuilder(seasonData);
            setSeason(builtSeason);
        } catch (error) {
            console.error(error);
        } finally {
            setShouldRenderTable(true);
        }
    };

    const handleUpsertSeasonFetchResponse = async (response: Response) => {
        try {
            const seasonData = await response.json();

            if (!response.ok) {
                setStatusCode(response.status as ErrorCardStatusCodeProp);

                if (seasonData.reason)
                    setReasons(seasonData.reason);

                return;
            }

            setWasUpsertSuccessful(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpsertSeasonSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsRequestLoading(true);

        const nameInput = event
            .currentTarget
            .elements
            .namedItem("name") as HTMLInputElement | null;

        if (!nameInput)
            return;

        const typeInput = event
            .currentTarget
            .elements
            .namedItem("type") as HTMLInputElement | null;

        if (!typeInput)
            return;

        const positionInput = event
            .currentTarget
            .elements
            .namedItem("position") as HTMLInputElement | null;

        if (!positionInput)
            return;

        const seriesIdInput = event
            .currentTarget
            .elements
            .namedItem("seriesId") as HTMLInputElement | null;

        if (!seriesIdInput)
            return;

        const imageAddressInput = event
            .currentTarget
            .elements
            .namedItem("imageAddress") as HTMLInputElement | null;
        if (!imageAddressInput)
            return;

        const upsertSeasonPayload = {
            name: nameInput.value,
            type: typeInput.value,
            position: Number(positionInput.value),
            seriesId: Number(seriesIdInput.value),
            imageAddress: imageAddressInput.value
        };

        if (seasonId > 0)
            return fetch(
                `${API_URL}/season/update/${seasonId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(upsertSeasonPayload)
                }
            )
                .then(handleUpsertSeasonFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));

        return fetch(
            `${API_URL}/season/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(upsertSeasonPayload)
            }
        )
            .then(handleUpsertSeasonFetchResponse)
            .catch(console.error)
            .finally(() => setIsRequestLoading(false));
    };

    const handleErrorCardClose = () => {
        setStatusCode(null);
        setReasons(undefined);

        if (statusCode === 404)
            window.location.href = managementScreenPath;
    };

    const handleSuccessCardClose = () => {
        setWasUpsertSuccessful(false);
        window.location.href = managementScreenPath;
    };

    const handleToggleSeriesNames = () => {
        setShowSeriesAlternativeNames(!showSeriesAlternativeNames)
    };

    const handleSeriesResponse = async (response: Response) => {
        try {
            const seriesData = await response.json();

            if (!response.ok)
                return setSeries([]);

            const builtPaginatedSeries = new PaginationBuilder<Season["series"]>(seriesData);
            setSeries(builtPaginatedSeries.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSeriesSearch = (_event: SyntheticEvent, seriesName: string) => {
        setSeriesSearch(seriesName);
    };

    const handleSeriesChange = (_event: SyntheticEvent, series: Season["series"] | null) => {
        setSeriesId(series?.id || null);
    };

    useEffect(
        () => {
            if (seasonId > 0) {
                setIsRequestLoading(true);

                fetch(`${API_URL}/season/get/${seasonId}`)
                    .then(handleGetSeasonFetchResponse)
                    .catch(console.error)
                    .finally(() => setIsRequestLoading(false));
            } else
                setShouldRenderTable(true);

            fetch(`${API_URL}/series/all?page=1&quantity=50&orderColumn=mainName&orderBy=asc${seriesSearch.length > 0 ? `&search=${seriesSearch}` : ""}`)
                .then(handleSeriesResponse)
                .catch(console.error)
                .finally(() => setAreSeriesLoading(false));
        },
        []
    );

    useEffect(
        () => {
            setAreSeriesLoading(true);
            const timeInMillisecondsToWaitBeforeSearching = 300;

            if (seriesSearchTimer)
                clearTimeout(seriesSearchTimer);

            const newSeriesSearchTimer = setTimeout(
                () => {
                    fetch(
                        `${API_URL}/series/all?page=1&quantity=50&orderColumn=mainName&orderBy=asc${seriesSearch.length > 0 ? `&search=${seriesSearch}` : ""}`
                    )
                        .then(handleSeriesResponse)
                        .catch(console.error)
                        .finally(() => setAreSeriesLoading(false));
                },
                timeInMillisecondsToWaitBeforeSearching
            );

            setSeriesSearchTimer(newSeriesSearchTimer);
        },

        [seriesSearch]
    );

    return (
        <>
            {
                shouldRenderTable
                    ? <AdminPanelUpsertSeasonForm
                        season={season}
                        series={series}
                        handleSubmit={handleUpsertSeasonSubmit}
                        handleSeriesSearch={handleSeriesSearch}
                        handleSeriesChange={handleSeriesChange}
                        isRequestLoading={isRequestLoading}
                        areSeriesLoading={areSeriesLoading}
                        showSeriesAlternativeNames={showSeriesAlternativeNames}
                        handleToggleSeriesNames={handleToggleSeriesNames}
                    />
                    : <Box sx={notRenderedTableBoxStyle}>
                        <CircularProgress />
                    </Box>
            }

            <ErrorCard
                isOpen={!!statusCode}
                statusCode={statusCode}
                reasons={reasons}
                handleClose={handleErrorCardClose}
            />

            <SuccessCard
                message={seasonId > 0 ? "Temporada editada com sucesso!" : "Temporada criada com sucesso!"}
                isOpen={wasUpsertSuccessful}
                handleClose={handleSuccessCardClose}
            />
        </>
    );
}