import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {
    ChangeEvent,
    CSSProperties,
    FormEvent,
    useEffect,
    useState
} from "react";
import { Link } from "react-router-dom";

import {
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../../components";
import { Comment } from "../../types";
import { API_URL } from "../../settings";

interface CommentData {
    body: string;
    parentId?: number;
    seriesId?: number;
    episodeId?: number;
}

export interface ReplyProps {
    comment?: Comment.Parent | Comment.Child;
    reference: {
        key: "parentId" | "seriesId" | "episodeId";
        value: number;
    };
    isEdit?: boolean;
}

export const Reply = (props: ReplyProps) => {
    const {
        comment,
        reference,
        isEdit
    } = props;

    const userToken = localStorage.getItem("token");

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);
    const [wasUpsertSuccessful, setWasUpsertSuccessful] = useState(false);

    const [body, setBody] = useState("");

    useEffect(
        () => {
            if (comment)
                setBody(comment.body);
        },
        []
    );

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);

            if (data.reason)
                setReasons(data.reason);

            return;
        }

        setWasUpsertSuccessful(true);
    };

    const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBody(event.currentTarget.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsRequestLoading(true);

        const commentData: CommentData = {
            body
        };
        commentData[reference.key] = reference.value;

        if (isEdit)
            return fetch(
                `${API_URL}/comment/update/${comment!.id}`,

                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`
                    },
                    body: JSON.stringify(commentData)
                }
            )
                .then(handleFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));

        return fetch(
            `${API_URL}/comment/create`,

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify(commentData)
            }
        )
            .then(handleFetchResponse)
            .catch(console.error)
            .finally(() => setIsRequestLoading(false));
    };

    const fullSizeStyle: CSSProperties = {
        width: "100%",
        height: "100%"
    };

    return (
        <>
            {
                userToken
                    ? <>
                        <form
                            style={fullSizeStyle}
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                name="comment"
                                label="Comentário"
                                minRows={6}
                                defaultValue={isEdit ? body : undefined}
                                onChange={handleBodyChange}
                                sx={{ marginBottom: 2 }}
                                multiline
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    isRequestLoading ||
                                    !body
                                }
                                fullWidth
                            >
                                {
                                    isRequestLoading
                                        ? <CircularProgress
                                            size={24}
                                            color="inherit"
                                        />
                                        : "Salvar comentário"
                                }
                            </Button>
                        </form>
                    </>
                    : <>
                        <Stack
                            direction="column"
                            sx={{ alignItems: "center", width: "100%" }}
                        >
                            <Typography variant="body1">
                                Você precisa estar logado para comentar.

                                <Link to="/login">
                                    <Button>
                                        Fazer login
                                    </Button>
                                </Link>
                            </Typography>

                            <Typography variant="body2">
                                Não tem uma conta?

                                <Link to="/signup">
                                    <Button size="small">
                                        Criar conta
                                    </Button>
                                </Link>
                            </Typography>
                        </Stack>
                    </>
            }

            <ErrorCard
                isOpen={!!statusCode}
                statusCode={statusCode}
                reasons={reasons}
                handleClose={
                    () => {
                        setStatusCode(null);
                        setReasons(undefined);
                    }
                }
            />

            <SuccessCard
                message={
                    isEdit
                        ? "Comentário editado com sucesso!"
                        : "Comentário criado com sucesso!"
                }
                isOpen={wasUpsertSuccessful}
                handleClose={
                    () => {
                        setWasUpsertSuccessful(false);
                        window.location.reload();
                    }
                }
            />
        </>
    );
}