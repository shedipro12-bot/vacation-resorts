import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
const CredentialsSchema = z.object({
    email: z.email().trim().max(100),
    password: z.string()
        .min(1)
        .max(255)
});

type ICredentialsModel = z.infer<typeof CredentialsSchema>;

export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: ICredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    public validate(): void {
        const result = CredentialsSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];

            const message = issue
                ? `${issue.path.join(".")}: ${issue.message}`
                : "Invalid credentials";

            throw new ClientError(
                StatusCode.UnprocessableContent,
                message
            );
        }

        Object.assign(this, result.data);
    }
}