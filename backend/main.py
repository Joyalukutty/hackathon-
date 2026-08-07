import os
import json
import traceback
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="PulseTriage Clinical Intelligence API",
    description="Multimodal Emergency Decision Support Backend"
)

# CORS enabled for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "system": "PulseTriage Clinical API"}

@app.post("/api/triage")
async def run_triage(
    vitals_json: str = Form(...),
    audio_file: UploadFile = File(None),
    image_file: UploadFile = File(None)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing from .env file")

    try:
        # Parse vitals input
        try:
            vitals_data = json.loads(vitals_json)
        except Exception:
            vitals_data = {"symptoms_or_vitals": vitals_json}

        model = genai.GenerativeModel("gemini-3.5-flash-lite")

        prompt = f"""
        You are an expert Emergency Medicine Clinical Decision Support System.
        Analyze this patient data and calculate real-time triage priority.

        PATIENT TELEMETRY:
        {json.dumps(vitals_data, indent=2)}

        Provide strict JSON output matching this schema:
        {{
          "patient_id": "{vitals_data.get('patient_id', 'PT-001')}",
          "esi_level": 1,
          "triage_category": "Immediate / Emergent / Urgent / Less Urgent / Non-Urgent",
          "triage_color": "RED / YELLOW / GREEN",
          "confidence_score": 0.95,
          "extracted_symptoms": ["chest pain", "shortness of breath"],
          "image_ocr_findings": "Summary of image/prescription if provided",
          "differential_diagnosis": [
            {{"condition": "Acute Coronary Syndrome", "probability": "85%"}}
          ],
          "clinical_reasoning_trace": [
            "Tachycardia noted with heart rate at 145 bpm",
            "Oxygen saturation critical at 88%"
          ],
          "counterfactual_analysis": "If SpO2 improves above 94%, ESI level de-escalates to Level 3."
        }}
        """

        content_inputs = [prompt]

        # Safely handle audio file upload
        if audio_file and audio_file.filename:
            audio_bytes = await audio_file.read()
            if len(audio_bytes) > 0:
                content_inputs.append({"mime_type": audio_file.content_type or "audio/mp3", "data": audio_bytes})

        # Safely handle image file upload
        if image_file and image_file.filename:
            image_bytes = await image_file.read()
            if len(image_bytes) > 0:
                content_inputs.append({"mime_type": image_file.content_type or "image/jpeg", "data": image_bytes})

        # Call Gemini API with JSON enforce mode
        response = model.generate_content(
            content_inputs,
            generation_config={"response_mime_type": "application/json"}
        )

        return json.loads(response.text)

    except Exception as e:
        print("\n--- ERROR IN TRIAGE ENDPOINT ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))