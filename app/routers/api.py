from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/stats")
async def get_stats():
    return {
        "projects": "500+",
        "clients": "300+",
        "categories": "12+",
        "satisfaction": "99%"
    }

@router.get("/services")
async def get_services():
    return [
        {"id": 1, "title": "IT Infrastructure & Networking", "icon": "network-wired"},
        {"id": 2, "title": "Server, Storage & Data Management", "icon": "server"},
        {"id": 3, "title": "Security & Surveillance", "icon": "shield"},
        {"id": 4, "title": "System & Software Solutions", "icon": "laptop"},
        {"id": 5, "title": "Web & Cloud Services", "icon": "cloud"},
        {"id": 6, "title": "IT Consultancy & Training", "icon": "graduation-cap"},
    ]
