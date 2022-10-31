import {
    ChangeEvent,
    FormEvent,
    useRef,
    useState
} from "react";
import {
    Button,
    Card,
    Divider,
    Paper,
    Stack,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";

export interface SignUpFormProps {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const SignUpForm = (props: SignUpFormProps) => {
    const { handleSubmit } = props;

    const nameRef = useRef<TextFieldProps>();
    const emailRef = useRef<TextFieldProps>();
    const passwordRef = useRef<TextFieldProps>();
    const confirmPasswordRef = useRef<TextFieldProps>();

    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [nameHelperText, setNameHelperText] = useState("");
    const [emailHelperText, setEmailHelperText] = useState("");
    const [passwordHelperText, setPasswordHelperText] = useState("");
    const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState("");

    const handleFormValidation = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        type InputsToValidate = "name" | "email" | "password" | "confirm-password";
        const validations = new Map<InputsToValidate, () => void>()
            .set(
                "name",
                () => {
                    if (value && value.length < 3) {
                        setNameError(true);
                        setNameHelperText("O nome deve ter pelo menos 3 caracteres");
                        return;
                    }

                    setNameError(false);
                    setNameHelperText("");
                }
            )
            .set(
                "email",
                () => {
                    if (value && !value.includes("@")) {
                        setEmailError(true);
                        setEmailHelperText("O email deve possuir um formato válido");
                        return;
                    }

                    setEmailError(false);
                    setEmailHelperText("");
                }
            )
            .set(
                "password",
                () => {
                    if (value && value.length < 8) {
                        setPasswordError(true);
                        setPasswordHelperText("A senha deve ter pelo menos 8 caracteres");
                        return;
                    }

                    setPasswordError(false);
                    setPasswordHelperText("");
                }
            )
            .set(
                "confirm-password",
                () => {
                    const passwordInput = passwordRef.current;
                    if (value && passwordInput && passwordInput.value && passwordInput.value !== value) {
                        setConfirmPasswordError(true);
                        setConfirmPasswordHelperText("As senhas devem ser iguais");
                        return;
                    }

                    setConfirmPasswordError(false);
                    setConfirmPasswordHelperText("");
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
                    <Typography variant="h4" component="h2">Crie sua conta</Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Divider />
                            <TextField
                                inputRef={nameRef}
                                name="name"
                                label="Name"
                                type="text"
                                onChange={handleFormValidation}
                                error={nameError}
                                helperText={nameHelperText}
                            />

                            <TextField
                                inputRef={emailRef}
                                name="email"
                                label="E-mail"
                                type="email"
                                onChange={handleFormValidation}
                                error={emailError}
                                helperText={emailHelperText}
                            />

                            <TextField
                                inputRef={passwordRef}
                                name="password"
                                label="Senha"
                                type="password"
                                onChange={handleFormValidation}
                                error={passwordError}
                                helperText={passwordHelperText}
                            />

                            <TextField
                                inputRef={confirmPasswordRef}
                                name="confirm-password"
                                label="Confirme sua senha"
                                type="password"
                                onChange={handleFormValidation}
                                error={confirmPasswordError}
                                helperText={confirmPasswordHelperText}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    !nameRef.current?.value || nameError ||
                                    !emailRef.current?.value || emailError ||
                                    !passwordRef.current?.value || passwordError ||
                                    !confirmPasswordRef.current?.value || confirmPasswordError
                                }
                            >
                                Criar conta
                            </Button>
                        </Stack>
                    </form>
                </Card>
            </Paper>
        </>
    );
}