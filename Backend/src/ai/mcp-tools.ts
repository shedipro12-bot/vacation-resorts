import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { mcpDataService } from "../services/mcp-data-service";

class McpTools {
    // Returns the active count from MySQL as an MCP tool result.
    public async getActiveVacationsCountTool(): Promise<CallToolResult> {
        console.log("Using tool: getActiveVacationsCountTool");
        const data = await mcpDataService.getActiveVacationsCount();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    // Returns the current average price from MySQL.
    public async getAverageVacationPriceTool(): Promise<CallToolResult> {
        console.log("Using tool: getAverageVacationPriceTool");
        const data = await mcpDataService.getAverageVacationPrice();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    // Returns upcoming vacation records from MySQL.
    public async getFutureVacationsTool(): Promise<CallToolResult> {
        console.log("Using tool: getFutureVacationsTool");
        const data = await mcpDataService.getFutureVacations();
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
}

export const mcpTools = new McpTools();
