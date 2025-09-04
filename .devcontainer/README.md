# Medical Blitzy AI - Codespaces Setup

This repository is configured for GitHub Codespaces development with all necessary tools and dependencies.

## Quick Start

1. Open this repository in GitHub Codespaces
2. Wait for the container to build and dependencies to install
3. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
4. Start the backend server (when ready):
   ```bash
   cd backend
   poetry run fastapi dev app/main.py
   ```

## Ports
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Features
- Pre-configured with Node.js, Python, and all development tools
- Automatic dependency installation
- VS Code extensions for React, TypeScript, Tailwind CSS
- Port forwarding for development servers
- GitHub CLI pre-installed
