import {
    Box,
    CircularProgress
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    useEffect,
    useState
} from "react";
import { useParams } from "react-router-dom";

import {
    ErrorCard,
    ErrorCardStatusCodeProp,
    SeriesInfo
} from "../components";
import {
    Series,
    SeriesBuilder
} from "../types";
import { NotFound } from "../pages";
import { API_URL } from "../settings";

export type OneSeriesParams = Record<"id", string>;

export const OneSeries = () => {
    const seriesId = Number(useParams<OneSeriesParams>().id);

    if (Number.isNaN(seriesId) || seriesId <= 0)
        return <NotFound />;

    const [series, setSeries] = useState<Series | undefined>(undefined);

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string>>();

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);

            if (data.reason)
                setReasons(data.reason);

            return;
        }

        const builtSeries = new SeriesBuilder(data);
        setSeries(builtSeries);
    };

    const handleErrorCardClose = () => {
        setStatusCode(null);
        setReasons(undefined);
        window.location.href = "/series";
    };

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(`${API_URL}/series/get/${seriesId}`)
                .then(handleFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));
        },
        []
    );

    const loadingStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    return (
        <>
            {
                isRequestLoading
                    ? <Box sx={loadingStyle}>
                        <CircularProgress />
                    </Box>
                    : <>
                        <SeriesInfo
                            series={series}
                        />
                    </>
            }

            <ErrorCard
                isOpen={!!statusCode}
                statusCode={statusCode}
                reasons={reasons}
                handleClose={handleErrorCardClose}
            />
        </>
    );
};