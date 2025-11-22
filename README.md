# Auth App Backend (Mongo Version)

Converted from Prisma/SQLite (originally Postgres target) to NestJS + Mongoose.

## What Changed
- Removed Prisma client, schema, and migrations.
- Added Mongoose integration via `MongooseDatabaseModule`.
- Implemented Mongoose schemas: User, UserProfile, FamilyMember, PasswordResetToken.
- Refactored services (`AuthService`, `ProfileService`, `UserService`) to use Mongoose models.
- Updated environment config to use `MONGO_URI`.

## Environment
Create a `.env` file:
```
PORT=3000
JWT_SECRET=change-me
MONGO_URI=mongodb://localhost:27017/auth_app_dev
```

## Install & Run
```bash
npm install
npm run start:dev
```
App listens on `http://localhost:3000/api`.

## Models Overview
- User: email, phone, passwordHash
- UserProfile: 1:1 with User (userId), optional fields (village, name, etc.)
- FamilyMember: many per User (memberName, age, std, resultImage, percentage)
- PasswordResetToken: hashed token + expiration (TTL index created via expiresAt + manual cleanup)

## Password Reset Flow
1. `POST /api/auth/forgot-password` with email or phone returns raw token (dev only).
2. `POST /api/auth/reset-password` with provided token + new password.

## Migration from Prisma
If you had existing data in Postgres, export it then transform:
```sql
-- Example export (adjust table names)
COPY "User" TO STDOUT WITH CSV HEADER;
COPY "UserProfile" TO STDOUT WITH CSV HEADER;
COPY "FamilyMember" TO STDOUT WITH CSV HEADER;
```
Transform script outline (pseudo):
```js
// node scripts/migrate-postgres-to-mongo.js
// Read CSVs, map IDs, insert into Mongo.
```
See `scripts/migrate-postgres-to-mongo.example.js` (to be created) for a starter.

## Next Steps
- Add unique indexes in Mongo for compound constraints if required.
- Implement rate limiting & email/SMS delivery for password reset tokens.
- Add tests.

## Admin & Roles
Users now have a `role` field: `admin` or `user` (default `user`).
An admin account can be auto-seeded by setting env vars:
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpass
ADMIN_PHONE=9999999999 # optional, will fallback to email if missing
```
On startup, if no user with `ADMIN_EMAIL` exists it is created with role `admin`; if it exists and is not admin it is promoted.

JWT payload now includes `role` and protected routes use `@Roles('admin')` with `RolesGuard`.

## Committee Feature
Endpoint base: `/api/committees`

Public:
- `GET /api/committees` list all committees

Admin only (requires Bearer token of admin user):
- `POST /api/committees` create committee `{ name, members?: [{ memberName, post }] }`
- `POST /api/committees/:id/members` add member `{ memberName, post }`
- `PATCH /api/committees/:id/members/:index` update member at index `{ memberName, post }`
- `DELETE /api/committees/:id/members/:index` remove member at index
- `DELETE /api/committees/:id` delete entire committee

Member ordering is positional (array index). Future enhancement: assign stable member IDs for safer updates.

## Security Notes
- Protect admin credentials; rotate `JWT_SECRET` in production.
- Consider adding rate limiting and audit logging for admin actions.


```diff
+ All core features now use MongoDB.
```
