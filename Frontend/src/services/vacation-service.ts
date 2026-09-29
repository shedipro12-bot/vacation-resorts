import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { VacationFormModel } from "../models/vacation-form-model";
import { formUtil } from "../utils/form-util";

class VacationService {
    // Get All Vacations
    public async getAllVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        return response.data;
    }
    // Gets one vacation 
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(`${appConfig.vacationsUrl}/${vacationId}`);
        return response.data;
    }


    // Converts form values into multipart data and creates a vacation.
    public async addVacation(vacation: VacationFormModel): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, formUtil.toFormData(vacation));
        return response.data;
    }
    // Converts form values into multipart data and updates a vacation.
    public async updateVacation(vacationId: number, vacation: VacationFormModel): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(`${appConfig.vacationsUrl}/${vacationId}`, formUtil.toFormData(vacation));
        return response.data;
    }
    // Deletes the vacation from the backend.
    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/${vacationId}`);
    }
}

export const vacationService = new VacationService();
