import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VacationModel } from "../models/vacation-model";

// Stores the vacations received from the backend.
function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    return action.payload;
}
// Removes the deleted vacation from frontend state.
function deleteVacation(currentState: VacationModel[], action: PayloadAction<number>): VacationModel[] {
    return currentState.filter(vacation => vacation.vacationId !== action.payload);
}

export const vacationSlice = createSlice({
    name: "vacation-slice",
    initialState: [] as VacationModel[],
    reducers: { initVacations, updateUserLike, deleteVacation }
});

type saveLikeupdate = {
    vacationId: number;
    isLiked: boolean;
}
// Updates one vacation's liked status and like count.
function updateUserLike(currentState: VacationModel[], action: PayloadAction<saveLikeupdate>): VacationModel[] {
    return currentState.map(vacation => {
        // Keep other vacations unchanged.
        if (vacation.vacationId !== action.payload.vacationId) {
            return vacation;

        }
        // Avoid changing the count if the status is already correct.
        if (vacation.isLiked === action.payload.isLiked) {
            return vacation;
        }
        const change = action.payload.isLiked ? 1 : -1;

        // Return a copy with the updated fields.
        return { ...vacation, isLiked: action.payload.isLiked, likesCount: (vacation.likesCount ?? 0) + change }
    })
}