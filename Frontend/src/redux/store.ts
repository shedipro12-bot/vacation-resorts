import { configureStore } from "@reduxjs/toolkit";
import type { AppState } from "./app-state";
import { userSlice } from "./user-slice";
import { vacationSlice } from "./vacation-slice";

// Connects the reducers to the application's shared state.
export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer,
        vacations: vacationSlice.reducer
    }
});