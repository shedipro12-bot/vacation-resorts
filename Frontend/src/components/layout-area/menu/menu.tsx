import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { Role } from "../../../models/enums";
import { UserArea } from "../../user-area/auth_menu/auth_menu";
import "./menu.css";

// Displays page navigation and the authentication area.
export function Menu() {
    const user = useSelector((state: AppState) => state.user);
    const isAdmin = user?.roleId === Role.Admin;

    return (
        <nav className="Menu">
            {user && (
                <>
                    <NavLink to="/vacations" end>Vacations</NavLink>
                    <NavLink to="/ai">AI Recommendations</NavLink>
                    <NavLink to="/mcp">Ask MCP</NavLink>

                    {isAdmin && (
                        <>
                            <NavLink to="/vacations/new">Add Vacation</NavLink>
                            <NavLink to="/admin-report">Reports</NavLink>
                        </>
                    )}
                </>
            )}

            <UserArea />
        </nav>
    );
}