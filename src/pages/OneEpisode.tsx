import {
    Box,
    CircularProgress,
    Link as MUILink
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    useEffect,
    useState
} from "react";
import {
    useParams,
    Link as RouterLink
} from "react-router-dom";

import {
    EpisodeInfo,
    ErrorCard,
    ErrorCardStatusCodeProp
} from "../components";
import {
    Episode,
    EpisodeBuilder
} from "../types";
import { NotFound } from "../pages";
import { API_URL } from "../settings";

export type OneEpisodeParams = Record<"id", string>;

export const OneEpisode = () => {
    const episodeId = Number(useParams<OneEpisodeParams>().id);

    if (Number.isNaN(episodeId) || episodeId <= 0)
        return <NotFound />;

    const [episode, setEpisode] = useState<Episode | undefined>(undefined);

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string>>();

    const handleEpisodeFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);

            if (data.reason)
                setReasons(data.reason);

            return;
        }

        const builtEpisode = new EpisodeBuilder(data);
        setEpisode(builtEpisode);
    };

    const handleErrorCardClose = () => {
        setStatusCode(null);
        setReasons(undefined);
        history.back();
    };

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(`${API_URL}/episode/get/${episodeId}`)
                .then(handleEpisodeFetchResponse)
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
                    : <EpisodeInfo episode={episode} />
                        
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