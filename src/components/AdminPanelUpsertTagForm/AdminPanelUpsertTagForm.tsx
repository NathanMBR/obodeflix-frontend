import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    TextFieldProps
} from "@mui/material";
import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState
} from "react";

import { DefaultHeader } from "../../components";
import { Tag } from "../../types";

export interface AdminPanelUpsertTagFormProps {
    tag?: Tag;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isRequestLoading: boolean;
}

export const AdminPanelUpsertTagForm = (props: AdminPanelUpsertTagFormProps) => {
    const {
        tag,
        handleSubmit,
        isRequestLoading
    } = props;

    const nameRef = useRef<TextFieldProps>();
    const [name, setName] = useState(tag?.name || "");

    useEffect(
        () => {
            if (tag) {
                if (nameRef.current)
                    nameRef.current.value = tag.name;
            }
        },

        [tag]
    );

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <>
            <Paper elevation={12}>
                <Card>
                    <CardContent>
                        <DefaultHeader style={{ textAlign: "center" }}>
                            {
                                tag
                                    ? "Editar tag"
                                    : "Cadastrar tag"
                            }
                        </DefaultHeader>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        label="Nome"
                                        inputRef={nameRef}
                                        onChange={handleNameChange}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={
                                            isRequestLoading ||
                                            name.length <= 0
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
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Paper>
        </>
    );
}