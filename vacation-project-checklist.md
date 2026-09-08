# Vacation Project — Start-to-Finish Checklist

Use this checklist in order. Do not move to the next phase until the verification gate for the current phase passes.

Project stack: MySQL, Node.js, Express, React, and TypeScript.

## Phase 0 — Prepare the workspace

- [x] Create the main project folder using your full name in English.
- [x] Confirm it contains exactly the required top-level folders: `Database`, `Backend`, and `Frontend`.
- [x] Copy the course Full Stack Template into the correct folders.
- [x] Confirm `.gitignore` excludes `node_modules`, `dist`/`build`, and every `.env` file.
- [x] Create `.env.example` files containing variable names only—never real secrets.
- [x] Run `npm install` inside `Backend`.
- [x] Run `npm install` inside `Frontend`.
- [x] Confirm the backend starts.
- [x] Confirm the frontend starts.
- [x] Initialize Git and make a clean template commit.

Verification gate:

- [x] Both projects run without TypeScript or import errors.
- [x] No secret or `node_modules` folder appears in `git status`.

Suggested commit: `chore: initialize project from course template`

## Phase 1 — Design the MySQL database

Relevant lessons: relational database design, SQL tables, joins, DML, and the Full Stack Template.

- [x] Draw the relationship between `roles`, `users`, `vacations`, and `likes`.
- [x] Create a `roles` table with Admin and User roles.
- [x] Create a `users` table with ID, first name, last name, unique email, password hash, and role ID.
- [x] Create a `vacations` table with ID, destination, description, start date, end date, price, and image filename.
- [x] Create a `likes` junction table containing user ID and vacation ID.
- [x] Give `likes` a composite primary key so one user cannot like the same vacation twice.
- [x] Add foreign keys from users to roles and from likes to users/vacations.
- [x] Choose correct delete behavior: deleting a vacation or user should remove its likes.
- [x] Add database constraints for unique email, nonnegative price, maximum price 10,000, and valid date order.
- [x] Insert both roles.
- [x] Insert one development admin and one development user with hashed passwords.
- [x] Insert at least 12 vacations with realistic data.
- [x] Include past, currently active, and future vacations so every filter can be tested.
- [x] Insert several likes for the development user.
- [x] Export the completed database into the `Database` folder.

Verification gate:

- [x] Importing the SQL into an empty MySQL server succeeds without errors.
- [x] Running the SQL again also succeeds because tables are dropped or safely recreated.
- [x] Duplicate emails are rejected.
- [x] Duplicate user-vacation likes are rejected.
- [x] A `LEFT JOIN` query returns every vacation, including vacations with zero likes.
- [x] Vacations can be sorted by `startDate ASC`.

Suggested commit: `feat: create vacations database schema and seed data`

## Phase 2 — Adapt the backend template

Relevant lessons: Layered REST API, middleware, error handling, and secure coding.

- [x] Replace generic `data-*` placeholders with project-specific files.
- [x] Keep HTTP routing inside `controllers`.
- [x] Keep business logic and SQL inside `services`.
- [x] Keep validation and data shapes inside `models`.
- [x] Keep configuration, database access, password hashing, and JWT helpers inside `utils`.
- [x] Keep authentication, authorization, errors, logging, and security inside `middleware`.
- [x] Configure all database and secret values through the backend `.env` file.
- [x] Add the MySQL port to the DAL configuration for Docker compatibility.
- [ ] Add a small `/api/health` route.
- [ ] Register all middleware in the correct before-controller/after-controller order.

Verification gate:

- [ ] TypeScript compilation succeeds.
- [ ] `GET /api/health` returns HTTP 200 and JSON.
- [ ] An unknown route returns HTTP 404 through the error middleware.

Suggested commit: `refactor: adapt backend template for vacation system`

## Phase 3 — Build backend authentication

Relevant lessons: Auth, JWT, secure coding, Zod, and middleware.

- [x] Add a `Role` enum whose IDs match the database.
- [x] Create `UserModel` with Zod validation.
- [ ] Create `CredentialsModel` with Zod validation.
- [ ] Require all registration fields.
- [ ] Validate email format.
- [ ] Require passwords to contain at least four characters.
- [ ] Implement `isEmailTaken` using a parameterized SQL query.
- [ ] Force every public registration to receive the User role on the server.
- [ ] Hash the password before storing it.
- [ ] Hash the submitted login password before comparing it.
- [ ] Generate a JWT after successful registration and login.
- [ ] Exclude the password hash from the JWT payload and API responses.
- [ ] Implement logged-in and admin middleware.
- [ ] Add `POST /api/auth/register`.
- [ ] Add `POST /api/auth/login`.
- [ ] Add both requests to the Postman collection.

