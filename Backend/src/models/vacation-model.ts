import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Vacation Schema:
const VacationSchema = z.object({
    vacationId: z.number().int().positive().optional(),

    destination: z.string().trim().min(1).max(100),

    description: z.string().trim().min(1),

    startDate: z.string().date(),

    endDate: z.string().date(),

    price: z.number().min(0).max(10000).multipleOf(0.01),

    imageFileName: z.string().trim().min(1).max(255)
}).refine(
    vacation => vacation.endDate >= vacation.startDate,
    {
        message: "End date must be on or after the start date.",
        path: ["endDate"]
    }
);

// Vacation data type:
type IVacationModel = z.infer<typeof VacationSchema>;

// Vacation Model:
export class VacationModel implements IVacationModel {

    public vacationId?: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageFileName: string;

    public constructor(vacation: IVacationModel) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageFileName = vacation.imageFileName;
    }

    public validate(): void {
        const result = VacationSchema.safeParse(this);

        if (!result.success) {
            const issue = result.error.issues[0];

            const message = issue
                ? `${issue.path.join(".")}: ${issue.message}`
                : "Invalid vacation data";

            throw new ClientError(
                StatusCode.UnprocessableContent,
                message
            );
        }

        // Apply validated values, including trimmed strings:
        Object.assign(this, result.data);
    }
}