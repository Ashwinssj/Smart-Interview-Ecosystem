"""API routes for AI services."""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import Optional
import tempfile
import os
import uuid
from src.models.schemas import (
    ResumeParsedData, ResumeMatchResult, DriveRequirements, 
    InterviewContext, InterviewQuestion, InterviewEvaluation,
    RoadmapWeek
)
from src.services.resume_parser import parse_resume
from src.services.resume_matcher import match_resume_to_drive
from src.services.interview_engine import (
    generate_interview_question, evaluate_interview, generate_resume_summary
)
from src.services.feedback_roadmap import generate_roadmap
from src.config import get_settings

router = APIRouter()
settings = get_settings()


@router.post("/resume/parse", response_model=ResumeParsedData)
async def parse_resume_endpoint(
    file: UploadFile = File(...),
    mime_type: str = Form(...)
):
    """Parse uploaded resume file and extract structured data."""
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]
    if mime_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF or DOCX.")
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        parsed_data = await parse_resume(tmp_path, mime_type)
        return parsed_data
    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except:
            pass


@router.post("/resume/match", response_model=ResumeMatchResult)
async def match_resume_endpoint(
    resume_data: ResumeParsedData,
    drive: DriveRequirements,
    threshold: int = 50
):
    """Match parsed resume against drive requirements."""
    result = await match_resume_to_drive(resume_data, drive, threshold)
    return result


@router.post("/interview/question", response_model=InterviewQuestion)
async def generate_question_endpoint(context: InterviewContext):
    """Generate next interview question based on context."""
    question = await generate_interview_question(context)
    return question


@router.post("/interview/evaluate", response_model=InterviewEvaluation)
async def evaluate_interview_endpoint(
    transcript: list[dict],
    resume_summary: str,
    drive: DriveRequirements
):
    """Evaluate complete interview transcript."""
    evaluation = await evaluate_interview(transcript, resume_summary, drive)
    return evaluation


@router.post("/interview/resume-summary")
async def resume_summary_endpoint(resume_data: ResumeParsedData):
    """Generate concise resume summary for interview context."""
    summary = await generate_resume_summary(resume_data.model_dump())
    return {"summary": summary}


@router.post("/roadmap/generate", response_model=list[RoadmapWeek])
async def generate_roadmap_endpoint(
    evaluation: InterviewEvaluation,
    drive: DriveRequirements,
    resume_summary: str
):
    """Generate personalized 4-week preparation roadmap."""
    roadmap = await generate_roadmap(evaluation, drive, resume_summary)
    return roadmap


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-services"}