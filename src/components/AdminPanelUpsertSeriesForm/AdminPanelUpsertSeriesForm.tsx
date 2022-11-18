import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
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
    Series,
    SeriesNameLanguages,
    Tag,
    TagBuilder
} from "../../types";

export interface AdminPanelUpsertSeriesFormProps {
    series?: Series;
    tags: Array<Tag>;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    handleTagsChange: (_event: SyntheticEvent, tags: Array<Tag>) => void;
    handleTagSearch: (_event: SyntheticEvent, tagName: string) => void;
    isRequestLoading: boolean;
    areTagsLoading: boolean;
}

export const AdminPanelUpsertSeriesForm = (props: AdminPanelUpsertSeriesFormProps) => {
    const {
        series,
        tags,
        handleSubmit,
        handleTagsChange,
        handleTagSearch,
        isRequestLoading,
        areTagsLoading
    } = props;

    type MainNameLanguageInputValue = SeriesNameLanguages | "";

    const mainNameRef = useRef<TextFieldProps>();
    const alternativeNameRef = useRef<TextFieldProps>();
    const [mainNameLanguage, setMainNameLanguage] = useState<MainNameLanguageInputValue>("");
    const descriptionRef = useRef<TextFieldProps>();
    const imageAddressRef = useRef<TextFieldProps>();

    useEffect(
        () => {
            if (series) {
                if (mainNameRef.current)
                    mainNameRef.current.value = series.mainName;

                if (alternativeNameRef.current)
                    alternativeNameRef.current.value = series.alternativeName;

                setMainNameLanguage(series.mainNameLanguage);

                if (descriptionRef.current)
                    descriptionRef.current.value = series.description;

                if (imageAddressRef.current)
                    imageAddressRef.current.value = series.imageAddress;
            }
        },
        [series]
    );

    const handleMainNameLanguageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newMainNameLanguage = event.target.value as MainNameLanguageInputValue;

        setMainNameLanguage(newMainNameLanguage);
    }

    const gridItemSpacingStyle: CSSProperties = {
        marginTop: 2
    };

    const defaultTags = series?.seriesTags.map(seriesTag => seriesTag.tag) || [];

    return (
        <>
            <Paper elevation={12}>
                <Card>
                    <CardContent>
                        <DefaultHeader style={{ textAlign: "center" }}>
                            {
                                series
                                    ? "Editar série"
                                    : "Cadastrar série"
                            }
                        </DefaultHeader>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item
                                    xs={10}
                                >
                                    <TextField
                                        name="mainName"
                                        label="Nome principal"
                                        inputRef={mainNameRef}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item
                                    xs={2}
                                >
                                    <TextField
                                        select
                                        label="Idioma"
                                        name="mainNameLanguage"
                                        onChange={handleMainNameLanguageChange}
                                        SelectProps={{
                                            value: mainNameLanguage
                                        }}
                                        required
                                        fullWidth
                                    >
                                        <MenuItem value="JAPANESE">Japonês</MenuItem>
                                        <MenuItem value="ENGLISH">Inglês</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item
                                    xs={12}
                                >
                                    <TextField
                                        name="alternativeName"
                                        label="Nome alternativo"
                                        inputRef={alternativeNameRef}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Grid item
                                xs={12}
                                sx={gridItemSpacingStyle}
                            >
                                <TextField
                                    name="description"
                                    label="Descrição"
                                    minRows={6}
                                    inputRef={descriptionRef}
                                    multiline
                                    fullWidth
                                />
                            </Grid>

                            <Grid item
                                xs={12}
                                sx={gridItemSpacingStyle}
                            >
                                <TextField
                                    name="imageAddress"
                                    label="Link da imagem"
                                    inputRef={imageAddressRef}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item
                                xs={12}
                                sx={gridItemSpacingStyle}
                            >
                                <Autocomplete
                                    multiple
                                    options={tags}
                                    defaultValue={[...defaultTags]}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={handleTagsChange}
                                    onInputChange={handleTagSearch}
                                    getOptionLabel={tag => tag.name}
                                    filterOptions={options => options}
                                    renderInput={
                                        params => <TextField
                                            {...params}
                                            InputProps={
                                                {
                                                    ...params.InputProps,
                                                    endAdornment: <>
                                                        {
                                                            areTagsLoading
                                                                ? <CircularProgress size={20} />
                                                                : null
                                                        }
                                                        {
                                                            params.InputProps.endAdornment
                                                        }
                                                    </>
                                                }
                                            }
                                            variant="outlined"
                                            label="Tags"
                                            name="tags"
                                        />
                                    }
                                    noOptionsText={
                                        areTagsLoading
                                            ? "Carregando..."
                                            : "Não há tags disponíveis."
                                    }
                                    disableCloseOnSelect
                                />
                            </Grid>

                            <Grid item
                                xs={12}
                                sx={gridItemSpacingStyle}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={
                                        isRequestLoading ||
                                        !mainNameRef.current?.value ||
                                        !mainNameLanguage
                                    }
                                    fullWidth
                                >
                                    {
                                        isRequestLoading
                                            ? <CircularProgress size={24} />
                                            : "Salvar"
                                    }
                                </Button>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Paper>
        </>
    );
};