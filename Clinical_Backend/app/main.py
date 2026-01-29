from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import engine, SessionLocal
from app.models import Base, ClinicalDocument, User
from app.file_reader import read_file
from app.nlp import analyze_text
from app.schemas import UserCreate, UserLogin
from app.auth import hash_password, verify_password
from app.jwt_config import create_access_token
from app.dependencies import get_current_user

# ------------------------
# App Initialization
# ------------------------
app = FastAPI(title="Clinical Document Analysis Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# ------------------------
# Database Dependency
# ------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------
# USER SIGN-UP
# ------------------------
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": new_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

# ------------------------
# USER LOGIN
# ------------------------
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

# ------------------------
# FILE UPLOAD (PROTECTED)
# ------------------------
@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    text = await read_file(file)
    entities = analyze_text(text)

    document = ClinicalDocument(
        filename=file.filename,
        extracted_text=text,
        entities=str(entities),
        user_id=current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": "Document processed successfully",
        "document_id": document.id,
        "filename": document.filename,
        "entities": entities
    }

# ------------------------
# FETCH USER DOCUMENTS (PROTECTED)
# ------------------------
@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ClinicalDocument).filter(
        ClinicalDocument.user_id == current_user.id
    ).all()

# ------------------------
# FETCH EXTRACTED ENTITIES (OPTION B) ✅
# ------------------------
@app.get("/api/entities")
def get_extracted_entities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(ClinicalDocument).filter(
        ClinicalDocument.user_id == current_user.id
    ).all()

    result = []
    for doc in documents:
        result.append({
            "document_id": doc.id,
            "filename": doc.filename,
            "entities": doc.entities
        })

    return result

# ------------------------
# DASHBOARD STATS (PROTECTED)
# ------------------------
@app.get("/api/dashboard/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(ClinicalDocument).filter(
        ClinicalDocument.user_id == current_user.id
    ).all()

    documents_processed = len(documents)

    entities_extracted = sum(
        len(doc.entities.split(",")) if doc.entities else 0
        for doc in documents
    )

    return {
        "documentsProcessed": documents_processed,
        "entitiesExtracted": entities_extracted,
        "accuracy": 92,          # dummy value
        "activeIntegrations": 1  # dummy value
    }

# ------------------------
# DASHBOARD LOGS (PROTECTED)
# ------------------------
@app.get("/api/dashboard/logs")
def dashboard_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = (
        db.query(ClinicalDocument)
        .filter(ClinicalDocument.user_id == current_user.id)
        .order_by(ClinicalDocument.id.desc())
        .limit(5)
        .all()
    )

    logs = []
    for doc in documents:
        logs.append({
            "id": str(doc.id),
            "message": f"Processed document: {doc.filename}",
            "status": "success",
            "timestamp": datetime.utcnow().isoformat()
        })

    return logs

# ------------------------
# QUICK ENTITY EXTRACTION (TEXT AREA)
# ------------------------
@app.post("/api/extract")
def extract_entities_from_text(
    payload: dict,
    current_user: User = Depends(get_current_user)
):
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")

    entities = analyze_text(text)

    return {
        "entities": entities
    }
