import { Router } from "express";
import { UserModel } from "../models/user-model";
import { Request, Response } from "express";
import { userService } from "../services/user-service";
import { Role, StatusCode } from "../models/enums";
import { CredentialsModel } from "../models/credentials-model";
class UserController {
    public router: Router = Router();

    public constructor() {
        this.router.post("/api/auth/register", this.register)
        this.router.post("/api/auth/login", this.login)
    }

    public async register(request: Request, response: Response): Promise<void> {
        const user = new UserModel({ ...request.body, roleId: Role.User });
        const token = await userService.addUser(user);
        response.status(StatusCode.Created).json(token);
    }

    public async login(request: Request, response: Response): Promise<void> {
        const credintials = new CredentialsModel(request.body);
        const token = await userService.login(credintials);
        response.status(StatusCode.OK).json(token);
    }

}

export const userController = new UserController();