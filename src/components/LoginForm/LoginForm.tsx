import {
    ChangeEvent,
    FormEvent,
    useRef,
    useState
} from "react";
import {
    Button,
    Card,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";

export interface LoginFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void
    isRequestLoading: boolean
}

export const LoginForm = (props: LoginFormProps) => {
    const {
        handleSubmit,
        isRequestLoading
    } = props;

    const emailRef = useRef<TextFieldProps>();
    const passwordRef = useRef<TextFieldProps>();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleFormValidation = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        type InputsToValidate = "email" | "password";
        const validations = new Map<InputsToValidate, () => void>()
            .set(
                "email",
                () => {
                    if (value && !value.includes("@")) {
                        setEmailError("O email deve possuir um formato válido");
                        return;
                    }

                    setEmailError("");
                }
            )
            .set(
                "password",
                () => {
                    if (value && value.length < 8) {
                        setPasswordError("A senha deve ter pelo menos 8 caracteres");
                        return;
                    }

                    setPasswordError("");
                }
            );

        const validatorFunction = validations.get(name as InputsToValidate);
        if (validatorFunction)
            validatorFunction();
    }

    return (
        <>
            <Paper elevation={12}>
                <Card sx={{ padding: 8, textAlign: "center" }}>
                    <Typography variant="h4" component="h2">Faça seu login</Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Divider />
                            <TextField
                                name="email"
                                label="E-mail"
                                type="email"
                                onChange={handleFormValidation}
                                error={!!emailError}
                                helperText={emailError}
                                inputRef={emailRef}
                            />

                            <TextField
                                name="password"
                                label="Senha"
                                type="password"
                                onChange={handleFormValidation}
                                error={!!passwordError}
                                helperText={passwordError}
                                inputRef={passwordRef}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    isRequestLoading ||
                                    !emailRef.current?.value ||
                                    !!emailError ||
                                    !passwordRef.current?.value ||
                                    !!passwordError
                                }
                            >
                                {
                                    isRequestLoading
                                        ? <CircularProgress size={24} />
                                        : "Fazer login"
                                }
                            </Button>
                        </Stack>
                    </form>
                </Card>
            </Paper>
        </>
    );
}