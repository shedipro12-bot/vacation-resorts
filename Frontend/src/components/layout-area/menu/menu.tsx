import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppState } from "../../../redux/app-state";
import { Role } from "../../../models/enums";
import { userService } from "../../../services/user-service";
import "./menu.css";

// Displays navigation appropriate to guests, users, and admins.
export function Menu() {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    const isAdmin = user?.roleId === Role.Admin;

    // Clears the session and redirects to login.
    function handleLogout(): void {
        userService.logout();
        navigate("/login", { replace: true });
    }

    return (
        <nav className="Menu">
            {!user ? (
                <>
                    <NavLink to="/sign-up">Sign up</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </>
            ) : (
                <>
                    <span>
                        Hello, {user.firstName} {user.lastName}
                    </span>

                    <NavLink to="/vacations" end>Vacations</NavLink>
                    {isAdmin ? (
                        <>
                            <NavLink to="/vacations/new">
                                Add Vacation
                            </NavLink>

                            <NavLink to="/admin-report">
                                Reports
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/ai">
                                AI Recommendations
                            </NavLink>

                            <NavLink to="/mcp">
                                Ask MCP
                            </NavLink>
                        </>
                    )}

                    <button type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
}