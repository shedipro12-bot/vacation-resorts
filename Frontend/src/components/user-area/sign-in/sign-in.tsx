import { useState } from "react";
import type { FormEvent } from "react";
import { CredentialsModel } from "../../../models/credential-model";
import { userService } from "../../../services/user-service";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
// Displays the login form and keeps track of its input values.
export function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [send, handleSumbit]
    // Prevents page reload and prepares the credentials for the login request.
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const credentials: CredentialsModel = { email, password }
            await userService.login(credentials);

            navigate("/vacations");
        }
        catch (error) {
            notify.error(error)
        }

        // Next: send credentials through the authentication service.\
    }

    return (
        <div className="Login">
            <h1>Sign in</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" value={email} required onChange={event => setEmail(event.target.value)} aria-required />

                <label htmlFor="password">Password:</label>
                <input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} required />

                <button type="submit">Log in</button>
            </form>
        </div>
    );
}