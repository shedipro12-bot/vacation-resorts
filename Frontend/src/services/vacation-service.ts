import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";

class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
         const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
         return response.data;
    }

}

export const vacationService = new VacationService();
