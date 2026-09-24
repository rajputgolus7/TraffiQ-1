# TraffiQ API Documentation

The TraffiQ backend exposes a comprehensive RESTful API for management and historical data, alongside WebSockets for real-time telemetry streaming.

## Base URL
`/api/v1`

## Authentication
All API endpoints (except public health checks) require a Bearer token.
`Authorization: Bearer <token>`

---

## REST Endpoints

### 1. Cameras
Manage edge node camera configurations.

*   `GET /cameras`
    *   Returns a list of all active cameras and their geospatial coordinates.
*   `POST /cameras`
    *   Register a new camera node.
    *   Payload: `{"name": "Intersection A", "lat": 12.97, "lng": 77.59, "stream_url": "rtsp://..."}`
*   `GET /cameras/{camera_id}/metrics`
    *   Returns historical traffic volume and average speed for a specific camera.

### 2. Analytics
Retrieve aggregated spatial-temporal data.

*   `GET /analytics/flow`
    *   Query Params: `start_time`, `end_time`, `interval` (e.g., '1h')
    *   Returns traffic flow volume over the specified period.
*   `GET /analytics/od-matrix`
    *   Returns the Origin-Destination matrix based on Re-ID tracks for the current day.

### 3. Alerts
Manage system alerts and ANPR flags.

*   `GET /alerts`
    *   Returns a paginated list of recent alerts (congestion, flagged plates).
*   `POST /alerts/watchlist`
    *   Add a license plate to the ANPR watchlist.

---

## WebSocket Telemetry

For real-time dashboard updates, connect to the telemetry WebSocket.

**Endpoint:** `ws://<host>/ws/telemetry`

### Subscription
Upon connecting, the client must subscribe to specific topics.

```json
{
  "action": "subscribe",
  "topics": ["live_metrics", "camera_events", "alerts"]
}
```

### Event Payloads

**Topic: `camera_events`** (Triggered when a vehicle is processed)
```json
{
  "type": "vehicle_track",
  "camera_id": "cam-001",
  "global_id": "VID-9932-A",
  "class": "truck",
  "speed_kmh": 45.2,
  "timestamp": "2026-09-24T10:15:30Z"
}
```

**Topic: `alerts`**
```json
{
  "type": "alert",
  "severity": "high",
  "message": "Watchlist plate detected: DL-1C-AA-1111",
  "camera_id": "cam-004",
  "timestamp": "2026-09-24T10:16:00Z"
}
```
