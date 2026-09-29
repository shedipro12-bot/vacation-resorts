import axios from "axios";
import { appConfig } from "../utils/app-config";

class AiService {
    // Sends a destination to the backend and returns the AI recommendation.
    public async getRecommendations(destination: string): Promise<string> {
        const response = await axios.post<{ answer: string }>(appConfig.recommendationsUrl, { destination });
        return response.data.answer;
    }
}

export const aiService = new AiService();