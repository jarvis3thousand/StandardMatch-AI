# StandardMatch AI

AI-powered recommendation engine for applicable Indian Standards.

This prototype follows the SIH26108 concept:
Tender PDF → Requirement Extraction → Standards Search → AI Ranking → Evidence + Status → Officer Verification → Final Report.

## Prototype features

- Tender upload screen
- Requirement extraction preview
- Recommended IS Codes with confidence
- Evidence / clause view
- Current-status badges
- Human officer verification workflow
- Alternative matches
- Tender-ready report preview
- Dashboard with processing statistics
- Responsive, presentation-friendly UI

## Tech stack

Frontend:
- React
- Vite
- Lucide React icons
- Plain CSS

Backend:
- FastAPI
- Pydantic
- Mock recommendation API

## Run locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

The frontend currently uses mock data so it can be demonstrated independently. The backend contains clean API endpoints ready for connecting OCR, embeddings/vector search and a real standards knowledge base.

## GitHub upload

Upload the whole repository. Do NOT upload:
- `.venv/`
- `node_modules/`
- real/private tender PDFs
- licensed BIS standard documents unless your team has permission
- API keys/secrets

See `.gitignore`.

## Important production note

The prototype does not claim live BIS status. For production, connect only to authorized/permitted BIS metadata and sources, and retain human approval before final procurement use.
