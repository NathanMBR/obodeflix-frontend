import {
    FormEvent,
    useState
} from "react";

import {
    SignUpForm,
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../components";
import { API_URL } from "../settings";

export const SignUp = () => {
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setShowError(true);
            setStatusCode(response.status as ErrorCardStatusCodeProp);
            if (data.reason)
                setReasons(data.reason);

            return;
        }

        setShowSuccess(true);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsRequestLoading(true);

        const nameInput = event.currentTarget.elements.namedItem("name") as HTMLInputElement | null;
        if (!nameInput)
            return;

        const emailInput = event.currentTarget.elements.namedItem("email") as HTMLInputElement | null;
        if (!emailInput)
            return;

        const passwordInput = event.currentTarget.elements.namedItem("password") as HTMLInputElement | null;
        if (!passwordInput)
            return;

        const createUserPayload = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };

        fetch(
            `${API_URL}/user/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(createUserPayload)
            }
        )
            .then(handleFetchResponse)
            .catch(console.error)
            .finally(() => setIsRequestLoading(false));
    }

    const handleErrorClose = () => {
        setShowError(false)
        setStatusCode(null);
        setReasons(undefined);
    }

    const handleSuccessClose = () => {
        setShowSuccess(false);
        window.location.href = "/login";
    }

    return (
        <>
            <SignUpForm
                handleSubmit={handleSubmit}
                isRequestLoading={isRequestLoading}
            />
            <ErrorCard
                statusCode={statusCode}
                isOpen={showError}
                handleClose={handleErrorClose}
                reasons={reasons}
            />
            <SuccessCard isOpen={showSuccess} handleClose={handleSuccessClose} message="Conta criada com sucesso! Por favor, realize seu login." />
        </>
    );
}