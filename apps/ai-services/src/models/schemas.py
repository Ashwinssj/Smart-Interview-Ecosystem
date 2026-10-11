from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SkillCategory(str, Enum):
    PROGRAMMING = "programming"
    CLOUD = "cloud"
    DATABASE = "database"
    FRAMEWORK = "framework"
    OTHER = "other"


class Education(BaseModel):
    degree: str
    institution: str
    year: Optional[int] = None
    cgpa: Optional[float] = None


class Project(BaseModel):
    name: str
    description: str
    technologies: List[str] = []


class Internship(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class ResumeParsedData(BaseModel):
    education: List[Education] = []
    skills: List[str] = []
    projects: List[Project] = []
    certifications: List[str] = []
    internships: List[Internship] = []
    experience: List[Experience] = []
    keywords: List[str] = []


class ResumeMatchResult(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    skill_match_score: int = Field(ge=0, le=100)
    keyword_match_score: int = Field(ge=0, le=100)
    missing_skills: List[str] = []
    missing_keywords: List[str] = []
    recommendations: List[str] = []
    passed: bool


class InterviewCategory(str, Enum):
    HR = "hr"
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    PROJECT = "project"
    ROLE_SPECIFIC = "role_specific"


class InterviewQuestion(BaseModel):
    question: str
    category: InterviewCategory
    follow_up_hints: List[str] = []


class InterviewEvaluation(BaseModel):
    communication_score: int = Field(ge=0, le=100)
    technical_score: int = Field(ge=0, le=100)
    problem_solving_score: int = Field(ge=0, le=100)
    relevance_score: int = Field(ge=0, le=100)
    overall_score: int = Field(ge=0, le=100)
    strengths: List[str] = []
    weaknesses: List[str] = []
    recommendations: List[str] = []
    detailed_feedback: str


class RoadmapTask(BaseModel):
    title: str
    description: str
    type: str  # study, practice, mock_interview, resume_review
    estimated_hours: float
    resources: List[Dict[str, str]] = []
    completed: bool = False


class RoadmapWeek(BaseModel):
    week_number: int = Field(ge=1, le=4)
    focus_areas: List[str] = []
    tasks: List[RoadmapTask] = []


class DriveRequirements(BaseModel):
    role: str
    description: str
    company_name: str
    required_skills: List[str] = []
    qualifications: str = ""


class InterviewContext(BaseModel):
    resume_summary: str
    drive_requirements: DriveRequirements
    previous_qa: List[Dict[str, Any]] = []
    question_number: int
    max_questions: int = 15