Verification gate:

- [ ] Registration returns HTTP 201 and a valid token.
- [ ] A duplicate email returns HTTP 409.
- [ ] Invalid input returns HTTP 422.
- [ ] Incorrect credentials return HTTP 401.
- [ ] A new registrant cannot choose the Admin role by changing the request body.
- [ ] The database never contains a plain-text password.

Suggested commit: `feat: add registration login and role authorization`

## Phase 4 — Build the vacations read API

Relevant lessons: Layered REST API, SQL joins, JWT, and handling images.

- [ ] Create `VacationModel` with all database and response fields.
- [ ] Add Zod validation for destination, description, dates, and price.
- [ ] Add response-only fields for image URL, like count, and whether the current user liked it.
- [ ] Write one SQL query that returns vacations ordered by start date ascending.
- [ ] Use `LEFT JOIN` so vacations with zero likes are returned.
- [ ] Return the total likes for each vacation.
- [ ] Return whether the logged-in user liked each vacation.
- [ ] Build image URLs without exposing server file paths.
- [ ] Add `GET /api/vacations` as a logged-in route.
- [ ] Add `GET /api/vacations/:id` for the edit screen.
- [ ] Add the image-serving route.
- [ ] Add all requests to Postman.

Verification gate:

- [ ] An unauthenticated request returns HTTP 401.
- [ ] The response is sorted by `startDate ASC`.
- [ ] Every item has `likesCount` and `isLiked`.
- [ ] An unknown vacation ID returns HTTP 404.
- [ ] Each returned image URL loads successfully.

Suggested commit: `feat: add protected vacation queries and images`

## Phase 5 — Build the likes API

Relevant lessons: parameterized SQL, junction tables, JWT, and Redux service patterns.

- [ ] Extract the current user ID from a verified JWT—not from the request body.
- [ ] Add `POST /api/vacations/:vacationId/likes`.
- [ ] Add `DELETE /api/vacations/:vacationId/likes`.
- [ ] Prevent admins from liking vacations on the backend.
- [ ] Handle repeated like/unlike requests predictably.
- [ ] Return HTTP 404 for a nonexistent vacation.
- [ ] Add both requests to Postman.

Verification gate:

- [ ] A user can like a vacation once.
- [ ] The like count increases by one.
- [ ] Removing the like decreases the count by one.
- [ ] A second identical like does not create a duplicate row.
- [ ] An admin receives HTTP 403 when attempting to like or unlike.

Suggested commit: `feat: add like and unlike endpoints`

## Phase 6 — Build the admin vacations API

Relevant lessons: add/update/delete, React forms, image handling, and admin middleware.

- [ ] Add an insert-specific validation method.
- [ ] Require an image when adding a vacation.
- [ ] Reject past start dates when adding a vacation.
- [ ] Reject an end date earlier than the start date.
- [ ] Reject prices below 0 or above 10,000.
- [ ] Save uploaded images in the backend images folder.
- [ ] Store only the generated image filename in MySQL.
- [ ] Add `POST /api/vacations` as an admin-only route.
- [ ] Add update-specific validation that permits past dates.
- [ ] Make the image optional during an update.
- [ ] Keep the old image when no replacement is uploaded.
- [ ] Replace and remove the old file when a new image is uploaded.
- [ ] Add `PUT /api/vacations/:id` as an admin-only route.
- [ ] Delete the stored image when deleting a vacation.
- [ ] Add `DELETE /api/vacations/:id` as an admin-only route.
- [ ] Add all requests to Postman.

Verification gate:

- [ ] A normal user receives HTTP 403 for every admin mutation.
- [ ] Add returns HTTP 201 and the complete stored vacation.
- [ ] Update returns the updated vacation.
- [ ] Delete returns HTTP 204.
- [ ] Invalid price/date/image requests fail without leaving orphan files.

Suggested commit: `feat: add admin vacation CRUD and image management`

## Phase 7 — Adapt the frontend foundation

Relevant lessons: Vite, components, routing, services, Redux, notifications, and auth.

- [ ] Replace generic template names and components with vacation-domain names.
- [ ] Create frontend models for User, Credentials, Vacation, Like, and report rows.
- [ ] Add a single API base URL to the frontend `.env` file.
- [ ] Configure the Axios JWT interceptor once at startup.
- [ ] Create the Redux store and typed application state.
- [ ] Create a user slice.
- [ ] Create a vacations slice.
- [ ] Restore the logged-in user from the stored JWT on page refresh.
- [ ] Create authentication and admin guard hooks/components.
- [ ] Define every required route before building page details.
- [ ] Make the navigation menu depend on guest/user/admin state.
- [ ] Display the logged-in user’s full name.

Verification gate:

