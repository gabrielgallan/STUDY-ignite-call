# Description

A full-stack online scheduling application built with Next.js and integrated with Google Calendar. Developed as part of a course to explore full-stack development.

# Tech Stack

<div style="display:flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
    <div style="display:flex; align-items:center; gap: 0.5rem;">
        <img src="https://devicons.io/devicons/icons/nodejs-icon.svg" width="25"/> Node.js
    </div>
    <div style="display:flex; align-items:center; gap: 0.5rem;">
        <img src="https://devicons.io/devicons/icons/nextjs-icon.svg" width="25"/> Next.js
    </div>
    <div style="display:flex; align-items:center; gap: 0.5rem;">
        <img src="https://devicons.io/devicons/icons/react.svg" width="25"/> React
    </div>
    <div style="display:flex; align-items:center; gap: 0.5rem;">
        <img src="https://devicons.io/devicons/icons/prisma.svg" width="25"/> Prisma
    </div>
</div>

# How to run locally

```bash
# 1. Install dependencies
pnpm install

# 2. Start the services
docker compose up -d

# 3. Create and configure Google OAuth Client

# 4. Create and configure .env based on .env.example

# 5. Apply the migrations and generate the Prisma client
pnpm db:prod
pnpm db:generate

# 6. Start the application
pnpm dev
```
