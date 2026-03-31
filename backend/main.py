from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import suppliers
import os

app = FastAPI(
    title="Procurement Intelligence Dashboard API",
    version="1.0"
)

# CORS (allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(suppliers.router, prefix="/api")

# Root endpoint (basic check)
@app.get("/")
def read_root():
    return {
        "status": "Procurement API is running",
        "version": "1.0"
    }

# Health check (useful for deployment/debugging)
@app.get("/health")
def health():
    return {"status": "ok"}

# Run server (for local + fallback)
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
