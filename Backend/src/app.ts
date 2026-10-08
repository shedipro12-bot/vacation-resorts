import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { errorMiddleware } from "./middleware/error-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";
import { loggerMiddleware } from "./middleware/logger-middleware";
import { vacationController } from "./controllers/vacation-controller";
import { userController } from "./controllers/user-controller";
import { aiController } from "./controllers/ai-controller";

import { mcpController } from "./controllers/mcp-controller";
import { dal } from "./utils/dal";

class App {

    public start(): void {

        // Configure smart-saver - images path:
        saver.config(path.join(__dirname, "assets", "images"));

        // Create our server object:
        const server = express();

        // System middleware:
        securityMiddleware.registerRateLimit(server); // Prevent DoS attacks.
        securityMiddleware.headerProtection(server); // Prevent header attacks.
        server.use(cors()); // Enable CORS.
        server.use(express.json()); // Configure express to create request.body from a given JSON.
        server.use(expressFileUpload()); // Configure express to create request.files from the request.

        // Register "before" middleware: 
        server.use(loggerMiddleware.logToConsole);
        server.use(securityMiddleware.preventXss);

        // Reports readiness only when the database is reachable.
        server.get("/api/health", async (_request, response) => {
            try {
                await dal.execute("SELECT 1");
                response.json({ status: "ok" });
            }
            catch {
                response.status(503).json({ status: "unavailable" });
            }
        });

        // Register controllers:
        server.use(vacationController.router);
       server.use(userController.router);
       server.use(aiController.router);
       server.use(mcpController.router);
        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Run server:
        server.listen(appConfig.port, () => console.log("Listening..."));
    }

}

const app = new App();
app.start();

// taskkill /F /IM node.exe
