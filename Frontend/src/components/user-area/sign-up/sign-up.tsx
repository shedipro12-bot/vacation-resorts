import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Button, Link, Paper, TextField, Typography } from "@mui/material";
import { RegistrationModel } from "../../../models/registration-model";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";

// Displays registration fields and signs in the newly created user.
export function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationModel>();

    // Registers the user and redirects after successful registration.
    async function submitRegistration(user: RegistrationModel): Promise<void> {
        try {
             await userService.register({...user, firstName: user.firstName.trim(), lastName: user.lastName.trim(), email: user.email.trim()});
            navigate("/vacations", { replace: true });
        }
        catch (error) {
            notify.error(error);
        }
    }

    return (
        <div className="FormPage">
            <Paper className="FormPanel" sx={{ borderRadius: 3 }}>
                <Typography variant="h4" component="h1" color="primary">Create an account</Typography>
                <Typography color="text.secondary">Discover vacations and save your favorites.</Typography>

                <form className="AppForm" noValidate onSubmit={handleSubmit(submitRegistration)}>
                    <TextField
                        id="firstName" label="First name" autoComplete="given-name" fullWidth required disabled={isSubmitting}
                        {...register("firstName", {
                            required: "First name is required.",
                            validate: value => value.trim().length > 0 || "First name cannot be blank."
                        })}
                        error={!!errors.firstName} helperText={errors.firstName?.message}/> <TextField
                        id="lastName" label="Last name" autoComplete="family-name" fullWidth required disabled={isSubmitting}
                        {...register("lastName", {
                            required: "Last name is required.",
                            validate: value => value.trim().length > 0 || "Last name cannot be blank."
                        })}
                        error={!!errors.lastName} helperText={errors.lastName?.message}
                    />

                    <TextField
                        id="email" label="Email" type="email" autoComplete="email" fullWidth required disabled={isSubmitting}
                        {...register("email", {
                            required: "Email is required.",
                            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email."
                        })}
                        error={!!errors.email} helperText={errors.email?.message}
                    />

                    <TextField
                        id="password" label="Password" type="password" autoComplete="new-password" fullWidth required disabled={isSubmitting}
                        {...register("password", {required: "Password is required.",minLength: { value: 4, message: "Use at least 4 characters." }})} error={!!errors.password} helperText={errors.password?.message}
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Register"}
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                        Already registered? <Link component={RouterLink} to="/login">Log in</Link>
                    </Typography>
                </form>
            </Paper>
        </div>
    );
}