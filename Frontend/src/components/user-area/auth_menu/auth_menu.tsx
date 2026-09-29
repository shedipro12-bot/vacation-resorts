import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AppState } from "../../../redux/app-state";
import { userService } from "../../../services/user-service";

// Displays authentication links or the current user's name and logout button.
export function UserArea() {
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    // Clears the session and returns to the login page.
    function handleLogout(): void {
        userService.logout();
        navigate("/sign-in", { replace: true });
    }

    return (
        <div className="UserArea">
            {!user ? <><span>Hello Guest</span></> : null}
            {user ? (
                <>
                    <span>Hello, {user.firstName} {user.lastName}</span>
                    <button type="button" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <NavLink to="/sign-in">Sign in</NavLink>
                    <NavLink to="/sign-up">Sign up</NavLink>
                </>
            )}
        </div>
    );
}