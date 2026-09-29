export type VacationModel = {
    vacationId: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageFileName: string;
    imageUrl: string;
    likesCount?: number;
    isLiked?: boolean;
};