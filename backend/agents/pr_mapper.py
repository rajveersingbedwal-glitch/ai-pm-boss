# backend/agents/pr_mapper.py
import os
import json
from typing import List, Dict, Optional
from dotenv import load_dotenv

from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage
from pydantic import BaseModel, Field

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


class PRMapping(BaseModel):
    task_id: Optional[str] = Field(description="ID of the matched task")
    task_title: str = Field(description="Title of the matched task")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    reason: str = Field(description="Why this PR matches this task")
    status_update: str = Field(description="Suggested task status: in_progress or done")


class PRMapperAgent:

    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            anthropic_api_key=ANTHROPIC_API_KEY,
            temperature=0.2,
        )

        self.system_prompt = (
            "You are an expert AI assistant that links GitHub Pull Requests to project tasks. "
            "Given a PR title, description, and a list of tasks, you find the best matching task. "
            "Rules: "
            "Analyze the PR title and description carefully. "
            "Match it to the most relevant task from the list. "
            "Confidence score must be between 0.0 and 1.0. "
            "If confidence is below 0.5 it means no strong match was found. "
            "Status update must be either in_progress if PR is open or done if PR is merged. "
            "Always return valid JSON only, no extra text."
        )

    def map_pr_to_task(
        self,
        pr_title: str,
        pr_description: str,
        pr_state: str,
        tasks: List[Dict]
    ) -> Dict:
        try:
            tasks_text = ""
            for i, task in enumerate(tasks):
                tasks_text += (
                    f"Task {i + 1}:\n"
                    f"  ID: {task.get('id', 'N/A')}\n"
                    f"  Title: {task.get('title', 'N/A')}\n"
                    f"  Description: {task.get('description', 'N/A')}\n"
                    f"  Current Status: {task.get('status', 'N/A')}\n\n"
                )

            user_message = (
                f"Pull Request Details:\n"
                f"Title: {pr_title}\n"
                f"Description: {pr_description}\n"
                f"State: {pr_state}\n\n"
                f"Available Tasks:\n{tasks_text}\n"
                f"Find the best matching task for this PR and return a JSON object with these fields:\n"
                f"task_id, task_title, confidence, reason, status_update\n"
                f"Return only valid JSON, nothing else."
            )

            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=user_message),
            ]

            print(f"[PRMapperAgent] Mapping PR: {pr_title}")
            response = self.llm(messages)

            clean_response = response.content.strip()
            if clean_response.startswith("```"):
                clean_response = clean_response.split("\n", 1)[1]
                clean_response = clean_response.rsplit("```", 1)[0]

            mapping_data = json.loads(clean_response)

            print(
                f"[PRMapperAgent] Matched to task: {mapping_data.get('task_title')} "
                f"with confidence: {mapping_data.get('confidence')}"
            )

            return {
                "success": True,
                "pr_title": pr_title,
                "pr_state": pr_state,
                "mapping": mapping_data,
            }

        except Exception as e:
            print(f"[PRMapperAgent] Error: {str(e)}")
            return {
                "success": False,
                "pr_title": pr_title,
                "pr_state": pr_state,
                "mapping": None,
                "error": str(e),
            }

    def map_multiple_prs(self, prs: List[Dict], tasks: List[Dict]) -> List[Dict]:
        results = []

        for pr in prs:
            result = self.map_pr_to_task(
                pr_title=pr.get("title", ""),
                pr_description=pr.get("description", ""),
                pr_state=pr.get("state", "open"),
                tasks=tasks
            )
            result["pr_number"] = pr.get("number")
            result["pr_url"] = pr.get("url", "")
            results.append(result)

        successful = sum(1 for r in results if r["success"])
        print(f"[PRMapperAgent] Mapped {successful}/{len(prs)} PRs successfully")

        return results

    def get_status_update(self, pr_state: str, merged: bool) -> str:
        if merged:
            return "done"
        elif pr_state == "open":
            return "in_progress"
        elif pr_state == "closed" and not merged:
            return "todo"
        return "in_progress"

    def build_pr_summary(self, mapping_results: List[Dict]) -> Dict:
        total = len(mapping_results)
        successful = [r for r in mapping_results if r["success"]]
        high_confidence = [
            r for r in successful
            if r.get("mapping", {}).get("confidence", 0) >= 0.7
        ]

        tasks_to_update = []
        for result in high_confidence:
            mapping = result.get("mapping", {})
            tasks_to_update.append({
                "task_id": mapping.get("task_id"),
                "task_title": mapping.get("task_title"),
                "new_status": mapping.get("status_update"),
                "pr_title": result.get("pr_title"),
                "pr_url": result.get("pr_url"),
                "confidence": mapping.get("confidence"),
            })

        print(f"[PRMapperAgent] Summary: {len(tasks_to_update)} tasks need status update")

        return {
            "total_prs": total,
            "successfully_mapped": len(successful),
            "high_confidence_matches": len(high_confidence),
            "tasks_to_update": tasks_to_update,
        }


if __name__ == "__main__":
    agent = PRMapperAgent()

    sample_tasks = [
        {
            "id": "TASK-001",
            "title": "Build user login API endpoint",
            "description": "Create POST /auth/login endpoint with JWT token generation",
            "status": "in_progress"
        },
        {
            "id": "TASK-002",
            "title": "Create user registration form",
            "description": "Build the frontend registration form with validation in Next.js",
            "status": "todo"
        },
        {
            "id": "TASK-003",
            "title": "Setup PostgreSQL database schema",
            "description": "Create users, projects and tasks tables with migrations",
            "status": "done"
        }
    ]

    result = agent.map_pr_to_task(
        pr_title="feat: add JWT login endpoint with token refresh",
        pr_description="Implemented POST /auth/login, added JWT generation and refresh token logic",
        pr_state="open",
        tasks=sample_tasks
    )

    print(json.dumps(result, indent=2))