import express, { Request, Response, Router } from "express";
import path from "path";
import { vacationService } from "../services/vacation-service";
import { loggerMiddleware } from "../middleware/logger-middleware";
import { securityMiddleware } from "../middleware/security-middleware";

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        // Public image files:
        this.router.use("/api/vacations/images", express.static(path.join(process.cwd(), "src/assets/images")));
        // Protected vacation information:
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacations);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
    }

    private async getAllVacations(request: Request,response: Response): Promise<void> {
        const userId = (request as any).user.userId;
        const vacations =  await vacationService.getAllVacations();
        response.json(vacations);
    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        const userId = (request as any).user.userId;
        const vacation = await vacationService.getOneVacation(vacationId);
        response.json(vacation);
    }
}

export const vacationController = new VacationController();