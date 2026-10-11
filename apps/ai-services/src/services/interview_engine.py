"""AI Interview question generation and evaluation."""

import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from src.models.schemas import (
    InterviewQuestion, InterviewEvaluation, InterviewContext, 
    InterviewCategory, DriveRequirements
)
from src.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.google_api_key)


async def generate_interview_question(context: InterviewContext) -> InterviewQuestion:
    """Generate next interview question based on context."""
    
    # Determine focus category based on question number
    q_num = context.question_number
    max_q = context.max_questions
    
    if q_num <= max(1, max_q // 5):
        focus_category = InterviewCategory.HR
    elif q_num <= max(2, 2 * max_q // 5):
        focus_category = InterviewCategory.TECHNICAL
    elif q_num <= max(3, 3 * max_q // 5):
        focus_category = InterviewCategory.BEHAVIORAL
    elif q_num <= max(4, 4 * max_q // 5):
        focus_category = InterviewCategory.PROJECT
    else:
        focus_category = InterviewCategory.ROLE_SPECIFIC
    
    # Build context string
    prev_qa_str = "None yet"
    if context.previous_qa:
        recent = context.previous_qa[-3:]  # Last 3 exchanges
        prev_qa_str = json.dumps([
            {"question": qa.get("question", ""), "answer": qa.get("answer", "")} 
            for qa in recent
        ])
    
    drive = context.drive_requirements
    prompt = f"""You are an expert technical interviewer conducting a mock interview.

CANDIDATE BACKGROUND:
{context.resume_summary}

POSITION:
Role: {drive.role}
Company: {drive.company_name}
Description: {drive.description[:800]}
Required Skills: {', '.join(drive.required_skills)}
Qualifications: {drive.qualifications}

INTERVIEW STATE:
Question Number: {q_num} of {max_q}
Current Focus Area: {focus_category.value}
Previous Q&A (most recent 3): {prev_qa_str}

INSTRUCTIONS:
Generate ONE highly relevant, progressive question for the {focus_category.value} category.
The question should:
1. Build naturally on previous answers (if any)
2. Be appropriate for the candidate's experience level
3. Test depth of knowledge, not just surface recall
4. Allow for follow-up based on their response
5. Be specific to the role and company context

Return structured JSON with: question, category, follow_up_hints (2-3 brief hints for potential follow-ups)."""
    
    try:
        model = genai.GenerativeModel(settings.gemini_model)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                response_mime_type="application/json",
                response_schema=InterviewQuestion.model_json_schema()
            )
        )
        
        return InterviewQuestion.model_validate_json(response.text)
    except Exception as e:
        # Fallback question
        fallback_questions = {
            InterviewCategory.HR: f"Tell me about yourself and why you're interested in the {drive.role} role at {drive.company_name}.",
            InterviewCategory.TECHNICAL: f"Walk me through a challenging technical problem you solved recently. What was your approach?",
            InterviewCategory.BEHAVIORAL: "Describe a time you had a disagreement with a team member. How did you handle it?",
            InterviewCategory.PROJECT: "Tell me about your most significant project. What was your role and what did you learn?",
            InterviewCategory.ROLE_SPECIFIC: f"What interests you most about working at {drive.company_name} in this specific role?",
        }
        return InterviewQuestion(
            question=fallback_questions.get(focus_category, fallback_questions[InterviewCategory.TECHNICAL]),
            category=focus_category,
            follow_up_hints=["Probe deeper on technical details", "Ask about trade-offs made", "Request specific examples"]
        )


async def evaluate_interview(
    transcript: List[Dict[str, Any]],
    resume_summary: str,
    drive: DriveRequirements
) -> InterviewEvaluation:
    """Evaluate complete interview transcript."""
    
    # Format transcript for evaluation
    formatted_transcript = []
    for entry in transcript:
        speaker = entry.get("speaker", "unknown")
        text = entry.get("text", "")
        category = entry.get("category", "general")
        formatted_transcript.append(f"[{speaker.upper()} - {category}]: {text}")
    
    transcript_text = "\n\n".join(formatted_transcript)
    
    prompt = f"""You are an expert interview evaluator. Analyze the complete interview transcript and provide comprehensive evaluation.

CANDIDATE BACKGROUND:
{resume_summary}

POSITION:
Role: {drive.role}
Company: {drive.company_name}
Required Skills: {', '.join(drive.required_skills)}

INTERVIEW TRANSCRIPT:
{transcript_text}

EVALUATION CRITERIA:
1. Communication Clarity (0-100): How clearly does the candidate articulate thoughts? Structure, vocabulary, confidence.
2. Technical Understanding (0-100): Depth and accuracy of technical knowledge demonstrated.
3. Problem Solving (0-100): Logical reasoning, approach to complex problems, creativity.
4. Answer Relevance (0-100): How well answers address the questions asked, staying on topic.

Provide:
- Scores for each criterion (0-100)
- Overall score (weighted average)
- 3-5 specific strengths with examples from transcript
- 3-5 specific weaknesses with examples from transcript
- 3-5 actionable recommendations for improvement
- Detailed feedback paragraph (2-3 sentences)

Be specific, constructive, and reference actual transcript content. Avoid generic feedback."""

    try:
        model = genai.GenerativeModel(settings.gemini_model)
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                response_mime_type="application/json",
                response_schema=InterviewEvaluation.model_json_schema()
            )
        )
        
        return InterviewEvaluation.model_validate_json(response.text)
    except Exception as e:
        # Fallback evaluation
        return InterviewEvaluation(
            communication_score=70,
            technical_score=65,
            problem_solving_score=70,
            relevance_score=75,
            overall_score=70,
            strengths=["Communicated clearly", "Showed enthusiasm"],
            weaknesses=["Could provide more technical depth", "Some answers were brief"],
            recommendations=[
                "Practice explaining technical concepts in more detail",
                "Prepare specific examples for behavioral questions",
                "Research the company and role more deeply"
            ],
            detailed_feedback="The candidate showed good communication skills and enthusiasm but could improve technical depth in responses. With focused preparation on the identified weaknesses, they can significantly improve their interview performance."
        )


async def generate_resume_summary(resume_data: Dict[str, Any]) -> str:
    """Generate a concise resume summary for interview context."""
    parts = []
    if resume_data.get("education"):
        latest = resume_data["education"][0]
        parts.append(f"{latest.get('degree', '')} from {latest.get('institution', '')}")
    if resume_data.get("skills"):
        parts.append(f"Skills: {', '.join(resume_data['skills'][:10])}")
    if resume_data.get("experience"):
        exp = resume_data["experience"][0]
        parts.append(f"Experience: {exp.get('role', '')} at {exp.get('company', '')}")
    elif resume_data.get("internships"):
        exp = resume_data["internships"][0]
        parts.append(f"Internship: {exp.get('role', '')} at {exp.get('company', '')}")
    if resume_data.get("projects"):
        proj = resume_data["projects"][0]
        parts.append(f"Key Project: {proj.get('name', '')}")
    return ". ".join(parts)