import { Router } from "express";
import { UserModel } from "../models/user-model";
import { Request, Response } from "express";
import { userService } from "../services/user-service";
class UserController {
    public rounter: Router = Router();

public constructor() {
    this.rounter.post("/api/register", this.register)
    this.rounter.post("api/login",this.login)
}

public async register(request: Request, response: Response): Promise<void> {
    const user = new UserModel(request.body);
    const  token = userService.addUser
}

public async login(request: Request, response: Response): Promise<void> {

}

}

export const userController = new UserController();