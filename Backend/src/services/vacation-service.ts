import { VacationModel } from "../models/vacation-model";
import { dal } from "../utils/dal";
// Logic:
class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        const sql = "select * from vacations"
       const vacations = await dal.execute(sql)
       return vacations as VacationModel[];
    }

}

export const vacationService = new VacationService();
