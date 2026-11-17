# Personal Finance Tracker API

A REST API for tracking income and expenses with JWT authentication, MongoDB, Cloudinary uploads, Zod validation and Swagger documentation.

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas database
- Cloudinary account (only needed for profile-picture upload)

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/personal_finance_tracker
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Run in development:

```bash
npm run dev
```

Run normally:

```bash
npm start
```

Open `http://localhost:5000/docs` for Swagger UI.

## Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/profile` | User | Current profile |
| POST | `/transactions` | User | Add income/expense |
| GET | `/transactions` | User | List own transactions; supports type, category, from, to, page, limit |
| GET | `/transactions/monthly-summary?year=2025&month=5` | User | Monthly totals by category |
| PUT | `/transactions/:id` | Owner | Edit own transaction |
| DELETE | `/transactions/:id` | Owner | Delete own transaction |
| GET | `/categories` | User | Predefined categories |
| POST | `/upload/profile-picture` | User | Upload image (multipart field: `image`) |
| GET | `/admin/overview` | Admin | Platform statistics |

## Authentication
After registering or logging in, copy the returned token. For protected endpoints, send:

```http
Authorization: Bearer YOUR_TOKEN
```

In Swagger, click **Authorize** and paste the token. Do not include the word `Bearer` if Swagger adds it automatically.

## Example transaction

```json
{
  "title": "Groceries",
  "amount": -50,
  "type": "expense",
  "category": "Food",
  "date": "2025-05-27"
}
```

Income amounts must be positive and expense amounts must be negative, matching the transaction type. Monthly summaries display total spending as a positive amount.

## Make a user admin

Registration always creates a `user` role; clients cannot choose their own role. To promote your own test account, use MongoDB Compass or mongosh after registering:

```javascript
use personal_finance_tracker
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Log in again after changing the role to receive a JWT containing the admin role. The API checks the current database user role on protected requests.

## Deployment on Render
1. Push this project to GitHub.
2. In Render, create a **Web Service** and connect the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the environment variables from `.env` in Render's Environment settings. Use MongoDB Atlas for `MONGODB_URI`.
6. Add `API_URL=https://YOUR-SERVICE.onrender.com` so Swagger displays the deployed server URL.
7. Redeploy and open `https://YOUR-SERVICE.onrender.com/docs`.

Never commit `.env` or expose your JWT/Cloudinary secrets.

## Submission checklist
- [ ] GitHub repository pushed
- [ ] Local API works
- [ ] Swagger `/docs` works
- [ ] At least five endpoints tested and screenshots recorded
- [ ] Render deployment works
- [ ] Live Render `/docs` URL added to submission
