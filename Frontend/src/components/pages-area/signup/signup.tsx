import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import type { RegistrationModel } from "../../../models/registration-model";
import { userService } from "../../../services/user-service";

// Displays registration fields and signs in the newly registered user.
export function Signup() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationModel>({
        defaultValues: { firstName: "", lastName: "", email: "", password: "" }
    });

    // Sends validated registration details and opens the vacations page.
    async function submitRegistration(data: RegistrationModel): Promise<void> {
        setServerError("");

        try {
            await userService.register({
                ...data,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.trim()
            });
            navigate("/vacations", { replace: true });
        }
        catch (error) {
            const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
            setServerError(typeof message === "string" ? message : "Registration failed. Please try again.");
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
            <Paper sx={{ overflow: "hidden", borderRadius: 4 }}>
                <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: "primary.main", color: "primary.contrastText" }}>
                    <Typography variant="overline" sx={{ letterSpacing: 3 }}>VACATION RESORT</Typography>
                    <Typography variant="h4" component="h1" sx={{ mt: 1 }}>Your next trip starts here.</Typography>
                    <Typography sx={{ mt: 1.5, opacity: 0.85 }}>
                        Create an account to discover vacations and save your favorites.
                    </Typography>
                </Box>

                <Box component="form" noValidate onSubmit={handleSubmit(submitRegistration)} sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack spacing={2.5}>
                        <Typography variant="h5" component="h2">Create your account</Typography>

                        {serverError && <Alert severity="error">{serverError}</Alert>}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                id="firstName" label="First name" autoComplete="given-name" required disabled={isSubmitting}
                                {...register("firstName", { validate: value => value.trim().length > 0 || "First name is required." })}
                                error={!!errors.firstName} helperText={errors.firstName?.message}
                            />
                            <TextField
                                id="lastName" label="Last name" autoComplete="family-name" required disabled={isSubmitting}
                                {...register("lastName", { validate: value => value.trim().length > 0 || "Last name is required." })}
                                error={!!errors.lastName} helperText={errors.lastName?.message}
                            />
                        </Stack>

                        <TextField
                            id="email" label="Email" type="email" autoComplete="email" required disabled={isSubmitting}
                            {...register("email", {
                                required: "Email is required.",
                                validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email address."
                            })}
                            error={!!errors.email} helperText={errors.email?.message}
                        />

                        <TextField
                            id="password" label="Password" type="password" autoComplete="new-password" required disabled={isSubmitting}
                            {...register("password", {
                                required: "Password is required.",
                                minLength: { value: 4, message: "Use at least 4 characters." }
                            })}
                            error={!!errors.password} helperText={errors.password?.message ?? "At least 4 characters."}
                        />

                        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </Button>

                        <Typography variant="body2" align="center" color="text.secondary">
                            Already registered? <Link component={RouterLink} to="/login">Log in</Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}