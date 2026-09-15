import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { dal } from "../utils/dal";
import { vacationService } from "./vacation-service";

class LikeService {

    public async likeExists(userId: number, vacationId: number): Promise<boolean> {
        const sql = `SELECT EXISTS(SELECT 1 FROM likes WHERE userId = ? AND vacationId = ?) AS existsLike`;

        const result: any = await dal.execute(sql, [userId,vacationId]);

        return Boolean(result[0].existsLike);
    }
public async addLike(userId: number, vacationId: number): Promise<void> {
    if (!await vacationService.vacationExists(vacationId)) {
              throw new ClientError(StatusCode.NotFound, "Vacation not found.");
    }

    const sql = "INSERT IGNORE INTO likes(userId, vacationId) VALUES(?, ?)";
    const values = [userId, vacationId];
    await dal.execute(sql, values);
}
    public async removeLike( userId: number,vacationId: number): Promise<void> {
        const sql = `delete from likes where userId = ? and vacationId = ?`;
        await dal.execute(sql, [userId, vacationId]);
    }
}

export const likeService = new LikeService();