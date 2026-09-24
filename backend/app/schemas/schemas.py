from pydantic import BaseModel

class VehicleDetection(BaseModel):
    camera_id: str
    vehicle_id: str
    plate: str
    action: str
