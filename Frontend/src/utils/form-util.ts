import { VacationModel } from "../models/vacation-model";
class FormUtil {

    // Convert vacation into FormData, so we could send also the image:
    public toFormData(vacation: VacationModel): FormData {
        const vacationFormData = new FormData();
        vacationFormData.append("name", vacation.destination);
        vacationFormData.append("price", vacation.price.toString());
        vacationFormData.append("image",vacation.imageUrl);
        return vacationFormData;
    }

}

export const formUtil = new FormUtil();
