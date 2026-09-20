import { OkPacketParams, RowDataPacket } from "mysql2";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { dal } from "../utils/dal";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import { saver } from "smart-saver";

class VacationService {
    // Get all vacations:
    public async getAllVacations(userId: number): Promise<VacationModel[]> {

        const sql = `
        select vacations.*,
        concat(?, vacations.imageFileName) as imageUrl,
       (select count(*) from likes where likes.vacationId = vacations.vacationId) as likesCount,
        exists(select 1 from likes where likes.vacationId = vacations.vacationId and likes.userId = ?) as isLiked
    from vacations
    order by vacations.startDate asc
    `;

        const result = await dal.execute(sql, [appConfig.vacationImagesBaseUrl, userId]) as RowDataPacket[];

        return result.map(vacation => ({ ...vacation, isLiked: Boolean(vacation.isLiked) })) as VacationModel[];
    }

    // Get one vacation:
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const sql = `
        select *, concat(?, imageFileName) as imageUrl
        from vacations where vacationId = ?
    `;
        const values = [appConfig.vacationImagesBaseUrl, vacationId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];

        if (!vacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found.`);
        }

        vacation.price = +vacation.price;

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

    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();

        if (!vacation.image || Array.isArray(vacation.image)) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Please upload exactly one image."
            );
        }
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");

        if (vacation.startDate < today) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Start date cannot be in the past."
            );
        }

        const imageFileName = await saver.save(vacation.image);
        if (!imageFileName) {
            throw new Error("Failed to save vacation image.");
        }
        vacation.imageFileName = imageFileName;

        const sql = `
            insert into vacations (destination, description, startDate, endDate, price, imageFileName)
            values (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageFileName
        ];

        let info: OkPacketParams;

        try {
            info = await dal.execute(sql, values) as OkPacketParams;
        }
        catch (error) {
            await saver.delete(imageFileName);
            throw error;
        }

        return this.getOneVacation(info.insertId!);
    }

    public async updateVacation(vacationId: number, vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();

        if (Array.isArray(vacation.image)) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "Please upload only one image."
            );
        }

        const existingVacation = await this.getOneVacation(vacationId);
        const oldImageName = existingVacation.imageFileName;
        let imageFileName = oldImageName;
        let newImageName: string | null = null;

        if (vacation.image) {
            newImageName = await saver.save(vacation.image);

            if (!newImageName) {
                throw new Error("Failed to save vacation image.");
            }

            imageFileName = newImageName;
        }

        if (!imageFileName) {
            throw new ClientError(
                StatusCode.UnprocessableContent,
                "An image is required."
            );
        }

        const sql = `
        update vacations
        set destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageFileName = ?
        where vacationId = ?
    `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageFileName,
            vacationId
        ];

        try {
            await dal.execute(sql, values);
        }
        catch (error) {
            if (newImageName) {
                await saver.delete(newImageName);
            }

            throw error;
        }

        if (newImageName && oldImageName && newImageName !== oldImageName) {
            await saver.delete(oldImageName);
        }

        return this.getOneVacation(vacationId);
    }
    // Delete Vacation:
    public async deleteVacation(vacationId: number): Promise<void> {
        const imageName = await this.getImageName(vacationId);

        const sql = "delete from vacations where vacationId = ?";
        const info = await dal.execute(sql, [vacationId]) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ClientError(
                StatusCode.NotFound,
                `Vacation ${vacationId} not found.`
            );
        }

        if (imageName) {
            await saver.delete(imageName);
        }
    }
    private async getImageName(vacationId: number): Promise<string | null> {
        const sql = "select imageFileName from vacations where vacationId = ?";
        const vacations = await dal.execute(sql, [vacationId]) as VacationModel[];
        const vacation = vacations[0];

        if (!vacation) return null;
        return vacation.imageFileName ?? null;
    }
}


export const vacationService = new VacationService();
