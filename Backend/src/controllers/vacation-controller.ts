import express, { Request, Response, Router } from "express";
import { vacationService } from "../services/vacation-service";
// Contains routes, without logic.
class VacationController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.get("/api/health", this.health)
        this.router.get("/api/vacations", this.getAllVacations);
    }

    private async getAllVacations(request: Request, response: Response): Promise<void> {
        const vacation = await vacationService.getAllVacations();
        response.json(vacation);
    }

    private async health(request: Request, response: Response): Promise<void> {

    }
}

export const vacationController = new VacationController();
