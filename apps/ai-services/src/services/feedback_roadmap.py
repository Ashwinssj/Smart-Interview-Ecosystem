"""Feedback and roadmap generation services."""

from typing import List, Dict, Any
import google.generativeai as genai
from src.models.schemas import (
    InterviewEvaluation, RoadmapWeek, RoadmapTask, DriveRequirements
)
from src.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.google_api_key)


async def generate_roadmap(
    evaluation: InterviewEvaluation,
    drive: DriveRequirements,
    resume_summary: str
) -> List[RoadmapWeek]:
    """Generate a personalized 4-week preparation roadmap based on interview weaknesses."""
    
    weaknesses_text = ", ".join(evaluation.weaknesses) if evaluation.weaknesses else "general interview skills"
    strengths_text = ", ".join(evaluation.strengths) if evaluation.strengths else "communication"
    
    prompt = f"""Create a personalized 4-week preparation roadmap for a candidate.

CANDIDATE PROFILE:
Background: {resume_summary}
Target Role: {drive.role} at {drive.company_name}
Required Skills: {', '.join(drive.required_skills)}

INTERVIEW EVALUATION:
Overall Score: {evaluation.overall_score}/100
Communication: {evaluation.communication_score}/100
Technical: {evaluation.technical_score}/100
Problem Solving: {evaluation.problem_solving_score}/100
Relevance: {evaluation.relevance_score}/100

STRENGTHS: {strengths_text}
WEAKNESSES: {weaknesses_text}

ROADMAP REQUIREMENTS:
- 4 weeks total
- Each week: focus areas (2-3), 3-5 tasks with estimated hours
- Tasks should be specific and actionable
- Include resource recommendations (title, URL, type)
- Task types: study, practice, mock_interview, resume_review
- Progress from foundations to interview simulation
- Address the identified weaknesses specifically

Return as structured JSON array of weeks with: week_number, focus_areas, tasks[] (title, description, type, estimated_hours, resources[])."""

    try:
        model = genai.GenerativeModel(settings.gemini_model)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.5,
                max_output_tokens=2000,
                response_mime_type="application/json",
            )
        )
        
        import json
        content = response.text or "[]"
        # Try to extract JSON from response
        try:
            roadmap_data = json.loads(content)
        except json.JSONDecodeError:
            # Try to find JSON in markdown code block
            import re
            match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', content, re.DOTALL)
            if match:
                roadmap_data = json.loads(match.group(1))
            else:
                raise ValueError("Could not parse roadmap JSON")
        
        # Validate and convert to RoadmapWeek objects
        weeks = []
        for week_data in roadmap_data:
            tasks = []
            for task_data in week_data.get("tasks", []):
                tasks.append(RoadmapTask(**task_data))
            weeks.append(RoadmapWeek(
                week_number=week_data.get("week_number", len(weeks) + 1),
                focus_areas=week_data.get("focus_areas", []),
                tasks=tasks
            ))
        return weeks
        
    except Exception as e:
        # Fallback roadmap
        return get_fallback_roadmap(evaluation, drive)

def get_fallback_roadmap(evaluation: InterviewEvaluation, drive: DriveRequirements) -> List[RoadmapWeek]:
    """Generate a basic fallback roadmap."""
    tech_skills = drive.required_skills[:5]
    
    return [
        RoadmapWeek(
            week_number=1,
            focus_areas=["Core Fundamentals", "Technical Basics"],
            tasks=[
                RoadmapTask(
                    title="Review OOP & Data Structures",
                    description="Refresh core CS concepts: classes, inheritance, arrays, linked lists, trees",
                    type="study",
                    estimated_hours=4,
                    resources=[
                        {"title": "CS Fundamentals Refresher", "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxw1xh5Zr7QqW", "type": "video"},
                    ]
                ),
                RoadmapTask(
                    title="SQL Practice",
                    description="Practice JOINs, subqueries, window functions, and indexing",
                    type="practice",
                    estimated_hours=3,
                    resources=[
                        {"title": "LeetCode SQL 50", "url": "https://leetcode.com/studyplan/top-sql-50/", "type": "practice"},
                    ]
                ),
                RoadmapTask(
                    title="Aptitude Basics",
                    description="Percentages, profit/loss, time & work, probability basics",
                    type="study",
                    estimated_hours=3,
                ),
            ]
        ),
        RoadmapWeek(
            week_number=2,
            focus_areas=[f"{', '.join(tech_skills[:2])}", "Advanced Topics"],
            tasks=[
                RoadmapTask(
                    title=f"Deep Dive: {tech_skills[0] if tech_skills else 'Primary Skill'}",
                    description=f"Advanced concepts, best practices, and common interview questions for {tech_skills[0] if tech_skills else 'primary skill'}",
                    type="study",
                    estimated_hours=5,
                ),
                RoadmapTask(
                    title="Technical MCQ Practice",
                    description="Complete 50+ MCQs covering required technical skills",
                    type="practice",
                    estimated_hours=3,
                ),
                RoadmapTask(
                    title="System Design Basics",
                    description="Learn scalability, caching, load balancing, database sharding fundamentals",
                    type="study",
                    estimated_hours=4,
                ),
            ]
        ),
        RoadmapWeek(
            week_number=3,
            focus_areas=["Resume & Projects", "Behavioral & HR"],
            tasks=[
                RoadmapTask(
                    title="Polish Resume & Project Explanations",
                    description="STAR method for all projects, quantify impact, prepare 2-min project pitch",
                    type="resume_review",
                    estimated_hours=3,
                ),
                RoadmapTask(
                    title="Behavioral Question Prep",
                    description="Practice 10 common behavioral questions using STAR framework",
                    type="practice",
                    estimated_hours=3,
                ),
                RoadmapTask(
                    title="Company Research",
                    description=f"Deep dive into {drive.company_name}: products, culture, recent news, tech stack",
                    type="study",
                    estimated_hours=2,
                ),
            ]
        ),
        RoadmapWeek(
            week_number=4,
            focus_areas=["Mock Interviews", "Full Simulation"],
            tasks=[
                RoadmapTask(
                    title="AI Mock Interview #1",
                    description="Full-length mock interview focusing on technical + behavioral",
                    type="mock_interview",
                    estimated_hours=1.5,
                ),
                RoadmapTask(
                    title="AI Mock Interview #2",
                    description="Role-specific mock interview with focus on weak areas",
                    type="mock_interview",
                    estimated_hours=1.5,
                ),
                RoadmapTask(
                    title="Full Placement Simulation",
                    description="Timed aptitude test + technical test + mock interview back-to-back",
                    type="mock_interview",
                    estimated_hours=3,
                ),
                RoadmapTask(
                    title="Final Review & Confidence Building",
                    description="Review all feedback, prepare questions for interviewer, mental preparation",
                    type="study",
                    estimated_hours=2,
                ),
            ]
        ),
    ]