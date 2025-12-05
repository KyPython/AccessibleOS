# AccessibleOS Backend

Node.js + Express + TypeScript API with PostgreSQL and Prisma ORM.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   
   Create a `.env` file in the `backend/` directory with the following content:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/accessibleos?schema=public"
   PORT=3000
   NODE_ENV=development
   ```
   
   Replace `user`, `password`, and database details with your PostgreSQL credentials.

3. Generate Prisma Client:
   ```bash
   npm run prisma:generate
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

- `GET /health` - Health check
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Database Management

Open Prisma Studio (database GUI):
```bash
npm run prisma:studio
```

## Accessibility Features

The backend enforces accessibility constraints:

- **altText validation**: When `hasMedia` is `true`, `altText` is required
- **Task metadata**: Supports accessibility-related fields (altText, labels)
- **Validation**: Express-validator ensures data integrity and accessibility compliance

## Future Integrations

TODOs for future Firebase/Supabase integration are documented in the codebase. The current structure supports easy migration to these services.

