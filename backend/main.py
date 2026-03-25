import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import create_tables, check_connection
from routers import projects, tasks, users, agents
from webhooks import github, slack, jira

load_dotenv()

app = FastAPI(
    title="AI PM Boss",
    description="Autonomous AI-powered project manager for software teams",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(github.router, prefix="/webhooks/github", tags=["Webhooks"])
app.include_router(slack.router, prefix="/webhooks/slack", tags=["Webhooks"])
app.include_router(jira.router, prefix="/webhooks/jira", tags=["Webhooks"])


@app.on_event("startup")
async def startup_event():
    print("[Main] AI PM Boss Backend Starting...")
    check_connection()
    create_tables()
    print("[Main] AI PM Boss Backend Ready")


@app.on_event("shutdown")
async def shutdown_event():
    print("[Main] AI PM Boss Backend Shutting Down...")


@app.get("/")
def root():
    return {
        "message": "AI PM Boss Backend Running 🚀",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    db_status = check_connection()
    return {
        "status": "healthy" if db_status else "degraded",
        "database": "connected" if db_status else "disconnected",
        "agents": "ready",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )