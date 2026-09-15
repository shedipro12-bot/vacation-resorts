import express, { Request, Response, Router } from "express";
import path from "path";
import { vacationService } from "../services/vacation-service";
import { loggerMiddleware } from "../middleware/logger-middleware";
import { securityMiddleware } from "../middleware/security-middleware";
import { likeService } from "../services/like-service";
import { StatusCode } from "../models/enums";

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        // Public image files:
        this.router.use("/api/vacations/images", express.static(path.join(process.cwd(), "src/assets/images")));
        // Protected vacation information:
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacations);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
        this.router.post("/api/vacations/:vacationId/likes", securityMiddleware.verifyLoggedIn, this.addVacationLike)
        this.router.delete("/api/vacations/:vacationId/likes", securityMiddleware.verifyLoggedIn, this.removeVacationLike)
    }

    private async getAllVacations(request: Request,response: Response): Promise<void> {
        const userId = (request as any).user.userId;
        const vacations =  await vacationService.getAllVacations(userId);
        response.json(vacations);
    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        const userId = (request as any).user.userId;
        const vacation = await vacationService.getOneVacation(vacationId);
        response.json(vacation);
    }

   private async addVacationLike(request: Request, response: Response): Promise<void> {
    const vacationId = +request.params.vacationId;
    const userId = (request as any).user.userId;
    await likeService.addLike(userId, vacationId);
    response.sendStatus(StatusCode.Created);
}
    private async removeVacationLike(request: Request, response: Response): Promise<void> {
         const vacationId = +request.params.vacationId;
         const userId = (request as any).user.userId;
         await likeService.removeLike(userId,vacationId);
        response.sendStatus(StatusCode.OK, );
    }
}

export const vacationController = new VacationController();