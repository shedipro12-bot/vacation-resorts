import type { VacationModel } from "../models/vacation-model";
import type { UserModel } from "../models/user-model";

// Describes all shared application state.
export type AppState = {
    vacations: VacationModel[];
    user: UserModel | null;
};