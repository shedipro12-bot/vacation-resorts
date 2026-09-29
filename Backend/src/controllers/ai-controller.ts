import { Router } from "express";
import { UserModel } from "../models/user-model";
import { Request, Response } from "express";
import { userService } from "../services/user-service";
import { Role, StatusCode } from "../models/enums";
import { CredentialsModel } from "../models/credentials-model";
import { aiService } from "../services/ai-service";
import { securityMiddleware } from "../middleware/security-middleware";
class AiController {
    public router: Router = Router();

    public constructor() {
        this.router.post("/api/ai/recommendations", securityMiddleware.verifyLoggedIn, this.getAiRecommendation);
    }

    public async getAiRecommendation(request: Request, response: Response): Promise<void> {
        const answer = await aiService.getRecommendations(request.body?.destination);
        response.json({ answer });
    }

}

export const aiController = new AiController();