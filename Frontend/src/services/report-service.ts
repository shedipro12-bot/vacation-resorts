import axios from "axios";
import { VacationReportModel } from "../models/vacation-report-model";
import { appConfig } from "../utils/app-config";

class ReportService {
    // Retrieves report data from the admin-only endpoint.
    public async getVacationsReport(): Promise<VacationReportModel[]> {
        const response = await axios.get<VacationReportModel[]>(`${appConfig.vacationsUrl}/reports`);
        return response.data;
    }

    // Downloads the displayed report as an Excel-readable CSV.
    public downloadCsv(rows: VacationReportModel[]): void {
        const lines = [
            "Destination,Likes",
            ...rows.map(row => `${this.escapeCsv(row.destination)},${row.likesCount}`)
        ];

        const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "vacation-likes-report.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Escapes CSV text and prevents destinations being interpreted as formulas.
    private escapeCsv(value: string): string {
        const safeValue = /^\s*[=+\-@]/.test(value) ? "'" + value : value;
        return `"${safeValue.replace(/"/g, '""')}"`;
    }
}

export const reportService = new ReportService();