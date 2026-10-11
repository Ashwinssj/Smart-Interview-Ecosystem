"""Resume parsing using Google Gemini structured extraction."""

import json
import pdfplumber
import docx
from typing import Optional
import google.generativeai as genai
from src.models.schemas import ResumeParsedData
from src.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.google_api_key)
model = genai.GenerativeModel(settings.gemini_model)


async def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    return text


async def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file."""
    try:
        doc = docx.Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        raise ValueError(f"Failed to extract text from DOCX: {str(e)}")
    return text


async def parse_resume(file_path: str, mime_type: str) -> ResumeParsedData:
    """Parse resume file and extract structured data."""
    
    # Extract text based on file type
    if mime_type == "application/pdf":
        text = await extract_text_from_pdf(file_path)
    elif mime_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]:
        text = await extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {mime_type}")
    
    if not text.strip():
        raise ValueError("No text content found in resume")
    
    # Truncate if too long
    text = text[:15000]
    
    # Use Gemini for structured extraction
    system_prompt = """You are an expert resume parser. Extract structured information from the resume text.
    Return JSON matching the exact schema provided. Be thorough but accurate.
    If information is missing or unclear, use empty arrays or null values.
    For skills, extract technical skills only (programming languages, frameworks, tools, cloud platforms, databases).
    For keywords, extract important technical terms, methodologies, and domain-specific words."""
    
    try:
        response = await model.generate_content_async(
            f"{system_prompt}\n\nResume text:\n{text}",
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=ResumeParsedData.model_json_schema()
            )
        )
        
        parsed_data = ResumeParsedData.model_validate_json(response.text)
        return parsed_data
    except Exception as e:
        raise ValueError(f"Failed to parse resume with AI: {str(e)}")