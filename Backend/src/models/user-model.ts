import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// User Schema:
const UserSchema = z.object({
    userId: z.number().int().positive().optional(),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.email().max(100),
    password: z.string().min(3).max(255),
    roleId: z.number().int().min(1).max(2),
});

// User data type inferred from the schema:
type IUserModel = z.infer<typeof UserSchema>;

// User Model:
export class UserModel implements IUserModel {

    public userId?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: number;
    public constructor(user: IUserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }

    public validate(): void {
        const result = UserSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];
            const message = issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid user data"; throw new ClientError(StatusCode.UnprocessableContent,message);
        }
    }
}