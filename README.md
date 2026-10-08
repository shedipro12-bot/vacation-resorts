# Vacation Resort

A full-stack vacation discovery application built by **Shadi Boatman** with React, TypeScript, Express and MySQL.

**Repository:** https://github.com/shedipro12-bot/vacation-resorts  
**Development branch:** [shadi](https://github.com/shedipro12-bot/vacation-resorts/tree/shadi)

## Features

- Registration, sign-in, JWT session restoration and role-based navigation.
- Vacation cards with images, descriptions, dates, prices and like counts.
- All, My Likes, Active Now and Not Started filters, with nine cards per page.
- Admin vacation creation, editing, image replacement and confirmed deletion.
- Admin likes report and CSV export.
- AI destination recommendations through a backend-only OpenAI integration.
- MCP database questions using individually registered tools.
- Responsive ocean-and-sand styling and a 404 page with a local four-second animation.

## Project structure

```text
compose.yaml                  MySQL, backend and frontend Docker services
.env.example                  Root Docker configuration variable names
Database/                     MySQL schema and development seed export
Backend/
  src/ai/                     MCP tools, registration, server and client
  src/controllers/            HTTP routes and request/response handling
  src/services/               Business logic, SQL and AI orchestration
  src/models/                 Models and validation
  src/middleware/             Authentication, authorization and error handling
  src/utils/                  Configuration, database and JWT helpers
  tests/                      Isolated signup and MCP integration checks
Frontend/
  public/media/               404 video and its static poster
  src/components/             Pages, layout, user and vacation components
  src/services/               Requests to the backend
  src/redux/                  Shared user and vacation state
  src/styles/                 Shared design tokens and CSS modules
```

## Requirements

- Node.js 22.12+ (Node 24 is suitable) and npm.
- MySQL 8.0; the supplied database export was made with MySQL 8.0.46.
- An OpenAI API key with model access and available API credit for AI/MCP answers.

## Local setup

### 1. Get the project

```bash
git clone https://github.com/shedipro12-bot/vacation-resorts.git
cd vacation-resorts
```

The complete project is available on the default `main` branch. The `shadi` branch contains the earlier development history.

### 2. Import the database

Create an empty database named `vacationdb` in MySQL Workbench and import `Database/vacationDb.sql` into it. The export recreates its tables: use a development database, not one containing data you need to keep.

Alternatively, from a shell with the MySQL client:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vacationdb;"
mysql -u root -p vacationdb < Database/vacationDb.sql
```

### 3. Configure the backend

Copy `Backend/.env.example` to `Backend/.env` and fill in the values:

| Variable | Value / purpose |
| --- | --- |
| `ENVIRONMENT` | `development` locally |
| `MYSQL_HOST` | Usually `localhost` |
| `MYSQL_USER` | Your MySQL user |
| `MYSQL_PASSWORD` | Your MySQL password |
| `MYSQL_DATABASE` | `vacationdb`, or your chosen imported schema |
| `JWT_SECRET` | A long random secret |
| `HASH_SALT` | A separate long random secret, kept stable for existing accounts |
| `VACATION_IMAGES_BASE_URL` | `http://localhost:4000/api/vacations/images/` (trailing slash required) |
| `OPENAI_API_KEY` | Your private OpenAI API key |
| `RECAPTCHA_SECRET_KEY` | Template setting; the current signup flow does not invoke CAPTCHA |

For direct local development, the backend uses port **4000** and MySQL's default port **3306**. The OpenAI key must be configured before starting because the AI clients initialize at startup. Never put this key in frontend variables.

### 4. Configure the frontend

Copy `Frontend/.env.example` to `Frontend/.env`:

```env
VITE_BASE_SERVER_URL=http://localhost:4000/api
VITE_RECAPTCHA_SITE_KEY=
```

Do not put a trailing slash on `VITE_BASE_SERVER_URL`. The public CAPTCHA site key is unused by the current form. Restart Vite after changing environment variables.

### 5. Install and start

In one terminal:

```bash
cd Backend
npm install
npm start
```

In a second terminal, from the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually http://localhost:5173. Keep exactly one backend process on port 4000 so old route definitions are not served accidentally.

### 6. Create development accounts

Register a new user through `/sign-up`. Imported accounts were hashed using the original development salt, so their passwords may not work with a new `HASH_SALT`.

For a local admin account, register an account first, then deliberately promote that specific account in your development database:

```sql
UPDATE users SET roleId = 2 WHERE email = 'your-admin-email@example.com';
```

Sign out and sign back in afterward to receive a token with the updated role. Public registration always assigns role 1 (User); role 2 is Admin.

## Docker setup

Install and start Docker Desktop with Linux containers (or Docker Engine with the Compose plugin). From the repository root, copy `.env.example` to `.env` and fill in its values. This root file is used by Compose; Docker does not require the separate Backend/Frontend `.env` files.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Set `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, `JWT_SECRET`, `HASH_SALT` and `OPENAI_API_KEY`. Use separate strong values for the database passwords/JWT secret. For existing password hashes, keep the original `HASH_SALT`; otherwise register a fresh account after startup. Keep `.env` private. The OpenAI key is passed only to the backend.

Start all three services from the root:

```bash
docker compose up -d --build
docker compose ps
```

Stop any locally running backend on port 4000 before starting Docker, or choose a different `BACKEND_PORT` in the root `.env`.

Open http://localhost:8080. API and images are served through `/api` on that same address, so the browser never needs container service names. Postman can continue using http://localhost:4000/api; change its URLs if you change `BACKEND_PORT`. MySQL is accessed by the backend through the `mysql` service name and is not published to a host port, so your existing local MySQL can stay running.

The first launch imports `Database/vacationDb.sql` into the Docker database. It creates a separate database instance; it does not import changes from your locally running MySQL automatically. MySQL initialization runs only for a new empty `mysql_data` volume. The initial image files are copied into the `vacation_images` volume on its first use. Both volumes survive ordinary container recreation and `docker compose down`.

The backend runs compiled JavaScript as the non-root Node user. Nginx serves the production frontend, falls back to React routing on refresh, and proxies API requests. Health checks wait for the seeded database, then the backend, then the frontend.

Check logs and readiness:

```bash
docker compose logs --tail=100 mysql backend frontend
```

Open http://localhost:8080/api/health; it returns 200 when MySQL is reachable and 503 otherwise. Register a test account, sign in, and test cards/images, likes, admin CRUD/report/CSV, AI and MCP. To promote a newly registered local Docker account, open the MySQL client with:

```bash
docker compose exec mysql mysql -u root -p vacationdb
```

Enter the root password from your root `.env`, then run `UPDATE users SET roleId = 2 WHERE email = 'your-admin-email@example.com';` and sign in again. Existing imported seed passwords require the salt used when those hashes were generated.

To check persistence, add a test vacation and image, run `docker compose down`, start again with `docker compose up -d --build`, and confirm the row/image still exist. Do not use `docker compose down -v` for a normal restart: `-v` deletes both persistent volumes and their data.

Docker configuration and application builds were checked during implementation. A Docker daemon was not available in that workspace, so the full container startup and live AI calls still need verification on a Docker-enabled computer.

## Authentication URLs

| Purpose | Method | Backend endpoint |
| --- | --- | --- |
| Register | POST | `/api/auth/sign-up` |
| Sign in | POST | `/api/auth/sign-in` |

Frontend page routes are `/sign-up` and `/sign-in`. The old frontend `/auth/register` API URL caused the signup 404 and is corrected in this update. `/login` and `/register` are not the current page/API names.

## MCP implementation (course structure)

Start reading these files in order:

1. `Backend/src/services/mcp-data-service.ts` — three fixed read-only SQL queries.
2. `Backend/src/ai/mcp-tools.ts` — each tool calls a service and returns `CallToolResult`.
3. `Backend/src/ai/mcp-register.ts` — registers names, descriptions and Zod schemas.
4. `Backend/src/ai/mcp-server.ts` — creates the server and registers the tools.
5. `Backend/src/ai/mcp-client.ts` — connects locally to the server through the MCP SDK.
6. `Backend/src/services/prompt-service.ts` — lets OpenAI select tools, calls them, and sends retrieved results back for an answer.
7. `Backend/src/controllers/mcp-controller.ts` — protects the endpoints with JWT authentication.

Tools:

| Name | Retrieved data |
| --- | --- |
| `get_active_vacations_count` | Count with `startDate <= CURDATE()` and `endDate >= CURDATE()` |
| `get_average_vacation_price` | Count and average price across all vacations; average is null for an empty table |
| `get_future_vacations` | Up to 100 vacations starting after today, ordered by start date, with total count and truncation flag |

Ask questions from the signed-in `/mcp` page or call:

```http
POST /api/mcp/ask
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{"question":"How many vacations are active now?"}
```

The response contains `answer` and `toolsUsed`. Backend logs show the selected tool names. Both users and admins can ask questions.

The same tools are available to external MCP clients at `/api/mcp` over authenticated stateless Streamable HTTP. The app itself uses an in-memory MCP connection, so no public tunnel or hosted MCP server is needed. OpenAI chooses tools but never receives your database credentials or runs arbitrary SQL.

This is retrieval before generation using live SQL data. Document embedding/vector-search files from the RAG lesson are not needed for these database questions. The API integration uses at most two provider requests per question; each has a 30-second timeout with retries disabled.

### Regional questions and limits

For “Which future vacations are in Europe?”, the future-vacation tool retrieves real records, then the AI interprets their destination names. **Geographic classification is an inference**, not a stored database fact. Ambiguous destinations should be flagged. No `europe-countries.ts` list or continent column is introduced. If exact geographic filtering becomes a requirement, add structured location data rather than relying on the model's interpretation.

MySQL `CURDATE()` uses the database session's calendar date. Configure your database timezone appropriately. Future lists are capped at 100; the answer must disclose truncation. Active counts and averages are exact database aggregates, not calculated from a capped list. Unsupported questions receive a scope explanation. The AI's final phrasing still needs normal review.

## 404 page and video

Unknown frontend routes display a useful explanation, links to vacations/sign-in, and `Frontend/public/media/lost-at-sea.mp4`. The original vector animation is four seconds, muted, and does not loop. Native controls allow pause/replay; reduced-motion preferences disable automatic playback. A PNG poster remains available before playback. No remote video host or tracking service is used.

The video is included as a ready-to-use file and is displayed only on the 404 page.

## Postman collection

Import `Backend/Vacation-Resorts.postman_collection.json` into Postman. It follows the Resort collection and contains 13 application requests.

Set `user_email` and `user_password`, then send Register or Login. The returned token is saved automatically. Log in with admin credentials for add/update/delete/report requests. Set `vacationId` and `imageName` as needed, and select a local image for Add Vacation. The image field is disabled by default on Update so the existing image is retained.

## Verification

Backend:

```bash
cd Backend
npm run typecheck
npm test
```

Frontend:

```bash
cd Frontend
npm run build
```

The automated backend tests cover signup routing/roles, MCP discovery and calls, validation, guest/expired-token protection, fresh query results, and sending retrieved evidence to the AI. SQL and OpenAI are mocked, so these tests do not change your database or consume API credit.

For live checks, sign up, sign in, and ask the three example MCP questions. Compare with:

```sql
SELECT COUNT(*) FROM vacations WHERE startDate <= CURDATE() AND endDate >= CURDATE();
SELECT ROUND(AVG(price), 2) FROM vacations;
SELECT destination, startDate, endDate, price FROM vacations
WHERE startDate > CURDATE() ORDER BY startDate, vacationId;
```

A future-vacation list may correctly be empty if the seeded dates are already past. Edit a test vacation to future dates if needed.

Also verify duplicate signup gives 409, missing authentication gives 401, admin CRUD remains protected, unknown browser routes show the 404 page, and the 404 video stays paused with reduced motion enabled.

## Submission status

This source includes the application's implemented features and focused tests. Docker configuration and the Postman collection are included. Live Docker/AI verification, the final database export and clean-machine submission checks still need completion before submission. A complete project-wide automated test suite is optional and is not an assignment requirement.

Do not commit `.env`, API keys, `node_modules`, or generated build output.
