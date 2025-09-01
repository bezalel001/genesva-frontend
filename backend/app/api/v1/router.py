from fastapi import APIRouter

from app.api.v1.genes import router as genes_router

api_router = APIRouter()

api_router.include_router(genes_router, prefix="/genes", tags=["genes"])


@api_router.get("/test")
def test_endpoint():
    return {"message": "API is working!"}
