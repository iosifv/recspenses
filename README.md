# Recspenses App

This is a [T3 Stack](https://create.t3.gg/) training project. At least that's how it started.

## Tech Stack and Links

- [T3 Stack](https://create.t3.gg/)
- [Vercel](https://vercel.com) - Deployment
- [Next.js](https://nextjs.org) - Framework
- [Clerk](https://clerk.com) - Authentication
- [Drizzle](https://orm.drizzle.team) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Sentry](https://sentry.io) - Error Management
- [Heroicons](https://heroicons.com/) - Icons
- [Shadcn](https://ui.shadcn.com/) - UI Components

### Development Links (for easy access)

- [Documentation - Youtube - Theo t3](https://www.youtube.com/watch?v=d5x0JCZbAJs)
- [Documentation - Theo's Github Project](https://github.com/t3dotgg/t3gallery)
- [Documentation - Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Deployment Dashboard - GitHub](https://github.com/iosifv/recspenses)
- [Deployment Dashboard - Vercel](https://vercel.com/iosifs-projects-fc6671c4/recspenses/2ySVBdG28NPG8yaAAf8uAm6ig4Ut)
- [Deployment Dashboard - Clerk](https://dashboard.clerk.com/apps/app_2mLIvcMUGIPL5UVkyIwSiLkgFOi/instances/ins_2mLIvY2tu01h3OJw32AeWsb2byy)
- [Deployment Dashboard - Sentry](https://casa4-zv.sentry.io/issues/)
- [Deployed - App](https://recspenses.vercel.app/)
- [Local - App](http://localhost:3000/)
- [Local - Drizzle Studio](https://local.drizzle.studio/)
- [Local - Supermaven for code completion](https://supermaven.com/pricing)

## To Do list

- [x] Make sure deployment works
- [x] Connect to DB
- [x] Add authentication
- [x] Scaffold Basic UI
- [x] Read and write from a DB
- [x] Connect authentication with my db
- [x] Error management (w/ sentry)
- [x] Add ShadUI
- [x] Decide on a final database design schema
- [x] Add docker compose for a local database
- [x] Create a script for seeding example data on signup
- [ ] Create logic for dumping all the user's data into one single json
  - [ ] Send that json to the dashboard page
  - [ ] Use that json to export users data from settings page
- [ ] Analytics (w/ posthog)
- [ ] Ratelimiting (w/ upstash)

## Todo User Journeys

- [x] In my Editor Tab I can see all my expenses in their original currency
- [ ] In my Editor Tab I can add a new expense
- [ ] In my Editor Tab I can edit an expense
  - [ ] I can add a new Tag to an expense
  - [x] I can delete a Tag from an expense
- [x] In my Editor Tab I can delete an expense
- [x] In my Settings Tab I can Edit my Categories, Sources and Tags
  - [x] I can add a new Category, Source or Tag
  - [x] I can edit a Category, Source or Tag
  - [x] I can delete a Category, Source or Tag
- [x] In my Settings Tab I can see information about me
- [ ] In my Settings Tab I can Export all my expenses to a json file
- [ ] In my Settings Tab I can Import my expenses from a json file
- [ ] In my Dashboard Tab I can see my expenses analytics transformed into one currency
- [ ] In my Dashboard Tab I can pick which currency I want to see my expenses in

## Development

### Setup

1. Clone the repo
2. Run `pnpm install`
3. Run `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
5. Use VsCode's Task Explorer to run the app and drizzle studio.

### Run the database locally with docker compose

1. Start Docker Compose `docker compose up`
2. Connect to the container `docker exec -it local_postgres psql -U postgres -d my_local_db`
3. Run `SELECT * FROM pg_catalog.pg_tables WHERE schemaname='public';` to see the tables

Drop all tables if you want to start fresh

- Drop all tables in the container: `docker exec -it local_postgres psql -U postgres -d my_local_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`
- Delete the migrations folder: `rm -rf drizzle/`
- Regenerate the schema: `npx drizzle-kit generate`
- Migrate the database: `npx drizzle-kit migrate`
- Or Push the schema: `npx drizzle-kit push`
