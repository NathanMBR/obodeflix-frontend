import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    Grid,
    MenuItem,
    Paper,
    Switch,
    TextField,
    TextFieldProps
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    ChangeEvent,
    FormEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";

import { DefaultHeader } from "../../components";
import {
    Season,
    SeasonTypes,
    Series
} from "../../types";

export interface AdminPanelUpsertSeasonFormProps {
    season?: Season;
    series: Array<Series>;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isRequestLoading: boolean;
    areSeriesLoading: boolean;
    showSeriesAlternativeNames: boolean;
    handleToggleSeriesNames: () => void;
    handleSeriesChange: (_event: SyntheticEvent, series: Series | null) => void;
    handleSeriesSearch: (_event: SyntheticEvent, seriesName: string) => void;
};

export const AdminPanelUpsertSeasonForm = (props: AdminPanelUpsertSeasonFormProps) => {
    const {
        season,
        series,
        handleSubmit,
        isRequestLoading,
        areSeriesLoading,
        showSeriesAlternativeNames,
        handleToggleSeriesNames,
        handleSeriesChange,
        handleSeriesSearch
    } = props;

    type SeasonTypeInputValue = SeasonTypes | "";

    const nameRef = useRef<TextFieldProps>();
    const [seasonType, setSeasonType] = useState<SeasonTypeInputValue>("");
    const positionRef = useRef<TextFieldProps>();
    const [seriesId, setSeriesId] = useState<number | null>(null);

    useEffect(
        () => {
            if (season) {
                if (nameRef.current)
                    nameRef.current.value = season.name;

                if (positionRef.current)
                    positionRef.current.value = season.position;

                setSeasonType(season.type);

                if (season.seriesId)
                    setSeriesId(season.seriesId);
            }
        },
        [season]
    );

    const handleSeasonTypeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newSeasonType = event.target.value as SeasonTypeInputValue;

        setSeasonType(newSeasonType);
    };

    const gridItemSpacingStyle: CSSProperties = {
        marginTop: 2
    };

    return (
        <>
            <Paper elevation={12}>
                <Card>
                    <CardContent>
                        <DefaultHeader style={{ textAlign: "center" }}>
                            {
                                season
                                    ? "Editar temporada"
                                    : "Cadastrar temporada"
                            }
                        </DefaultHeader>

                        <form onSubmit={handleSubmit}>
                            <Grid container
                                spacing={2}
                            >
                                <Grid item
                                    xs={10}
                                >
                                    <TextField
                                        name="name"
                                        label="Nome"
                                        inputRef={nameRef}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item
                                    xs={2}
                                >
                                    <TextField
                                        select
                                        name="type"
                                        label="Tipo"
                                        onChange={handleSeasonTypeChange}
                                        SelectProps={{ value: seasonType }}
                                        required
                                        fullWidth
                                    >
                                        <MenuItem value="TV">TV</MenuItem>
                                        <MenuItem value="MOVIE">Filme</MenuItem>
                                        <MenuItem value="OTHER">Outro</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item
                                    xs={1.5}
                                >
                                    <TextField
                                        type="number"
                                        name="position"
                                        label="Posição"
                                        defaultValue={season?.position || null}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item
                                    xs={8.5}
                                >
                                    <Autocomplete
                                        options={series}
                                        getOptionLabel={
                                            series => showSeriesAlternativeNames && series.alternativeName
                                                ? series.alternativeName
                                                : series.mainName
                                        }
                                        isOptionEqualToValue={
                                            (option, value) => option.id === value.id
                                        }
                                        onChange={handleSeriesChange}
                                        onInputChange={handleSeriesSearch}
                                        defaultValue={season?.series || null}
                                        renderInput={
                                            params => <TextField
                                                {...params}
                                                InputProps={
                                                    {
                                                        ...params.InputProps,
                                                        endAdornment: <>
                                                            {
                                                                areSeriesLoading
                                                                    ? <CircularProgress size={20} />
                                                                    : null
                                                            }
                                                            {
                                                                params.InputProps.endAdornment
                                                            }
                                                        </>
                                                    }
                                                }
                                                label="Série relacionada"
                                                name="seriesId"
                                                variant="outlined"
                                            />
                                        }
                                        noOptionsText={
                                            areSeriesLoading
                                                ? "Carregando..."
                                                : "Não há séries disponíveis."
                                        }
                                    />
                                </Grid>

                                <Grid item
                                    xs={2}
                                >
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    onClick={handleToggleSeriesNames}
                                                />
                                            }
                                            label="Exibir nomes alternativos"
                                        />
                                    </FormGroup>
                                </Grid>

                                <Grid item
                                    xs={12}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                    >
                                        {
                                            isRequestLoading
                                                ? <CircularProgress size={20} />
                                                : "Salvar"
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Paper>
        </>
    );
};