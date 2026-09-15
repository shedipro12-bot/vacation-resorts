import { OkPacketParams, RowDataPacket } from "mysql2";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { dal } from "../utils/dal";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";

class VacationService {
    // Get all vacations:
    public async getAllVacations(userId: any): Promise<VacationModel[]> {

        const sql = ` select *  from vacations ORDER BY startDate ASC `;

        const result = await dal.execute(sql) as RowDataPacket[];

        return result as VacationModel[];
    }

    // Get one vacation:
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        // Create SQL:
        const sql = `
        select *, concat(?, imageFileName) as imageUrl from vacations where vacationId = ?
    `;
        const values = [appConfig.vacationImagesBaseUrl, vacationId];
        // Execute:
        const vacations = await dal.execute(sql, values) as VacationModel[];

        // Extract one vacation:
        const vacation = vacations[0];

        // If no such vacation:
        if (!vacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found.`);
        }

        // Convert MySQL values:
        vacation.price = +vacation.price;
        vacation.likesCount = +vacation.likesCount!;
        vacation.isLiked = !!vacation.isLiked;

        // Return:
        return vacation;
    }

    public async vacationExists(vacationId: number): Promise<boolean> {
        const sql = `
            select EXISTS (
                select 1
                from vacations
                where vacationId = ?
            ) AS vacationExists
        `;

        const result = await dal.execute(
            sql,
            [vacationId]
        ) as RowDataPacket[];

        return Boolean(result[0].vacationExists);
    }

    public async addVacation(
        vacation: VacationModel
    ): Promise<VacationModel> {

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

        const info = await dal.execute(
            sql,
            values
        ) as OkPacketParams;

        return this.getOneVacation(info.insertId!);
    }

    public async updateVacation(vacationId: number, vacation: VacationModel): Promise<VacationModel> {
        const sql = `
            UPDATE vacations
            SET destination = ?,
                description = ?,
                startDate = ?,
                endDate = ?,
                price = ?,
                imageFileName = ?
            where vacationId = ?
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

        return this.getOneVacation(vacationId);
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        const sql = `delete from vacations where vacationId = ?
        `;

        await dal.execute(sql, [vacationId]);
    }
}

export const vacationService = new VacationService();