import {
    Box,
    CircularProgress
} from "@mui/material";
import {
    FormEvent,
    useEffect,
    useState
} from "react";
import { useParams } from "react-router-dom";

import {
    AdminPanelUpsertSeriesForm,
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../components";
import { NotFound } from "../pages";
import {
    Series,
    SeriesBuilder
} from "../types";
import { API_URL } from "../settings";

export type UpsertSeriesParams = Record<"id", string>

export const UpsertSeries = () => {
    if (!localStorage.getItem("token") || localStorage.getItem("type") !== "ADMIN")
        return <NotFound />;

    const seriesId = Number(useParams<UpsertSeriesParams>().id);
    if (Number.isNaN(seriesId) || seriesId < 0)
        return <NotFound />;

    const [shouldRenderTable, setShouldRenderTable] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [series, setSeries] = useState<Series | undefined>(undefined);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string>>();
    const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false);

    useEffect(
        () => {
            if (seriesId > 0) {
                setIsRequestLoading(true);

                fetch(`${API_URL}/series/get/${seriesId}`)
                    .then(handleGetFetchResponse)
                    .catch(console.error)
                    .finally(() => setIsRequestLoading(false));
            } else
                setShouldRenderTable(true);
        },
        []
    );

    const handleGetFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);
            setShouldRenderTable(true);

            if (data.reason)
                setReasons(data.reason);

            return;
        }

        const builtSeries = new SeriesBuilder(data);
        setSeries(builtSeries);
        setShouldRenderTable(true);
    };

    const handleUpsertFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);
            if (data.reason)
                setReasons(data.reason);

            return;
        }

        setWasUpsertSuccessful(true);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsRequestLoading(true);

        const mainNameInput = event.currentTarget.elements.namedItem("mainName") as HTMLInputElement | null;
        if (!mainNameInput)
            return;

        const mainNameLanguageInput = event.currentTarget.elements.namedItem("mainNameLanguage") as HTMLInputElement | null;
        if (!mainNameLanguageInput)
            return;

        const alternativeNameInput = event.currentTarget.elements.namedItem("alternativeName") as HTMLInputElement | null;
        if (!alternativeNameInput)
            return;

        const descriptionInput = event.currentTarget.elements.namedItem("description") as HTMLInputElement | null;
        if (!descriptionInput)
            return;

        const imageAddressInput = event.currentTarget.elements.namedItem("imageAddress") as HTMLInputElement | null;
        if (!imageAddressInput)
            return;

        const upsertSeriesPayload = {
            mainName: mainNameInput.value,
            mainNameLanguage: mainNameLanguageInput.value,
            alternativeName: alternativeNameInput.value || null,
            description: descriptionInput.value || null,
            imageAddress: imageAddressInput.value || null,
            tags: []
        };

        if (seriesId > 0) {
            fetch(
                `${API_URL}/series/update/${seriesId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(upsertSeriesPayload)
                }
            )
                .then(handleUpsertFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));

            return;
        }

        fetch(
            `${API_URL}/series/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(upsertSeriesPayload)
            }
        )
            .then(handleUpsertFetchResponse)
            .catch(console.error)
            .finally(() => setIsRequestLoading(false));
    };

    const handleErrorCardClose = () => {
        setStatusCode(null);
        setReasons(undefined);

        if (statusCode === 404)
            window.location.href = "/admin/series";
    };

    const handleSuccessCardClose = () => {
        setWasUpsertSuccessful(false);
        window.location.href = "/admin/series";
    };

    return (
        <>
            {
                shouldRenderTable
                    ? <AdminPanelUpsertSeriesForm
                        handleSubmit={handleSubmit}
                        isRequestLoading={isRequestLoading}
                        series={series}
                    />
                    : <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
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
                message={seriesId > 0 ? "Série editada com sucesso!" : "Série cadastrada com sucesso!"}
                isOpen={wasUpsertSuccessful}
                handleClose={handleSuccessCardClose}
            />
        </>
    );
}