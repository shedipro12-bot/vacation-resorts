import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VacationModel } from "../models/vacation-model";

// Stores the vacations received from the backend.
function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    return action.payload;
}

export const vacationSlice = createSlice({
    name: "vacation-slice",
    initialState: [] as VacationModel[],
    reducers: { initVacations }
});