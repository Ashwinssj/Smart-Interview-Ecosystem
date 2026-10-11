"""Resume-JD semantic matching using embeddings + keyword overlap."""

import numpy as np
import google.generativeai as genai
from typing import List, Dict, Any
import asyncio
from src.models.schemas import ResumeParsedData, DriveRequirements, ResumeMatchResult
from src.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.google_api_key)


async def get_embedding(text: str) -> List[float]:
    """Get embedding for text using Google Gemini."""
    try:
        result = genai.embed_content(
            model=settings.gemini_embedding_model,
            content=text[:8000],  # Truncate if needed
            task_type="SEMANTIC_SIMILARITY"
        )
        return result['embedding']
    except Exception as e:
        raise ValueError(f"Failed to get embedding: {str(e)}")


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a_arr, b_arr = np.array(a), np.array(b)
    if np.linalg.norm(a_arr) == 0 or np.linalg.norm(b_arr) == 0:
        return 0.0
    return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))


async def generate_recommendations(missing_skills: List[str], drive: DriveRequirements) -> List[str]:
    """Generate actionable recommendations for missing skills."""
    if not missing_skills:
        return ["Your profile matches well. Focus on interview preparation and company research."]
    
    prompt = f"""Given missing skills: {missing_skills[:10]} for a {drive.role} role at {drive.company_name}.
    Required skills: {drive.required_skills}
    Job description: {drive.description[:500]}
    
    Provide 3-5 specific, actionable recommendations for improvement. Each should be a single sentence."""
    
    try:
        model = genai.GenerativeModel(settings.gemini_model)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=300,
            )
        )
        
        content = response.text or ""
        recommendations = [line.strip("- •\t") for line in content.split("\n") if line.strip()]
        return recommendations[:5]
    except Exception:
        return [
            f"Focus on learning {', '.join(missing_skills[:3])} through online courses",
            "Build projects demonstrating these skills",
            "Practice explaining these concepts in interview settings"
        ]


async def match_resume_to_drive(
    resume_data: ResumeParsedData,
    drive: DriveRequirements,
    threshold: int = 50
) -> ResumeMatchResult:
    """Match resume to drive requirements using semantic + keyword matching."""
    
    # Prepare resume text for embedding
    resume_skills = resume_data.skills
    resume_text_parts = [
        f"Skills: {', '.join(resume_skills)}",
        f"Projects: {', '.join([p.name + ': ' + p.description for p in resume_data.projects])}",
        f"Experience: {', '.join([e.role + ' at ' + e.company for e in resume_data.experience])}",
        f"Internships: {', '.join([i.role + ' at ' + i.company for i in resume_data.internships])}",
        f"Keywords: {', '.join(resume_data.keywords)}",
        f"Education: {', '.join([e.degree + ' from ' + e.institution for e in resume_data.education])}",
    ]
    resume_text = "\n".join(resume_text_parts)
    
    # Prepare drive text for embedding
    drive_text = f"""
    Role: {drive.role}
    Company: {drive.company_name}
    Description: {drive.description}
    Required Skills: {', '.join(drive.required_skills)}
    Qualifications: {drive.qualifications}
    """
    
    # Get embeddings in parallel
    resume_emb, drive_emb = await asyncio.gather(
        get_embedding(resume_text),
        get_embedding(drive_text)
    )
    
    # Semantic similarity score (0-100)
    semantic_score = cosine_similarity(resume_emb, drive_emb) * 100
    
    # Keyword/skill overlap
    resume_skills_lower = set(s.lower().strip() for s in resume_skills)
    resume_keywords_lower = set(k.lower().strip() for k in resume_data.keywords)
    required_skills_lower = set(s.lower().strip() for s in drive.required_skills)
    
    # Skill match
    matched_skills = resume_skills_lower & required_skills_lower
    skill_match_score = (len(matched_skills) / max(len(required_skills_lower), 1)) * 100
    
    # Keyword match (keywords in resume that match required skills)
    matched_keywords = resume_keywords_lower & required_skills_lower
    keyword_match_score = (len(matched_keywords) / max(len(required_skills_lower), 1)) * 100
    
    # Missing skills/keywords
    missing_skills = list(required_skills_lower - resume_skills_lower)
    missing_keywords = list(required_skills_lower - resume_keywords_lower)
    
    # Weighted overall score: 50% semantic, 30% skill match, 20% keyword match
    overall = 0.5 * semantic_score + 0.3 * skill_match_score + 0.2 * keyword_match_score
    
    # Generate recommendations
    recommendations = await generate_recommendations(missing_skills, drive)
    
    return ResumeMatchResult(
        overall_score=round(overall),
        skill_match_score=round(skill_match_score),
        keyword_match_score=round(keyword_match_score),
        missing_skills=missing_skills[:10],
        missing_keywords=missing_keywords[:10],
        recommendations=recommendations,
        passed=overall >= threshold
    )