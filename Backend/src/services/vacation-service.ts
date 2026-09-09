import { OkPacketParams } from "mysql2";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { dal } from "../utils/dal";

// Logic:
class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        const sql = "select * from vacations";
        const vacations = await dal.execute(sql);
        return vacations as VacationModel[];
    }

    public async getOneVacation(vacationId: number, userId: number): Promise<VacationModel> {
        const sql = `
            SELECT
                v.vacationId,
                v.destination,
                v.description,
                v.startDate,
                v.endDate,
                v.price,
                CONCAT(?, v.imageFileName) AS imageUrl,

                (
                    SELECT COUNT(*)
                    FROM likes AS l
                    WHERE l.vacationId = v.vacationId
                ) AS likesCount,

                EXISTS (
                    SELECT 1
                    FROM likes AS currentLike
                    WHERE currentLike.vacationId = v.vacationId
                      AND currentLike.userId = ?
                ) AS isLiked

            FROM vacations AS v
            WHERE v.vacationId = ?
        `;

        const values = [appConfig.vacationImagesBaseUrl, userId, vacationId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        return vacations[0];
    }

    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const sql = `
            INSERT INTO vacations
            (destination, description, startDate, endDate, price, imageFileName)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            vacation.imageFileName
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;
        const dbVacation = await this.getOneVacation(info.insertId!, 0);

        return dbVacation;
    }

    public async updateVacation(vacationId: number, vacation: VacationModel): Promise<VacationModel> {
        const sql = `
            UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageFileName = ? WHERE vacationId = ?
        `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            vacation.imageFileName,
            vacationId
        ];

        await dal.execute(sql, values);

        return this.getOneVacation(vacationId, 0);
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        const sql = `
            DELETE FROM vacations
            WHERE vacationId = ?
        `;

        await dal.execute(sql, [vacationId]);
    }
}

export const vacationService = new VacationService();

