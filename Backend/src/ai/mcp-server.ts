import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

class VacationMcpServer {
    // Creates the server and registers the individual database tools.
    public create(): McpServer {
        const server = new McpServer({ name: "vacation-mcp-server", version: "1.0.0" });
        mcpRegister.registerGetActiveVacationsCountTool(server);
        mcpRegister.registerGetAverageVacationPriceTool(server);
        mcpRegister.registerGetFutureVacationsTool(server);
        return server;
    }
}

export const vacationMcpServer = new VacationMcpServer();
