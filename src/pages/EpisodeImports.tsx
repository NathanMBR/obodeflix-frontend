import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormGroup,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
    type ChangeEvent,
    type CSSProperties,
    useEffect,
    useState,
} from "react";

import {
    EpisodeFileCard,
    ErrorCard,
    type ErrorCardStatusCodeProp,
    GoToTopFAB,
    Sortable,
    SuccessCard,
    TransferList
} from "../components";
import {
  type EpisodeFile,
  EpisodeFileBuilder,
  PaginationBuilder,
  type Season
} from "../types";
import { NotFound } from "../pages";
import { API_URL } from "../settings";

export const EpisodeImports = () => {
    interface FolderData {
        name: string;
        index: number;
    };

    const userToken = localStorage.getItem("token");
    const hasPermissionToAccess = userToken && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const unexpectedErrorComponent = <Typography variant="body1">
        Um erro inesperado ocorreu.
    </Typography>;

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [folders, setFolders] = useState<Array<string>>([]);
    const [folderData, setFolderData] = useState<FolderData | null>(null);
    const [episodeFiles, setEpisodeFiles] = useState<Array<EpisodeFile>>([]);
    const [isEpisodesLoading, setIsEpisodesLoading] = useState(false);
    const [chosenEpisodes, setChosenEpisodes] = useState<Array<string>>([]);
    const [seasons, setSeasons] = useState<Array<Season>>([]);
    const [seasonsSearch, setSeasonsSearch] = useState("");
    const [seasonsSearchTimer, setSeasonsSearchTimer] = useState<number | null>(null);
    const [areSeasonsLoading, setAreSeasonsLoading] = useState(false);
    const [seasonId, setSeasonId] = useState<number | null>(null);
    const [initialPosition, setInitialPosition] = useState(1);
    const [isImportLoading, setIsImportLoading] = useState(false);
    const [importProgress, setImportProgress] = useState(100);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);
    const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false);
    const [sortRegex, setSortRegex] = useState<RegExp | null>(null);
    const [isRefreshingSort, setIsRefreshingSort] = useState(false);
    const [isPositionIncludedInTitle, setIsPositionIncludedInTitle] = useState(false);

    const handleChosenEpisodes = (chosenEpisodesCb: Array<string>) => {
        setChosenEpisodes(chosenEpisodesCb);
    };

    const handleFoldersResponse = async (response: Response) => {
        const data = await response.json() as Array<EpisodeFile>;

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);
            console.error(data);

            return;
        }

        setEpisodeFiles(
            data.map(
                episodeFile => new EpisodeFileBuilder(episodeFile)
            )
        );
    };

    const handleSeasonsResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            if (data.reason)
                setReasons(data.reason);

            setStatusCode(response.status as ErrorCardStatusCodeProp);
            return;
        }

        const builtPaginatedSeasons = new PaginationBuilder<Season>(data);
        setSeasons(builtPaginatedSeasons.data);
    };

    const handleImport = async () => {
        setIsImportLoading(true);
        setImportProgress(0);

        let wasImportSuccessful = true;

        const episodesToImport = chosenEpisodes
            .map(
                episodeName => episodeFiles.find(
                    episodeFile => episodeFile.filename === episodeName
                )
            ).filter(
                episode => !!episode
            ) as Array<EpisodeFile>;

        const seasonName = seasons
            .find(season => season.id === seasonId)
            ?.name;

        if (!seasonName)
            throw new Error("Season not found");

        for (let i = 0; i < episodesToImport.length; i++) {
            const episodeToImport = episodesToImport[i];

            const episodeNumber = isPositionIncludedInTitle
                ? i + initialPosition
                : i + 1;

            const episodeToImportPayload = {
                name: `${seasonName} Episódio ${episodeNumber}`,
                seasonId,
                duration: episodeToImport.duration,
                path: episodeToImport.path,
                position: initialPosition + i
            };

            const response = await fetch(
                `${API_URL}/episode/create`,

                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${userToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(episodeToImportPayload)
                }
            );
            const data = await response.json();

            if (!response.ok) {
                if (data.reason)
                    setReasons(data.reason);

                setStatusCode(response.status as ErrorCardStatusCodeProp);
                wasImportSuccessful = false;
                break;
            }

            const importProgress = i / episodesToImport.length * 100;
            setImportProgress(importProgress);
        }

        setIsImportLoading(false);
        setImportProgress(100);
        setWasUpsertSuccessful(wasImportSuccessful);
    };

    const handleEpisodeSort = (previousEpisode: string, currentEpisode: string) => {
        if (!sortRegex)
            return 0;

        const previousEpisodeNumberRawList = previousEpisode.match(sortRegex);
        const currentEpisodeNumberRawList = currentEpisode.match(sortRegex);

        const previousEpisodeNumberRaw = previousEpisodeNumberRawList
            ? previousEpisodeNumberRawList[1]
            : "";

        const currentEpisodeNumberRaw = currentEpisodeNumberRawList
            ? currentEpisodeNumberRawList[1]
            : "";

        const previousEpisodeNumber = Number(previousEpisodeNumberRaw);
        const currentEpisodeNumber = Number(currentEpisodeNumberRaw);

        return previousEpisodeNumber - currentEpisodeNumber;
    };

    const handleToggleEpisodeNumberPosition = (event: ChangeEvent<HTMLInputElement>) => {
        setIsPositionIncludedInTitle(!!event.target.checked);
    };

    useEffect(
        () => {
            setIsRequestLoading(true);
            setAreSeasonsLoading(true);

            fetch(
                `${API_URL}/raw/folder/all`,

                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }
            )
                .then(
                    async response => {
                        const data = await response.json() as Array<string>;

                        if (!response.ok) {
                            console.error(data);
                            setStatusCode(response.status as ErrorCardStatusCodeProp);
                            return;
                        }

                        setFolders(data);
                    }
                )
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));

            fetch(
                `${API_URL}/season/all?page=1&quantity=50&orderColumn=name&orderBy=asc${seasonsSearch.length > 0 ? `&search=${seasonsSearch}` : ""}`
            )
                .then(handleSeasonsResponse)
                .catch(console.error)
                .finally(() => setAreSeasonsLoading(false));

        },

        []
    );

    useEffect(
        () => {
            if (!folderData)
                return setEpisodeFiles([]);

            setIsEpisodesLoading(true);
            setChosenEpisodes([]);

            fetch(
                `${API_URL}/raw/folder/get/${folderData.index}`,

                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    }
                }
            )
                .then(handleFoldersResponse)
                .catch(console.error)
                .finally(() => setIsEpisodesLoading(false));
        },

        [
            folderData
        ]
    );

    useEffect(
        () => {
            setAreSeasonsLoading(true);

            const timeToWaitBeforeSearchingInMilliseconds = 300;

            if (seasonsSearchTimer)
                clearTimeout(seasonsSearchTimer);

            const newSeasonsSearchTimer = setTimeout(
                () => {
                    fetch(
                        `${API_URL}/season/all?page=1&quantity=50&orderColumn=name&orderBy=asc${seasonsSearch.length > 0 ? `&search=${seasonsSearch}` : ""}`
                    )
                        .then(handleSeasonsResponse)
                        .catch(console.error)
                        .finally(() => setAreSeasonsLoading(false));
                },

                timeToWaitBeforeSearchingInMilliseconds
            );

            setSeasonsSearchTimer(newSeasonsSearchTimer);
        },

        [seasonsSearch]
    );

    const loadingStyle: CSSProperties = {
        textAlign: "center",
        width: "100%",
        paddingTop: "50%",
        transform: "translateY(-50%)"
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(
            KeyboardSensor,

            {
                coordinateGetter: sortableKeyboardCoordinates
            }
        )
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {
            active,
            over
        } = event;

        if (!over)
            return;

        if (active.id !== over.id) {
            setChosenEpisodes(
                chosenEpisodesCb => {
                    const oldIndex = chosenEpisodesCb.indexOf(String(active.id));
                    const newIndex = chosenEpisodesCb.indexOf(String(over.id));

                    const newArray = arrayMove(chosenEpisodesCb, oldIndex, newIndex);

                    return newArray;
                }
            );
        }
    };

    const importButton = (
        <Button
            variant="contained"
            onClick={handleImport}
            disabled={!!isImportLoading}
            fullWidth
        >
            {
                isImportLoading
                    ? <CircularProgress
                        variant="determinate"
                        value={importProgress}
                        size={20}
                    />
                    : "Importar"
            }
        </Button>
    );

    return (
        <>
            <Typography
                variant="h4"
                component="h2"
                sx={{ marginBottom: 1 }}
                id="top"
            >
                Importar Episódios
            </Typography>

            <Divider sx={{ marginBottom: 2 }} />

            {
                isRequestLoading
                    ? <Box sx={loadingStyle}>
                        <CircularProgress />
                    </Box>
                    : <Box>
                        {
                            folders.length > 0
                                ? <Box>
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        Passo 1: Adicionar Dados
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={9}>
                                            <Autocomplete
                                                options={seasons}
                                                getOptionLabel={
                                                    season => season.name
                                                }
                                                isOptionEqualToValue={
                                                    (option, value) => option.id === value.id
                                                }
                                                onChange={
                                                    (_event, season) => setSeasonId(season?.id || null)
                                                }
                                                onInputChange={
                                                    (_event, seasonName) => setSeasonsSearch(seasonName)
                                                }
                                                defaultValue={null}
                                                renderInput={
                                                    params => <TextField
                                                        {...params}
                                                        InputProps={
                                                            {
                                                                ...params.InputProps,
                                                                endAdornment: <>
                                                                    {
                                                                        areSeasonsLoading
                                                                            ? <CircularProgress size={20} />
                                                                            : null
                                                                    }
                                                                    {
                                                                        params.InputProps.endAdornment
                                                                    }
                                                                </>
                                                            }
                                                        }
                                                        label="Temporada relacionada"
                                                        variant="outlined"
                                                    />
                                                }
                                                noOptionsText={
                                                    areSeasonsLoading
                                                        ? "Carregando..."
                                                        : "Não há episódios disponíveis."
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <TextField
                                                name="position"
                                                label="Posição inicial"
                                                type="number"
                                                defaultValue={initialPosition}
                                                onChange={
                                                    event => {
                                                        const initialPosition = Number(
                                                            event.currentTarget.value
                                                        );

                                                        setInitialPosition(
                                                            Number.isNaN(initialPosition)
                                                                ? 1
                                                                : initialPosition
                                                        )
                                                    }
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={9}>
                                            <Autocomplete
                                                options={folders}
                                                getOptionLabel={option => option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                onChange={
                                                    (_event, folderName) => setFolderData(
                                                        folderName
                                                            ? ({
                                                                name: folderName,
                                                                index: folders.indexOf(folderName)
                                                            })
                                                            : null
                                                    )
                                                }
                                                renderInput={
                                                    params => <TextField
                                                        {...params}
                                                        InputProps={
                                                            {
                                                                ...params.InputProps,
                                                                endAdornment: <>
                                                                    {
                                                                        isRequestLoading
                                                                            ? <CircularProgress />
                                                                            : null
                                                                    }
                                                                    {
                                                                        params.InputProps.endAdornment
                                                                    }
                                                                </>
                                                            }
                                                        }
                                                        label="Pasta a ser importada"
                                                        variant="outlined"
                                                    />
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch onClick={handleToggleEpisodeNumberPosition as any} />
                                                    }
                                                    label="Considerar posição no número do episódio"
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>

                                    {
                                        !!folderData && !!seasonId
                                            ? <>
                                                <Typography
                                                    variant="h5"
                                                    component="h3"
                                                    sx={{ marginTop: 4 }}
                                                >
                                                    Passo 2: Escolher arquivos
                                                    {
                                                        isEpisodesLoading
                                                        ? <Box sx={loadingStyle}>
                                                            <CircularProgress />
                                                        </Box>
                                                        : <Box>
                                                            {
                                                                episodeFiles.length > 0
                                                                    ? <Box>
                                                                        <TransferList<string>
                                                                            leftList={
                                                                                episodeFiles.map(
                                                                                    episodeFile => episodeFile.filename
                                                                                )
                                                                            }
                                                                            handleChosen={handleChosenEpisodes}
                                                                            sx={{ marginTop: 1 }}
                                                                        />

                                                                        {
                                                                            chosenEpisodes.length > 0
                                                                                ? <Box>
                                                                                    <Typography
                                                                                        variant="h5"
                                                                                        component="h3"
                                                                                        sx={{ marginTop: 4, marginBottom: 2 }}
                                                                                    >
                                                                                        Passo 3: Ordenar episódios
                                                                                    </Typography>

                                                                                    {
                                                                                        isRefreshingSort
                                                                                            ? <CircularProgress sx={{ marginTop: 4 }} />
                                                                                            : <>
                                                                                                <Grid container
                                                                                                    spacing={2}
                                                                                                    sx={{ marginBottom: 2 }}
                                                                                                >
                                                                                                    <Grid item xs={4.5}>
                                                                                                        <TextField
                                                                                                            label="Regex de ordenação (opcional)"
                                                                                                            onChange={
                                                                                                                event => {
                                                                                                                    const rawRegex = event.currentTarget.value;
                                                                                                                    setSortRegex(null);

                                                                                                                    setSortRegex(
                                                                                                                        rawRegex
                                                                                                                            ? new RegExp(event.currentTarget.value)
                                                                                                                            : null
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                            size="small"
                                                                                                            fullWidth
                                                                                                        />
                                                                                                    </Grid>

                                                                                                    <Grid item xs={1.5}>
                                                                                                        <Button
                                                                                                            variant="contained"
                                                                                                            onClick={
                                                                                                                () => {
                                                                                                                    setIsRefreshingSort(true);
                                                                                                                    setChosenEpisodes(
                                                                                                                        previousChosenEpisodes => previousChosenEpisodes.sort(handleEpisodeSort)
                                                                                                                    );

                                                                                                                    const averageTimeToLoadPerItemInMilliseconds = 3.378;
                                                                                                                    const timeUntilStopRefreshingInMilliseconds = Math.round(
                                                                                                                        averageTimeToLoadPerItemInMilliseconds * chosenEpisodes.length
                                                                                                                    );
                                                                                                                    setTimeout(
                                                                                                                        () => {
                                                                                                                            setIsRefreshingSort(false);
                                                                                                                            setSortRegex(null);
                                                                                                                        },

                                                                                                                        timeUntilStopRefreshingInMilliseconds
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                            disabled={!sortRegex}
                                                                                                            fullWidth
                                                                                                        >
                                                                                                            Ordenar
                                                                                                        </Button>
                                                                                                    </Grid>

                                                                                                    <Grid item xs={6}>
                                                                                                        {importButton}
                                                                                                    </Grid>
                                                                                                </Grid>

                                                                                                <DndContext
                                                                                                    sensors={sensors}
                                                                                                    collisionDetection={closestCenter}
                                                                                                    onDragEnd={handleDragEnd}
                                                                                                >
                                                                                                    <SortableContext
                                                                                                        items={chosenEpisodes}
                                                                                                        strategy={verticalListSortingStrategy}
                                                                                                    >
                                                                                                        {
                                                                                                            chosenEpisodes.map(
                                                                                                                chosenEpisode => <Sortable
                                                                                                                    key={chosenEpisode}
                                                                                                                    id={chosenEpisode}
                                                                                                                >
                                                                                                                    <EpisodeFileCard
                                                                                                                        episodeTitle={chosenEpisode}
                                                                                                                        sx={{ marginBottom: 2 }}
                                                                                                                    />
                                                                                                                </Sortable>
                                                                                                            )
                                                                                                        }
                                                                                                    </SortableContext>
                                                                                                </DndContext>

                                                                                                <Box sx={{ marginTop: 6 }}>
                                                                                                    {importButton}
                                                                                                </Box>
                                                                                            </>
                                                                                    }
                                                                                </Box>
                                                                                : null
                                                                        }
                                                                    </Box>
                                                                    : unexpectedErrorComponent
                                                            }
                                                        </Box>
                                                    }
                                                </Typography>
                                            </>
                                            : null
                                    }
                                </Box>
                                : unexpectedErrorComponent
                        }
                    </Box>
            }

            <GoToTopFAB href="#top"/>

            <ErrorCard
                isOpen={!!statusCode}
                statusCode={statusCode}
                reasons={reasons}
                handleClose={
                    () => {
                        setStatusCode(null);
                        setReasons(undefined);
                        window.location.reload();
                    }
                }
            />

            <SuccessCard
                message="Episódios importados com sucesso!"
                isOpen={wasUpsertSuccessful}
                handleClose={
                    () => {
                        setWasUpsertSuccessful(false)
                        window.location.reload();
                    }
                }
            />
        </>
    );
};
