"""FastAPI main application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, infer, issues, fixes
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title="Python Quality Service",
    description="AI Data Steward - Data Quality Detection and Fixing",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(infer.router, tags=["infer"])
app.include_router(issues.router, tags=["issues"])
app.include_router(fixes.router, tags=["fixes"])


@app.on_event("startup")
async def startup_event():
    """Create temp directory on startup"""
    import os

    os.makedirs(settings.quality_tmp_dir, exist_ok=True)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Python Quality Service",
        "version": "0.1.0",
        "endpoints": ["/health", "/version", "/infer", "/detect_issues", "/preview_fixes", "/apply_fixes"],
    }