- [ ] The frontend builds without TypeScript errors.
- [ ] Refreshing the browser preserves a valid login.
- [ ] Guests, users, and admins see different menus.
- [ ] Direct navigation to a protected URL is blocked correctly.

Suggested commit: `refactor: create frontend state routing and access foundation`

## Phase 8 — Build registration and login screens

Relevant lessons: React Hook Form, MUI, notifications, auth services, and routing.

- [ ] Build the registration form with all required fields.
- [ ] Add client-side email validation.
- [ ] Add the four-character minimum password validation.
- [ ] Send registration through the auth service.
- [ ] Store the returned token and initialize Redux.
- [ ] Navigate to the vacations page after registration.
- [ ] Build the login form with the same email/password rules.
- [ ] Display meaningful backend errors.
- [ ] Navigate to the vacations page after login.
- [ ] Implement logout and clear both local storage and Redux.

Verification gate:

- [ ] Invalid forms do not send requests.
- [ ] Registration, login, refresh, and logout all work.
- [ ] Wrong credentials produce a visible error.
- [ ] The UI never stores or logs the user’s password.

Suggested commit: `feat: add frontend authentication flow`

## Phase 9 — Build the vacation cards, filters, and pagination

Relevant lessons: lists, props, state, effects, services, Redux, and conditional rendering.

- [ ] Build a reusable vacation card.
- [ ] Display destination, description, dates, price, image, and like count.
- [ ] Display whether the current user liked each vacation.
- [ ] Fetch vacations through a frontend service.
- [ ] Store or update fetched vacations consistently in Redux.
- [ ] Add loading, error, empty, and success states.
- [ ] Add Like/Unlike behavior with an immediate UI update.
- [ ] Add the All filter.
- [ ] Add the My Likes filter.
- [ ] Add the Active Now filter.
- [ ] Add the Not Started filter.
- [ ] Display exactly nine cards per page.
- [ ] Add pagination controls.
- [ ] Reset to page one whenever the selected filter changes.
- [ ] Prevent an empty page after filtering or deleting data.

Verification gate:

- [ ] Every filter matches the specification exactly.
- [ ] Pagination is calculated from the filtered results.
- [ ] Like counts and icons remain correct after switching filters/pages.
- [ ] The UI remains usable on narrow screens.

Suggested commit: `feat: add vacation cards filters likes and pagination`

## Phase 10 — Build the admin screens

Relevant lessons: protected routes, forms, multipart requests, add/update/delete.

- [ ] Show add/edit/delete controls only to admins.
- [ ] Ensure the normal-user card never displays admin controls.
- [ ] Build the Add Vacation screen.
- [ ] Reproduce all backend validations in the form for quick feedback.
- [ ] Send the add request as `FormData`.
- [ ] Build the Edit Vacation screen with existing values.
- [ ] Display the current image and make replacement optional.
- [ ] Send the update request as `FormData`.
- [ ] Ask for confirmation before deletion.
- [ ] Do not delete when the admin cancels.
- [ ] Update the UI/Redux after successful add, edit, or delete.

Verification gate:

- [ ] Admin CRUD works without manually refreshing.
- [ ] Past dates are rejected on add but allowed on edit.
- [ ] The server still blocks admin URLs when the frontend is bypassed.

Suggested commit: `feat: add protected admin vacation management`

## Phase 11 — Build reports and CSV export

Relevant lessons: SQL aggregation, REST services, charts, and file downloads.

- [ ] Create an admin-only report query using `LEFT JOIN`, `COUNT`, and `GROUP BY`.
- [ ] Include vacations with zero likes.
- [ ] Add an admin-only JSON report endpoint.
- [ ] Build the chart with destination on the X-axis and likes on the Y-axis.
- [ ] Make labels readable when destination names are long.
- [ ] Generate a valid CSV containing destination and like count.
- [ ] Escape CSV values correctly.
- [ ] Add an admin-only CSV download endpoint.
- [ ] Add report and CSV requests to Postman.

Verification gate:

- [ ] The chart values match direct SQL results.
- [ ] The downloaded CSV opens correctly in Excel.
- [ ] A normal user receives HTTP 403 for report and CSV endpoints.

Suggested commit: `feat: add vacation likes report and csv export`

## Phase 12 — Build the AI recommendation page

Relevant lessons: OpenAI API and secure coding.

- [ ] Keep the OpenAI API key only in the backend `.env` file.
- [ ] Never use `dangerouslyAllowBrowser` or a `VITE_OPENAI_API_KEY`.
- [ ] Add a logged-in backend endpoint that accepts a destination.
- [ ] Validate and sanitize the destination.
- [ ] Create a focused system prompt for useful travel recommendations.
- [ ] Handle empty or failed AI responses.
- [ ] Build the protected frontend page.
- [ ] Add loading, error, and answer states.

