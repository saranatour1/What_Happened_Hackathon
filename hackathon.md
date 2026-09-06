# Hackathon log

- **Project:** What Happened Hackathon
- **Event:** Convex All Gas Hackathon
- **What it does:** Starter Convex + React (Vite) app with Convex Auth v2 username/password login and a sample numbers list/add demo.
- **Live app:** not deployed
- **Repo:** https://github.com/saranatour1/What_Happened_Hackathon
- **Frontend:** Convex static hosting
- **Convex deployment:** not deployed
- **Components:** @convex-dev/auth (core, password, username), @convex-dev/rate-limiter
- **Convex features:** schema, tables, queries, mutations, actions, HTTP actions, realtime queries
- **Auth:** Convex Auth
- **AI models:** none
- **Started:** 2026-09-04T14:15:58Z
- **Last updated:** 2026-09-04T15:46:00Z

## Log

### 2026-09-04 - working tree
Scaffolded the Convex + React (Vite) template, then upgraded to Convex Auth v2 alpha with username/password. Registered auth, password, and username components (with nested rate limiter); added `createUser` and custom JWT auth config; demo UI lists/adds numbers via live queries (`package.json`, `convex/convex.config.ts`, `convex/auth.ts`, `convex/auth.config.ts`, `convex/users.ts`, `convex/schema.ts`, `convex/myFunctions.ts`, `src/main.tsx`, `src/App.tsx`).

### 2026-09-04 - working tree
Added product roadmap in `plan/plan.md` and opened GitHub issues #1–#10 with milestones M1–M6 for the photo timeline (schema, R2, types/combine, Firecrawl, AgentMail, static hosting). Board target: [Project #10](https://github.com/users/saranatour1/projects/10/views/1).
