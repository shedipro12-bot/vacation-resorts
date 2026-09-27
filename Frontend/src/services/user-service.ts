import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { appConfig } from "../utils/app-config";
import { CredentialsModel } from "../models/credential-model";
import { UserModel } from "../models/user-model";
import { store } from "../redux/store";
import { userSlice } from "../redux/user-slice";
import { vacationSlice } from "../redux/vacation-slice";

class UserService {
    // Sends credentials and saves the JWT returned by the backend.
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data

        const payload = jwtDecode<{ user: UserModel }>(token);
        localStorage.setItem("token", token);
        store.dispatch(userSlice.actions.initUser(payload.user));
    }
    // Removes the saved session and clears user-related Redux state.
    public logout(): void {
        localStorage.removeItem("token");

        store.dispatch(userSlice.actions.logoutUser());
        store.dispatch(vacationSlice.actions.initVacations([]));
    }
    // Restores the user to Redux from a saved, unexpired token.
    public restoreSession(): void {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const payload = jwtDecode<{
                user: UserModel;
                exp: number;
            }>(token);

            if (
                !payload.user ||
                typeof payload.exp !== "number" ||
                payload.exp * 1000 <= Date.now()
            ) {
                this.logout();
                return;
            }

            store.dispatch(userSlice.actions.initUser(payload.user));
        }
        catch {
            this.logout();
        }
    }
}

export const userService = new UserService();
