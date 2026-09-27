from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="StandardMatch AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerifyRequest(BaseModel):
    verified: bool = True
    officer: str = "Technical Officer"

MOCK_RECOMMENDATIONS = [
    {
        "code": "IS 3025 (Part 1)",
        "confidence": 94,
        "status": "Current",
        "domain": "Water testing",
        "evidence": "REQ-03: Sampling and laboratory test method"
    },
    {
        "code": "IS 10500:2012",
        "confidence": 91,
        "status": "Current",
        "domain": "Drinking water",
        "evidence": "REQ-02: Potable water parameters"
    },
    {
        "code": "IS 1622:2001",
        "confidence": 87,
        "status": "Current",
        "domain": "Microbiology",
        "evidence": "REQ-04: Microbiological examination"
    }
]

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "StandardMatch AI"}

@app.post("/api/analyze")
async def analyze_tender(file: UploadFile = File(...)):
    # Prototype endpoint. Replace this block with OCR/text extraction,
    # requirement extraction and vector search in production.
    return {
        "filename": file.filename,
        "processing_status": "complete",
        "requirements": [
            {"id": "REQ-01", "text": "Water quality testing", "priority": "High"},
            {"id": "REQ-02", "text": "Potable water parameters", "priority": "High"},
            {"id": "REQ-03", "text": "Sampling and laboratory test method", "priority": "High"},
            {"id": "REQ-04", "text": "Microbiological examination", "priority": "Medium"},
        ],
        "recommendations": MOCK_RECOMMENDATIONS,
    }

@app.get("/api/recommendations")
def recommendations():
    return {"items": MOCK_RECOMMENDATIONS}

@app.post("/api/recommendations/{code}/verify")
def verify(code: str, request: VerifyRequest):
    return {
        "code": code,
        "verified": request.verified,
        "officer": request.officer,
        "message": "Verification recorded in prototype mode."
    }

@app.get("/api/report")
def report():
    return {
        "title": "Verified Indian Standards Recommendation Report",
        "status": "prototype",
        "note": "Connect this endpoint to the authorized standards knowledge base and report generator."
    }
