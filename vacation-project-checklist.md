# Vacation Resort — Project #3 Checklist

Deadline: 14 October 2026

## 0. Workspace setup
- [x] Create Database, Backend, and Frontend folders.
- [x] Copy and configure the course template.
- [x] Configure .gitignore and .env.example.
- [x] Install dependencies and run backend/frontend.
- [x] Initialize Git and commit the clean template.

## 1. Database
- [x] Create vacationDb.
- [x] Create roles, users, vacations, and likes tables.
- [x] Configure primary keys, foreign keys, and constraints.
- [x] Set User = 1 and Admin = 2.
- [x] Prevent duplicate emails and duplicate likes.
- [x] Configure cascading deletion for likes.
- [x] Seed at least 12 vacations.
- [x] Include past, current, and future vacations.
- [x] Verify constraints and queries.
- [x] Export the initial database.
- [ ] Refresh the export before submission.

## 2. Backend foundation
- [x] Adapt the template to the vacation project.
- [x] Separate controllers, services, models, utilities, and middleware.
- [x] Configure environment variables and database connection.
- [x] Add /api/health.
- [x] Verify middleware order and unknown-route handling.

## 3. Authentication
- [x] Create Role enum, UserModel, and CredentialsModel.
- [x] Add minimum password length of 4.
- [x] Implement isEmailTaken.
- [x] Obtain and use regular-user and admin tokens.
- [x] Implement verifyLoggedIn and verifyAdmin.
- [x] Chain authentication before admin authorization.
- [x] Verify regular users receive 403 on admin CRUD routes.
- [ ] Confirm missing tokens receive 401 on all protected routes.
- [ ] Confirm expired/invalid tokens are rejected.
- [x] Verify registration requires every field and a valid email.
- [x] Verify duplicate-email registration is rejected.
- [x] Verify registration always assigns the User role.
- [x] Verify password hashing during registration and login.
- [x] Verify authentication responses exclude password hashes.
- [ ] Verify login validation and incorrect-credentials handling.

## 4. Vacation retrieval
- [x] Implement GET all vacations.
- [x] Sort vacations by startDate ascending.
- [x] Include likesCount and the current user's isLiked value.
- [x] Include imageUrl.
- [x] Implement GET one vacation.
- [x] Return 404 for a nonexistent vacation.
- [x] Serve vacation images.
- [ ] Confirm numeric price conversion in GET-all results.
- [ ] Validate vacation IDs before passing them to SQL.

## 5. Admin vacation management
- [x] Add a vacation with an uploaded image.
- [x] Store image files on the server and filenames in MySQL.
- [x] Update a vacation without replacing its image.
- [x] Update a vacation with a replacement image.
- [x] Remove the old image after successful replacement.
- [x] Delete a vacation and its image.
- [x] Verify repeated deletion returns 404.
- [x] Protect add, update, and delete routes.
- [x] Test the add → update → delete flow in Postman.

## 6. Vacation validation
- [x] Reject empty destination and description.
- [x] Reject prices below 0 or above 10,000.
- [x] Reject empty prices instead of converting them to 0.
- [x] Reject an end date earlier than the start date.
- [x] Require an image when adding.
- [x] Allow editing without uploading a new image.
- [x] Add the past-date restriction to creation only.
- [x] Verify editing accepts past dates.
- [x] Confirm past-date creation returns the date-specific error.
- [ ] Confirm missing or malformed dates are rejected.
- [ ] Confirm explicitly entered price 0 is accepted.

## 7. Likes and permissions
- [x] Implement adding and removing likes.
- [x] Obtain the user ID from the authenticated token.
- [x] Add verifyUser to both like routes.
- [x] Verify admins cannot like or unlike.
- [x] Verify regular users can like and unlike.
- [x] Verify likesCount and isLiked change correctly.
- [x] Verify repeated likes cannot create duplicate records.
- [ ] Verify liking a nonexistent vacation is handled correctly.

## 8. Admin reports — NEXT
- [ ] Implement getVacationsReport in the service.
- [ ] Include each vacation's destination and like count.
- [ ] Include vacations with zero likes.
- [ ] Add an admin-only report controller route.
- [ ] Test report results and permissions in Postman.
- [ ] Build the report chart: destination on X, likes on Y.
- [ ] Add CSV download containing destinations and like counts.
- [ ] Restrict report and CSV access to admins.

## 9. Frontend authentication and navigation
- [ ] Build registration and login pages.
- [ ] Add required-field, email, and password validation.
- [ ] Display meaningful authentication errors.
- [ ] Redirect to vacations after registration/login.
- [ ] Manage authentication state and logout.
- [ ] Protect registered-user and admin pages.
- [ ] Show navigation appropriate to the user's role.
- [ ] Display the logged-in user's full name.

## 10. Frontend vacation pages
- [ ] Display vacations as cards with all required details.
- [ ] Display like counts and current-user like status.
- [ ] Implement like/unlike actions for regular users.
- [ ] Sort by start date ascending.
- [ ] Display 9 vacations per page with pagination.
- [ ] Add filters: all, liked, active, and upcoming.
- [ ] Build the admin vacation view without like/unlike controls.
- [ ] Build add and edit forms with the required validation.
- [ ] Show the existing image when editing.
- [ ] Add delete confirmation.

## 11. AI recommendation
- [ ] Add a protected backend endpoint for destination advice.
- [ ] Build the destination-input page.
- [ ] Display the AI recommendation.
- [ ] Restrict access to logged-in users.
- [ ] Handle loading and errors.

## 12. MCP database questions
- [ ] Build the backend MCP server.
- [ ] Connect it to the vacation database.
- [ ] Support questions about database information.
- [ ] Build the question-and-answer page.
- [ ] Restrict access to logged-in users.
- [ ] Test answers against actual database results.

## 13. Docker and submission
- [ ] Configure Docker for the full application.
- [ ] Verify docker compose up -d --build starts the system.
- [ ] Run a final end-to-end check for User and Admin.
- [ ] Keep at least 12 vacations with realistic data.
- [ ] Push the project to GitHub.
- [ ] Include the repository link in the root README.md.
- [ ] Export the final database into Database.
- [ ] Export the Postman collection into Backend.
- [ ] Name the root folder with your full name in English.
- [ ] Include Database, Backend, and Frontend folders.
- [ ] Remove node_modules from the submission copy.
- [ ] ZIP the root folder and submit by 14 October 2026.