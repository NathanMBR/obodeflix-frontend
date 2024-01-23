import {
  Autocomplete,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  type TextFieldProps
} from "@mui/material"
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import {
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState
} from "react"

import { DragHandle } from "@mui/icons-material"

import {
  DefaultHeader,
  SaveFAB,
  Sortable
} from "../../components"
import type {
  Season,
  Series,
  SeriesNameLanguages,
  Tag
} from "../../types"

export interface AdminPanelUpsertSeriesFormProps {
  series?: Series
  tags: Array<Tag>
  seasons: Array<Season>
  isRequestLoading: boolean
  areTagsLoading: boolean
  areSeasonsLoading: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  handleTagsChange: (_event: SyntheticEvent, tags: Array<Tag>) => void
  handleTagSearch: (_event: SyntheticEvent, tagName: string) => void
  handleSeasonsChange: (seasons: Array<Season>) => void
}

export const AdminPanelUpsertSeriesForm = (props: AdminPanelUpsertSeriesFormProps) => {
  const {
    series,
    tags,
    seasons,
    isRequestLoading,
    areTagsLoading,
    areSeasonsLoading,
    handleSubmit,
    handleTagsChange,
    handleTagSearch,
    handleSeasonsChange
  } = props

  type MainNameLanguageInputValue = SeriesNameLanguages | ""

  const mainNameRef = useRef<TextFieldProps>()
  const alternativeNameRef = useRef<TextFieldProps>()
  const [mainNameLanguage, setMainNameLanguage] = useState<MainNameLanguageInputValue>("")
  const descriptionRef = useRef<TextFieldProps>()
  const imageAddressRef = useRef<TextFieldProps>()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(
      KeyboardSensor,
      {
        coordinateGetter: sortableKeyboardCoordinates
      }
    )
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event

    if (!over)
      return

    if (active.id === over.id)
      return

    const oldIndex = seasons.findIndex(season => season.id === active.id)
    if (oldIndex < 0)
      return

    const newIndex = seasons.findIndex(season => season.id === over.id)
    if (newIndex < 0)
      return

    const sortedSeasons = arrayMove(
      seasons,
      oldIndex,
      newIndex
    )

    handleSeasonsChange(sortedSeasons)
  }

  useEffect(
    () => {
      if (!series)
        return

      if (mainNameRef.current)
        mainNameRef.current.value = series.mainName

      if (alternativeNameRef.current)
        alternativeNameRef.current.value = series.alternativeName

      setMainNameLanguage(series.mainNameLanguage)

      if (descriptionRef.current)
        descriptionRef.current.value = series.description

      if (imageAddressRef.current)
        imageAddressRef.current.value = series.imageAddress
    },
    [series]
  )

  const handleMainNameLanguageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newMainNameLanguage = event.target.value as MainNameLanguageInputValue

    setMainNameLanguage(newMainNameLanguage)
  }

  const defaultTags = series?.seriesTags.map(seriesTag => seriesTag.tag) || []

  return (
    <>

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
          mt={2}
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
          mt={2}
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
          mt={2}
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

        {
          series
            ? <Grid item
              xs={12}
              mt={4}
            >
              <Divider />

              <Typography
                variant="h5"
                component="h3"
                mt={4}
              >
                Temporadas
              </Typography>

              {
                areSeasonsLoading
                  ? <CircularProgress />
                  : <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={seasons.map(season => season.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {
                        seasons.map(
                          season => <Sortable
                            id={season.id}
                            key={season.id}
                          >
                            <Paper
                              elevation={12}
                              sx={{ margin: 2 }}
                            >
                              <Card>
                                <CardContent>
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                  >
                                    <DragHandle />

                                    <Typography variant="body1">{season.name}</Typography>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Paper>
                          </Sortable>
                        )
                      }
                    </SortableContext>
                  </DndContext>
              }
            </Grid>
            : null
        }

        <SaveFAB
          loading={isRequestLoading}
          submit
        />
      </form>
    </>
  )
}
