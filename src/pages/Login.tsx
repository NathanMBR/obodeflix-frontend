import {
    FormEvent,
    useState
} from "react";

import {
    ErrorCard,
    ErrorCardStatusCodeProp,
    LoginForm
} from "../components";
import { API_URL } from "../settings";

export const Login = () => {
    if (localStorage.getItem("token")) {
        window.location.href = "/";
        return null;
    }

    const [showError, setShowError] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);

    const [isRequestLoading, setIsRequestLoading] = useState(false);

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setShowError(true);
            setStatusCode(response.status as ErrorCardStatusCodeProp);

            if (data.reason)
                setReasons(data.reason);

            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("type", data.user.type);
        localStorage.setItem("id", data.user.id);

        window.location.href = "/";
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsRequestLoading(true);

        const emailInput = event
            .currentTarget
            .elements
            .namedItem("email") as
            HTMLInputElement | null;
        if (!emailInput)
            return;

        const passwordInput = event
            .currentTarget
            .elements
            .namedItem("password") as
            HTMLInputElement | null;
        if (!passwordInput)
            return;

        const authenticateUserPayload = {
            email: emailInput.value,
            password: passwordInput.value
        };

        fetch(
            `${API_URL}/user/authenticate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(authenticateUserPayload)
            }
        )
            .then(handleFetchResponse)
            .catch(console.error)
            .finally(() => setIsRequestLoading(false));
    }

    const handleErrorClose = () => {
        setShowError(false);
        setStatusCode(null);
        setReasons(undefined);
    }

    return (
        <>
            <LoginForm
                handleSubmit={handleSubmit}
                isRequestLoading={isRequestLoading}
            />
            <ErrorCard
                isOpen={showError}
                statusCode={statusCode}
                reasons={reasons}
                handleClose={handleErrorClose}
            />
        </>
    )
}