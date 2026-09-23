import { Role } from "./enums";
export type UserModel = {
    userId: number,
    firstName: string;
    lastName: string;
    email: string;
    roleId: Role
}

