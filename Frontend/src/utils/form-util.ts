import { VacationFormModel } from "../models/vacation-form-model";

class FormUtil {
    // Converts vacation form values and an optional image into multipart data.
    public toFormData(vacation: VacationFormModel): FormData {
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate);
        formData.append("endDate", vacation.endDate);
        formData.append("price", vacation.price.toString());

        if (vacation.image) {
            formData.append("image", vacation.image);
        }

        return formData;
    }
}

export const formUtil = new FormUtil();