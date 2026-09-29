import { RowDataPacket } from "mysql2";
import { dal } from "../utils/dal";

class McpDataService {
    // Counts vacations running on the database's current calendar date.
    public async getActiveVacationsCount() {
        const sql = `SELECT COUNT(*) AS activeVacationsCount,
            DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS asOfDate
            FROM vacations WHERE startDate <= CURDATE() AND endDate >= CURDATE()`;
        const rows = await dal.execute(sql) as RowDataPacket[];
        return { activeVacationsCount: Number(rows[0].activeVacationsCount), asOfDate: rows[0].asOfDate };
    }

    // Calculates the average price across all vacations; an empty database has no average.
    public async getAverageVacationPrice() {
        const sql = "SELECT COUNT(*) AS vacationCount, ROUND(AVG(price), 2) AS averagePrice FROM vacations";
        const rows = await dal.execute(sql) as RowDataPacket[];
        return { vacationCount: Number(rows[0].vacationCount), averagePrice: rows[0].averagePrice === null ? null : Number(rows[0].averagePrice) };
    }

    // Retrieves future vacation records, allowing the AI to interpret destination names.
    public async getFutureVacations() {
        const sql = `SELECT vacationId, destination, price,
            DATE_FORMAT(startDate, '%Y-%m-%d') AS startDate,
            DATE_FORMAT(endDate, '%Y-%m-%d') AS endDate,
            DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS asOfDate,
            COUNT(*) OVER() AS totalMatches
            FROM vacations WHERE startDate > CURDATE()
            ORDER BY startDate ASC, vacationId ASC LIMIT 100`;
        const rows = await dal.execute(sql) as RowDataPacket[];
        const totalMatches = Number(rows[0]?.totalMatches ?? 0);
        return {
            totalMatches, truncated: totalMatches > rows.length,
            vacations: rows.map(row => ({ vacationId: Number(row.vacationId), destination: row.destination,
                price: Number(row.price), startDate: row.startDate, endDate: row.endDate })),
            regionNote: "The database has destination text, not a continent field. Regional classification must be identified as an inference from destination names."
        };
    }
}

export const mcpDataService = new McpDataService();
