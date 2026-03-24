import os
import json
from typing import List, Dict
from dotenv import load_dotenv

from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


class GeneratedTask(BaseModel):
    title: str = Field(description="Short title of the task")
    description: str = Field(description="Detailed description of what needs to be done")
    priority: str = Field(description="Priority level: low, medium, or high")
    estimated_hours: int = Field(description="Estimated hours to complete this task")
    skills_required: List[str] = Field(description="List of skills needed, e.g. ['Python', 'FastAPI']")


class TaskList(BaseModel):
    tasks: List[GeneratedTask] = Field(description="List of all generated tasks")


class TaskCreatorAgent:

    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=ANTHROPIC_API_KEY,
            temperature=0.3,
        )

        self.parser = PydanticOutputParser(pydantic_object=TaskList)

        self.system_prompt = (
            "You are an expert AI Project Manager assistant. "
            "Your job is to read a software requirement or PRD and break it down "
            "into clear, actionable development tasks. "
            "Rules: "
            "Each task must be specific and implementable by one developer. "
            "Priority must be exactly one of: low, medium, high. "
            "Estimated hours must be a realistic integer between 1 and 16. "
            "Skills required must be specific technologies like Python, React, PostgreSQL. "
            "Always return valid JSON matching the format instructions exactly. "
            "Break down large features into smaller subtasks of max 8 hours each. "
            "Do not create vague tasks like Fix bugs, be specific."
        )

    def create_tasks(self, requirement: str, project_name: str = "General") -> Dict:
        try:
            format_instructions = self.parser.get_format_instructions()

            user_message = (
                f"Project: {project_name}\n\n"
                f"Requirement / PRD:\n{requirement}\n\n"
                f"Please break this requirement into development tasks.\n\n"
                f"{format_instructions}"
            )

            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=user_message),
            ]

            print(f"[TaskCreatorAgent] Sending requirement to Claude for project: {project_name}")
            response = self.llm(messages)

            parsed: TaskList = self.parser.parse(response.content)

            total_hours = sum(task.estimated_hours for task in parsed.tasks)

            print(f"[TaskCreatorAgent] Generated {len(parsed.tasks)} tasks | {total_hours} total hours")

            return {
                "success": True,
                "project": project_name,
                "tasks": [task.dict() for task in parsed.tasks],
                "total_tasks": len(parsed.tasks),
                "total_estimated_hours": total_hours,
            }

        except Exception as e:
            print(f"[TaskCreatorAgent] Error: {str(e)}")
            return {
                "success": False,
                "project": project_name,
                "tasks": [],
                "total_tasks": 0,
                "total_estimated_hours": 0,
                "error": str(e),
            }

    def create_tasks_from_slack(self, slack_message: str, channel: str = "general") -> Dict:
        print(f"[TaskCreatorAgent] Processing Slack message from #{channel}")

        formatted_requirement = (
            f"[Source: Slack message from #{channel}]\n\n"
            f"Message:\n{slack_message}\n\n"
            "Note: This is an informal Slack message. Extract the core requirements "
            "and create proper development tasks from it."
        )

        return self.create_tasks(
            requirement=formatted_requirement,
            project_name=f"Slack-{channel}"
        )

    def prioritize_tasks(self, tasks: List[Dict]) -> List[Dict]:
        priority_order = {"high": 0, "medium": 1, "low": 2}

        sorted_tasks = sorted(
            tasks,
            key=lambda t: (
                priority_order.get(t.get("priority", "low"), 2),
                t.get("estimated_hours", 0)
            )
        )

        print(f"[TaskCreatorAgent] Tasks prioritized: {len(sorted_tasks)} tasks sorted")
        return sorted_tasks


if __name__ == "__main__":
    agent = TaskCreatorAgent()

    sample_prd = (
        "Build a user authentication system for our web app. "
        "It should support email/password login, Google OAuth, "
        "JWT token generation, password reset via email, "
        "and a user profile page where users can update their name and avatar. "
        "The backend should be FastAPI and frontend should be Next.js."
    )

    result = agent.create_tasks(
        requirement=sample_prd,
        project_name="Auth System"
    )

    print(json.dumps(result, indent=2))