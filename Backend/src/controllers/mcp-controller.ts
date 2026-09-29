import { Request, Response, Router } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { vacationMcpServer } from "../ai/mcp-server";
import { promptService } from "../services/prompt-service";
import { securityMiddleware } from "../middleware/security-middleware";

class McpController {
    public router = Router();

    // Registers protected question and MCP protocol endpoints.
    public constructor() {
        this.router.post("/api/mcp/ask", securityMiddleware.verifyLoggedIn, this.ask);
        this.router.post("/api/mcp", securityMiddleware.verifyLoggedIn, this.handleMcp);
        this.router.all("/api/mcp", securityMiddleware.verifyLoggedIn, (_request, response) => {
            response.setHeader("Allow", "POST");
            response.status(405).json({ message: "Use POST for the stateless MCP endpoint." });
        });
    }

    // Receives a question and returns the answer from the prompt service.
    private async ask(request: Request, response: Response): Promise<void> {
        const result = await promptService.ask(request.body?.question);
        response.json(result);
    }

    // Handles MCP messages from external clients; tool definitions stay in src/ai.
    private async handleMcp(request: Request, response: Response): Promise<void> {
        const server = vacationMcpServer.create();
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
        try {
            await server.connect(transport);
            await transport.handleRequest(request, response, request.body);
        }
        finally {
            await transport.close();
            await server.close();
        }
    }
}

export const mcpController = new McpController();
