from fastapi import APIRouter

router = APIRouter(prefix="/api")

@router.get("/cameras")
async def get_cameras():
    return [
        {"id": "CAM-01", "location": "Main St"}, 
        {"id": "CAM-02", "location": "Broadway"}, 
        {"id": "CAM-04", "location": "Highway 1"}
    ]

@router.get("/cameras/{id}")
async def get_camera(id: str):
    return {"id": id, "location": "Unknown", "status": "active"}

@router.get("/vehicles")
async def get_vehicles():
    return [{"id": "V-1027", "plate": "PB10XX1234"}]

@router.get("/vehicles/{id}")
async def get_vehicle(id: str):
    return {"id": id, "plate": "PB10XX1234"}

@router.get("/vehicles/{id}/journey")
async def get_vehicle_journey(id: str):
    return [
        {"camera": "CAM-01", "time": "10:00:00"},
        {"camera": "CAM-02", "time": "10:05:00"},
        {"camera": "CAM-04", "time": "10:12:00"}
    ]

@router.get("/alerts")
async def get_alerts():
    return [{"vehicle_id": "V-1027", "message": "Vehicle flagged for suspicious routing across CAM-01, CAM-02, CAM-04", "severity": "high"}]

@router.get("/analytics")
async def get_analytics():
    return {"total_vehicles": 105, "active_alerts": 1, "cameras_online": 3}

@router.get("/trajectories/{vehicle_id}")
async def get_trajectory(vehicle_id: str):
    return {"vehicle_id": vehicle_id, "path": ["CAM-01", "CAM-02", "CAM-04"]}
