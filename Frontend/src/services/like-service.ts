import axios from "axios";
import { appConfig } from "../utils/app-config";

class LikeService {
    // Adds like to current user card
    public async addLike(vacationId: number): Promise<void> {
        await axios.post(`${appConfig.vacationsUrl}/${vacationId}/likes`);
    }
    public async removeLike(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/${vacationId}/likes`);
    }
}

export const likeService = new LikeService();
