import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppState } from "../redux/app-state";

// Redirects guests to login and returns whether a user is logged in.
export function useUser(): boolean {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    const isLoggedIn = user !== null;

    useEffect(() => {
       if (!isLoggedIn) {
      navigate("/login", { replace: true });}
    }, [isLoggedIn, navigate]);

    return isLoggedIn;
}