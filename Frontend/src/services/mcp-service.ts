import axios from "axios";
import { appConfig } from "../utils/app-config";

type McpAnswer = { answer: string; toolsUsed: string[] };

class McpService {
    // Sends a database question to the protected backend; the JWT interceptor adds authentication.
    public async askQuestion(question: string): Promise<McpAnswer> {
        const response = await axios.post<McpAnswer>(appConfig.mcpUrl, { question }, { timeout: 150000 });
        return response.data;
    }
}

export const mcpService = new McpService();
