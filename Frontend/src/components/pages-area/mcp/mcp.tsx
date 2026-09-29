import { FormEvent, useState } from "react";
import axios from "axios";
import { Alert, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useUser } from "../../../hooks/use-user";
import { mcpService } from "../../../services/mcp-service";
import "./mcp.css";

const examples = ["How many vacations are active now?", "What is the average vacation price?", "Which future vacations are in Europe?"];

// Retrieves database evidence through the backend and displays the resulting answer.
export function Mcp() {
    const isLoggedIn = useUser();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Validates the question and requests an answer based on live vacation data.
    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if (isLoading) return;
        const cleanQuestion = question.trim();
        setError("");
        setAnswer("");
        if (!cleanQuestion || cleanQuestion.length > 500) {
            setError("Enter a question containing 1–500 characters.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await mcpService.askQuestion(cleanQuestion);
            setAnswer(result.answer);
        }
        catch (error) {
            const message = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
            setError(message || "Could not load an answer. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }

    if (!isLoggedIn) return null;
    return (
        <div className="Mcp FormPage">
            <Paper className="FormPanel" sx={{ p: 3, width: "100%", maxWidth: 720 }}>
                <Typography variant="h4" component="h1" gutterBottom>Ask About Vacations</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Ask about available vacations, dates, counts, and prices from our database.</Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {examples.map(example => <Button key={example} type="button" variant="outlined" disabled={isLoading} onClick={() => setQuestion(example)}>{example}</Button>)}
                </Stack>
                <form className="AppForm" onSubmit={handleSubmit}>
                    <TextField label="Your question" value={question} onChange={event => setQuestion(event.target.value)} multiline minRows={2} fullWidth required disabled={isLoading} slotProps={{ htmlInput: { maxLength: 500 } }} />
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>{isLoading ? "Checking vacations..." : "Ask"}</Button>
                </form>
                {isLoading && <Stack direction="row" spacing={1} role="status" sx={{ mt: 2, alignItems: "center" }}><CircularProgress size={20} /><Typography>Preparing your answer...</Typography></Stack>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {answer && <section aria-label="Answer" aria-live="polite"><Typography component="h2" variant="h6" sx={{ mt: 3 }}>Answer</Typography><Typography sx={{ mt: 1, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{answer}</Typography></section>}
            </Paper>
        </div>
    );
}
