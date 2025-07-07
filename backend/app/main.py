from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, searches
from app.database import init_db

app = FastAPI(
    title="Title Search Portal API",
    description="API for managing title search status",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database


@app.on_event("startup")
async def startup_event():
    await init_db()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(searches.router, prefix="/searches", tags=["searches"])


@app.get("/")
async def root():
    return {"message": "Title Search Portal API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
