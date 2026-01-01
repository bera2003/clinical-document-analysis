from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal
from app.models import Base, ClinicalDocument, User
from app.file_reader import read_file
from app.nlp import analyze_text
from app.schemas import UserCreate, UserResponse, UserLogin
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
# USER SIGN-UP API
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

    # 🔐 Create JWT token
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
# USER LOGIN API (JWT)
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
# FILE UPLOAD API (PROTECTED)
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
        "message": "Document processed and saved successfully",
        "document_id": document.id,
        "filename": document.filename,
        "entities": entities
    }

# ------------------------
# FETCH DOCUMENTS (PROTECTED)
# ------------------------
@app.get("/documents")
def get_all_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(ClinicalDocument).filter(
        ClinicalDocument.user_id == current_user.id
    ).all()
    return documents
