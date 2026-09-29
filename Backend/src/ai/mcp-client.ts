import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { vacationMcpServer } from "./mcp-server";

class McpClient {
    // Connects a client to our tools locally; no publicly hosted MCP URL is required.
    public async connect() {
        const server = vacationMcpServer.create();
        const client = new Client({ name: "vacation-ai-client", version: "1.0.0" });
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
        try {
            await server.connect(serverTransport);
            await client.connect(clientTransport);
            return { client, server };
        }
        catch (error) {
            await client.close().catch(() => undefined);
            await server.close().catch(() => undefined);
            throw error;
        }
    }
}

export const mcpClient = new McpClient();
