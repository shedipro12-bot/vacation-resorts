import { dal } from "../utils/dal";

class LikeService {

    public async likeExists(userId: number, vacationId: number): Promise<boolean> {
        const sql = `SELECT EXISTS(SELECT 1 FROM likes WHERE userId = ? AND vacationId = ?) AS existsLike`;

        const result: any = await dal.execute(sql, [
            userId,
            vacationId
        ]);

        return Boolean(result[0].existsLike);
    }

    public async addLike(userId: number,vacationId: number): Promise<void> {
        const sql = ` insert into likes (userId, vacationId)  VALUES (?, ?)
        `;

        await dal.execute(sql, [userId, vacationId]);
    }

    public async removeLike(
        userId: number,vacationId: number): Promise<void> {
        const sql = `delete from likes where userId = ? and vacationId = ?
        `;

        await dal.execute(sql, [userId, vacationId]);
    }
}

export const likeService = new LikeService();