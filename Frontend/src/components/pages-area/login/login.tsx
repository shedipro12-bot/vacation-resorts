import { useState } from "react";
import type { FormEvent } from "react";
import "./login.css";
import { CredentialsModel } from "../../../models/credential-model";

// Displays the login form and keeps track of its input values.
export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [send, handleSumbit]
    // Prevents page reload and prepares the credentials for the login request.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const credentials: CredentialsModel = { email, password };

        // Next: send credentials through the authentication service.
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