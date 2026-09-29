import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppState } from "../redux/app-state";
import { Role } from "../models/enums";

// Redirects guests to login and regular users to vacations.
export function useAdmin(): boolean {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    const isAdmin = user?.roleId === Role.Admin;

    useEffect(() => {
        if (!user) {  navigate("/sign-in", { replace: true }); }
        else if (!isAdmin) { navigate("/vacations", { replace: true });
        }
    }, [user, isAdmin, navigate]);

    return isAdmin;
}