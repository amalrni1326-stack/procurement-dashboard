from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import suppliers

app = FastAPI(
    title="Procurement Intelligence Dashboard API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suppliers.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "Procurement API is running", "version": "1.0"}
