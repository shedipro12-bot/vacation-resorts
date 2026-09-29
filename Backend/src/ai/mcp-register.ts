import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpTools } from "./mcp-tools";

class McpRegister {
    // Describes and registers the active-count tool.
    public registerGetActiveVacationsCountTool(server: McpServer): void {
        server.registerTool("get_active_vacations_count", {
            description: "Get the exact number of vacations active today (start and end dates inclusive).",
            inputSchema: z.object({}).strict(),
            annotations: { readOnlyHint: true }
        }, mcpTools.getActiveVacationsCountTool);
    }

    // Describes and registers the average-price tool.
    public registerGetAverageVacationPriceTool(server: McpServer): void {
        server.registerTool("get_average_vacation_price", {
            description: "Get the average price and count of ALL database vacations. No currency is stored.",
            inputSchema: z.object({}).strict(),
            annotations: { readOnlyHint: true }
        }, mcpTools.getAverageVacationPriceTool);
    }

    // Describes and registers the upcoming-vacation tool.
    public registerGetFutureVacationsTool(server: McpServer): void {
        server.registerTool("get_future_vacations", {
            description: "Get future vacations (start date after today), including destinations, dates and prices. Use for questions about future European vacations too, then interpret the returned destination names. Maximum 100 records; truncated indicates an incomplete list.",
            inputSchema: z.object({}).strict(),
            annotations: { readOnlyHint: true }
        }, mcpTools.getFutureVacationsTool);
    }
}

export const mcpRegister = new McpRegister();
