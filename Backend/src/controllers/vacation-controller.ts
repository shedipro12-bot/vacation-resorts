import express, { Request, Response, Router } from "express";
import path from "path";
import { vacationService } from "../services/vacation-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { likeService } from "../services/like-service";
import { StatusCode } from "../models/enums";
import { saver } from "smart-saver";
import { VacationModel } from "../models/vacation-model";

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        // Public image files:
        this.router.get("/api/vacations/images/:imageName", this.getImage);
        // Protected vacation information:
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, this.getAllVacations);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, this.getOneVacation);
        this.router.post("/api/vacations/:vacationId/likes", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyUser, this.addVacationLike);
        this.router.delete("/api/vacations/:vacationId/likes", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyUser, this.removeVacationLike);
        // Protected vacation information by role:
        this.router.post("/api/vacations", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:vacationId", securityMiddleware.verifyLoggedIn, securityMiddleware.verifyAdmin, this.removeVacation);
    }
    // Get all vacations:
    private async getAllVacations(request: Request, response: Response): Promise<void> {
        const userId = (request as any).user.userId;
        const vacations = await vacationService.getAllVacations(userId);
        response.json(vacations);
    }
    //  Get one vacation:
    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        const userId = (request as any).user.userId;
        const vacation = await vacationService.getOneVacation(vacationId);
        response.json(vacation);
    }
    //  Add a vaacation like:
    private async addVacationLike(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        const userId = (request as any).user.userId;
        await likeService.addLike(userId, vacationId);
        response.sendStatus(StatusCode.Created);
    }
    // Remove vacation like:
    private async removeVacationLike(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        const userId = (request as any).user.userId;
        await likeService.removeLike(userId, vacationId);
        response.sendStatus(StatusCode.NoContent);
    }

    // Add Vacation as an Admin
    async addVacation(request: Request, response: Response): Promise<void> {
        const vacation = new VacationModel({
            ...request.body,
            image: request.files?.image
        });
        const dbVacation = await vacationService.addVacation(vacation);
        response.status(StatusCode.Created).json(dbVacation);
    }

    // Update vacation (Admin):
    private async updateVacation(request: Request, response: Response): Promise<void> {

        const vacationId = +request.params.vacationId;
        request.body.image = request.files?.image;
        request.body.vacationId = vacationId;

        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationService.updateVacation(vacationId, vacation);

        response.status(StatusCode.OK).json(dbVacation);
    }

    // Remove vacation (admin):
    private async removeVacation(request: Request, response: Response): Promise<void> {
        const vacationId = +request.params.vacationId;
        await vacationService.deleteVacation(vacationId);
        response.sendStatus(StatusCode.NoContent);
    }
    // Get image by name:
    private getImage(request: Request, response: Response): void {
        const imageName = request.params.imageName.toString();
        const filePath = saver.getFilePath(imageName);
        response.sendFile(filePath);
    }


}

export const vacationController = new VacationController();