Verification gate:

- [ ] The browser network/devtools never exposes the OpenAI key.
- [ ] Guests cannot access the page or endpoint.
- [ ] A normal destination returns a useful answer.
- [ ] Empty input is rejected before calling the AI provider.

Suggested commit: `feat: add secure AI travel recommendations`

## Phase 13 — Build the MCP database-question feature

Relevant lessons: Building MCP Server, AI Agents, and Microservices.

- [ ] Define the exact database questions the MCP tools must support.
- [ ] Create MCP tools for vacation listings and statistics.
- [ ] Validate every MCP tool argument with Zod.
- [ ] Keep SQL inside services; MCP tools should call services.
- [ ] Register the tools on the backend MCP server.
- [ ] Register the MCP transport routes.
- [ ] Add a protected backend AI endpoint for the user’s question.
- [ ] Keep the AI key on the backend.
- [ ] Build the protected Ask MCP frontend page.
- [ ] Add loading, error, and answer states.
- [ ] Test the specification examples: active count, average price, and future European vacations.

Verification gate:

- [ ] Answers are based on current database results rather than hard-coded values.
- [ ] Changing database rows changes subsequent answers.
- [ ] Guests cannot use the feature.
- [ ] Logs show which MCP tool was selected for each test question.

Suggested commit: `feat: add MCP vacation database assistant`

## Phase 14 — Add automated tests

Relevant lessons: Unit Testing and Integration Testing.

- [ ] Separate test configuration from production configuration.
- [ ] Test validation models independently.
- [ ] Unit-test important service rules.
- [ ] Integration-test registration and login.
- [ ] Integration-test authentication and admin authorization.
- [ ] Integration-test vacation reads and sorting.
- [ ] Integration-test like/unlike behavior.
- [ ] Integration-test admin add/edit/delete validation.
- [ ] Ensure test data does not damage development data.
- [ ] Add a single command that runs the complete test suite.

Verification gate:

- [ ] Tests pass repeatedly from a clean state.
- [ ] At least one failure-path test exists for every major endpoint group.

Suggested commit: `test: cover authentication vacations likes and admin routes`

## Phase 15 — Dockerize the complete system

Relevant lessons: Dockerfile and Docker Compose.

- [ ] Add a backend `Dockerfile`.
- [ ] Add a backend `.dockerignore`.
- [ ] Add a frontend `Dockerfile`.
- [ ] Add a frontend `.dockerignore`.
- [ ] Add MySQL, backend, and frontend services to `compose.yaml`.
- [ ] Put all services on the same Docker network.
- [ ] Give MySQL a persistent volume.
- [ ] Initialize MySQL from the project SQL file.
- [ ] Use service names—not `localhost`—for container-to-container connections.
- [ ] Configure ports and environment variables without committing secrets.
- [ ] Add health checks and safe startup dependencies.
- [ ] Confirm uploaded images persist after container recreation.

Verification gate:

- [ ] `docker compose up -d --build` starts the entire system.
- [ ] Registration, login, vacation images, likes, admin actions, reports, AI, and MCP work through Docker.
- [ ] Restarting containers does not erase database rows or uploaded images.

Suggested commit: `chore: run full system with Docker Compose`

## Phase 16 — Prepare the final submission

- [ ] Give the root folder your full English name.
- [ ] Confirm the root contains `Database`, `Backend`, and `Frontend`.
- [ ] Export the final MySQL database into `Database`.
- [ ] Export the complete Postman collection into `Backend`.
- [ ] Add setup, environment, database, Docker, and test instructions to the root `README.md`.
- [ ] Add the GitHub repository URL to the root `README.md`.
- [ ] Push the final code to GitHub.
- [ ] Clone the repository into a new temporary location and test its instructions.
- [ ] Run the complete test suite.
- [ ] Run the production builds.
- [ ] Run the exact required Docker command from a clean state.
- [ ] Confirm `.env`, API keys, database passwords, and JWT secrets are not committed.
- [ ] Remove both `node_modules` folders from the submission copy.
- [ ] Remove generated `dist`/`build` folders unless the instructor requests them.
- [ ] Confirm there are at least 12 vacations and that all images load.
- [ ] Test the system as Guest, User, and Admin.
- [ ] Create one ZIP from the main project folder.
- [ ] Open the ZIP and confirm all required files are present.
- [ ] Submit before 14 October 2026.

Final gate:

- [ ] The project works from the README alone on a clean computer.
- [ ] Every item in the assignment specification can be demonstrated.
- [ ] No secret or unnecessary generated dependency is inside the ZIP or GitHub repository.
