import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";

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
    // Create a vacation with an uploaded image.
    public async addVacation(data: FormData): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, data);
        return response.data;
    }
    // Updates a vacation, optionally replacing its image.
    public async updateVacation(vacationId: number, data: FormData): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(`${appConfig.vacationsUrl}/${vacationId}`, data);
        return response.data
    }
    public async deleteVacation(vacationId: number): Promise<void> {
        const response = await axios.delete<VacationModel[]>(`${appConfig.vacationsUrl}/${vacationId}`)
    }
}

export const vacationService = new VacationService();
