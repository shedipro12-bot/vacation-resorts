import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// All database and provider calls are mocked: no real credentials, SQL writes or paid calls.
process.env.OPENAI_API_KEY = "test-not-real";
process.env.JWT_SECRET = "test-jwt-not-real";
process.env.HASH_SALT = "test-hash-not-real";
process.env.ENVIRONMENT = "production";

test("Signup routes and course-style MCP", async t => {
    const { dal } = await import("../src/utils/dal.js");
    const { userController } = await import("../src/controllers/user-controller.js");
    const { mcpController } = await import("../src/controllers/mcp-controller.js");
    const { promptService } = await import("../src/services/prompt-service.js");
    const { mcpClient } = await import("../src/ai/mcp-client.js");
    const { errorMiddleware } = await import("../src/middleware/error-middleware.js");
    let count = 3;
    let exists = false;
    let failSql = false;
    let insertValues: unknown[] = [];
    let lastSql = "";
    dal.execute = async (sql, values = []) => {
        if (failSql) throw new Error("Simulated database failure");
        lastSql = sql;
        if (sql.startsWith("select userId from users")) return exists ? [{ userId: 12 }] as any : [];
        if (sql.startsWith("insert into users")) { insertValues = values; return { insertId: 12 } as any; }
        if (sql.includes("activeVacationsCount")) return [{ activeVacationsCount: count, asOfDate: "2026-09-29" }] as any;
        if (sql.includes("AVG(price)")) return [{ vacationCount: count, averagePrice: count ? "1250.50" : null }] as any;
        if (sql.includes("COUNT(*) OVER()")) return [{ vacationId: 1, destination: "Paris, France", startDate: "2026-12-05", endDate: "2026-12-15", price: "1000.00", totalMatches: 1 }] as any;
        throw new Error("Unexpected SQL in test");
    };
    const app = express();
    app.use(express.json());
    app.use(userController.router);
    app.use(mcpController.router);
    app.use(errorMiddleware.routeNotFound);
    app.use(errorMiddleware.catchAll);
    const http = app.listen(0, "127.0.0.1");
    await new Promise<void>(resolve => http.once("listening", resolve));
    const base = `http://127.0.0.1:${(http.address() as { port: number }).port}`;
    let token = "";
    const post = (path: string, body: unknown, auth = token) => fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, body: JSON.stringify(body) });
    const read = (result: any) => JSON.parse(result.content[0].text);
    const { client, server } = await mcpClient.connect();
    try {
        await t.test("POST sign-up creates a user, forces User role and returns a safe JWT", async () => {
            const result = await post("/api/auth/sign-up", { firstName: "Demo", lastName: "User", email: "demo@example.com", password: "abcd1234", roleId: 2 });
            assert.equal(result.status, 201);
            token = await result.json() as string;
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as { user: { roleId: number; password?: string } };
            assert.equal(payload.user.roleId, 1);
            assert.equal(payload.user.password, undefined);
            assert.equal(insertValues[4], 1);
            assert.notEqual(insertValues[3], "abcd1234");
        });
        await t.test("duplicate registration returns 409, not a route error", async () => {
            exists = true;
            const result = await post("/api/auth/sign-up", { firstName: "Demo", lastName: "User", email: "demo@example.com", password: "abcd1234" });
            assert.equal(result.status, 409);
            exists = false;
        });
        await t.test("registration rejects invalid email", async () => {
            const result = await post("/api/auth/sign-up", { firstName: "Demo", lastName: "User", email: "bad", password: "abcd1234" });
            assert.equal(result.status, 422);
        });
        await t.test("MCP discovers the three individual course-style tools", async () => {
            assert.deepEqual((await client.listTools()).tools.map(tool => tool.name).sort(), ["get_active_vacations_count", "get_average_vacation_price", "get_future_vacations"]);
        });
        await t.test("active count uses inclusive current-date boundaries", async () => {
            assert.equal(read(await client.callTool({ name: "get_active_vacations_count", arguments: {} })).activeVacationsCount, 3);
            assert.match(lastSql, /startDate <= CURDATE\(\) AND endDate >= CURDATE\(\)/);
        });
        await t.test("average is numeric, empty averages stay null, new calls retrieve fresh results", async () => {
            assert.equal(read(await client.callTool({ name: "get_average_vacation_price", arguments: {} })).averagePrice, 1250.5);
            count = 0;
            assert.equal(read(await client.callTool({ name: "get_average_vacation_price", arguments: {} })).averagePrice, null);
            count = 7;
            assert.equal(read(await client.callTool({ name: "get_active_vacations_count", arguments: {} })).activeVacationsCount, 7);
        });
        await t.test("future listings contain real destination fields, numeric prices, and inference note", async () => {
            const result = read(await client.callTool({ name: "get_future_vacations", arguments: {} }));
            assert.equal(result.vacations[0].price, 1000);
            assert.equal(result.truncated, false);
            assert.match(result.regionNote, /inference/);
            assert.match(lastSql, /startDate > CURDATE\(\)/);
        });
        await t.test("tool schemas reject arbitrary SQL arguments", async () => {
            const before = lastSql;
            const result = await client.callTool({ name: "get_active_vacations_count", arguments: { sql: "DROP TABLE vacations" } });
            assert.equal(result.isError, true);
            assert.equal(lastSql, before);
        });
        await t.test("guests and expired sessions cannot reach either endpoint", async () => {
            for (const path of ["/api/mcp/ask", "/api/mcp"]) assert.equal((await post(path, {}, "")).status, 401);
            const expired = jwt.sign({ user: { userId: 1 } }, process.env.JWT_SECRET!, { expiresIn: -1 });
            assert.equal((await post("/api/mcp/ask", { question: "Average?" }, expired)).status, 401);
        });
        await t.test("empty, non-string and oversized questions return 422", async () => {
            for (const question of [" ", 123, "x".repeat(501)]) assert.equal((await post("/api/mcp/ask", { question })).status, 422);
        });
        await t.test("HTTP MCP transport connects and executes the same tools", async () => {
            const external = new Client({ name: "http-check", version: "1.0.0" });
            try {
                await external.connect(new StreamableHTTPClientTransport(new URL(base + "/api/mcp"), { requestInit: { headers: { Authorization: `Bearer ${token}` } } }));
                assert.equal((await external.listTools()).tools.length, 3);
                assert.equal(read(await external.callTool({ name: "get_active_vacations_count", arguments: {} })).activeVacationsCount, 7);
            } finally { await external.close(); }
        });
        await t.test("model receives MCP results before generating the answer", async () => {
            let requests = 0;
            (promptService as any).openai.responses.create = async (request: any) => {
                if (++requests === 1) return { output: [{ type: "function_call", name: "get_active_vacations_count", arguments: "{}", call_id: "test-call" }], output_text: "" };
                const evidence = request.input.find((item: any) => item.type === "function_call_output");
                assert.equal(read({ content: JSON.parse(evidence.output) }).activeVacationsCount, 7);
                assert.equal(request.tool_choice, "none");
                return { output: [], output_text: "There are 7 active vacations." };
            };
            const result = await post("/api/mcp/ask", { question: "How many active vacations?" });
            assert.equal(result.status, 200);
            assert.deepEqual(await result.json(), { answer: "There are 7 active vacations.", toolsUsed: ["get_active_vacations_count"] });
            assert.equal(requests, 2);
        });
        await t.test("no-tool selections return a supported-question explanation", async () => {
            (promptService as any).openai.responses.create = async () => ({ output: [], output_text: "An unrelated answer" });
            const result = await post("/api/mcp/ask", { question: "Write a poem" });
            assert.match((await result.json() as { answer: string }).answer, /active vacation counts/);
        });
        await t.test("provider failures return a useful safe error", async () => {
            (promptService as any).openai.responses.create = async () => { throw new Error("Private provider details"); };
            const result = await post("/api/mcp/ask", { question: "Average?" });
            assert.equal(result.status, 500);
            assert.ok(!JSON.stringify(await result.json()).includes("Private"));
        });
        await t.test("database failure is an MCP tool error", async () => {
            failSql = true;
            assert.equal((await client.callTool({ name: "get_future_vacations", arguments: {} })).isError, true);
        });
    } finally {
        await client.close(); await server.close();
        http.closeAllConnections();
        await new Promise<void>(resolve => http.close(() => resolve()));
    }
});
