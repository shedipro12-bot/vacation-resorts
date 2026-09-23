import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserModel } from "../models/user-model";

// Stores the user after login, registration, or session restoration.
function initUser(_currentState: UserModel | null, action: PayloadAction<UserModel>): UserModel | null {
    return action.payload;
}

// Clears the logged-in user from Redux.
function logoutUser( _currentState: UserModel | null): UserModel | null {
    return null;
}

export const userSlice = createSlice({
     name: "user-slice", initialState: null as UserModel | null,
     reducers: { initUser, logoutUser }
});