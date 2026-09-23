import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { appConfig } from "../utils/app-config";
import { CredentialsModel } from "../models/credential-model";
import { UserModel } from "../models/user-model";
import { store } from "../redux/store";
import { userSlice } from "../redux/user-slice";

class UserService {
    // Sends credentials and saves the JWT returned by the backend.
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data

        const payload = jwtDecode<{ user: UserModel }>(token);
        localStorage.setItem("token", token);
        store.dispatch(userSlice.actions.initUser(payload.user));
    }
}

export const userService = new UserService();
