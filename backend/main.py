from fastapi import FastAPI
from routers import projects, tasks, users, agents

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI PM Boss Backend Running 🚀"}

# Routers
app.include_router(projects.router, prefix="/projects")
app.include_router(tasks.router, prefix="/tasks")
app.include_router(users.router, prefix="/users")
app.include_router(agents.router, prefix="/agents")