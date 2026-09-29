import { FormEvent, useState } from "react";
import { Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { useUser } from "../../../hooks/use-user";
import { aiService } from "../../../services/ai-service";
import "./ai.css";

// Displays a protected form for requesting AI travel recommendations.
export function AI() {
    const isLoggedIn = useUser();
    const [destination, setDestination] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Requests recommendations and updates the loading, answer, and error states.
    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if (isLoading) return;

        const cleanDestination = destination.trim();
        if (!cleanDestination) {
            setError("Please enter a destination.");
            return;
        }

        setIsLoading(true);
        setAnswer("");
        setError("");

        try {
            const recommendation = await aiService.getRecommendations(cleanDestination);
            setAnswer(recommendation);
        }
        catch {setError("Could not load recommendations. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }

    if (!isLoggedIn) return null;

    return (
        <div className="AI FormPage">
            <Paper className="FormPanel" sx={{ p: 3, width: "100%", maxWidth: 720 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    AI Travel Recommendations
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Enter a destination to discover attractions, local food, and travel tips.
                </Typography>

                <form className="AppForm" onSubmit={handleSubmit}>
                    <TextField              label="Destination"
                        placeholder="For example: Tokyo, Japan"
                        value={destination}
                        onChange={event => setDestination(event.target.value)}
                        disabled={isLoading}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        fullWidth
                        required
                    />
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
                        {isLoading ? "Preparing recommendations..." : "Get recommendations"}
                    </Button>
                </form>

                {isLoading && (
                    <div role="status" style={{ marginTop: 24 }}>
                        <CircularProgress size={24} aria-label="Loading recommendations" />
                    </div>
                )}

                {error && (
                    <Typography role="alert" color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {answer && (
                    <section aria-label="Travel recommendations" aria-live="polite">
                        <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
                            Your recommendations
                        </Typography>
                        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                            {answer}
                        </Typography>
                    </section>
                )}
            </Paper>
        </div>
    );
}