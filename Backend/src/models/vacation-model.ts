import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
import type { UploadedFile } from "express-fileupload";
// Vacation Schema:
const VacationSchema = z.object({
    vacationId: z.number().int().positive().optional(),
    destination: z.string().trim().min(1).max(100),


    description: z.string().trim().min(1),

    startDate: z.string().date(),

    endDate: z.string().date(),

    price: z.number().min(0).max(10000).multipleOf(0.01),

    imageFileName: z.string().trim().min(1).max(255).optional()
}).refine(
    vacation => vacation.endDate >= vacation.startDate,
    {
        message: "End date must be on or after the start date.",
        path: ["endDate"]
    }
);

// Vacation data type:
type IVacationModel = z.infer<typeof VacationSchema> & {
    image?: UploadedFile | UploadedFile[];
};

// Vacation Model:
export class VacationModel implements IVacationModel {

    public vacationId?: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageFileName?: string;
    public imageUrl?: string;
    public likesCount?: number;
    public isLiked?: boolean;
    public image?: UploadedFile | UploadedFile[];

    public constructor(vacation: IVacationModel) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
    
        this.imageFileName = vacation.imageFileName;
        this.image = vacation.image;
        const price = String(vacation.price ?? "").trim();
        this.price = price === "" ? NaN : Number(price);
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
