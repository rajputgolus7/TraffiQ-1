# TraffiQ — City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking and Urban Traffic Analytics

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH_2026-Problem_Statement_26127-orange.svg)](https://sih.gov.in)
[![Prototype Status](https://img.shields.io/badge/Prototype_Grade-Demonstration_Ready-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **"One Vehicle. Multiple Cameras. One Continuous Journey."**

---

## 📌 Project Overview & SIH Problem Statement

**TraffiQ** is an intelligent city-wide traffic surveillance and trajectory tracking platform built for **Smart India Hackathon 2026** under **Problem Statement 26127**. 

Modern urban environments deploy thousands of non-overlapping CCTV cameras across roads, junctions, and flyovers. Today, law enforcement and municipal authorities struggle with manual camera-by-camera footage reviews to track suspicious vehicles or analyze traffic bottlenecks. TraffiQ solves this by delivering an automated, spatial-temporal cross-camera tracking engine that correlates vehicle detections, Automatic Number Plate Recognition (ANPR), and visual appearance re-identification (Re-ID) into a single continuous journey across the city grid.

> ⚠️ **PROTOTYPE CLARIFICATION (SIH 2026 EVALUATION)**  
> This repository contains a **demonstration-grade prototype** engineered specifically for hackathon evaluation and technical validation. It models the complete architectural topology, REST APIs, WebSocket streaming protocols, and UI command center.  
> - **Demonstration Components**: Deterministic scenario simulation engine (`data/demo/demo-scenario.json`), localized mock video feeds, and controlled spatial-temporal graph verification.  
> - **Future Production Implementation**: Direct RTSP camera ingest pipelines, distributed edge inference workers running YOLOv11/ByteTrack, and deep visual embedding extractors (OSNet / FastReID) backed by PostGIS.

---

## 🚀 Key Features

1. **Multi-Camera Operations Grid**:
   - Simultaneous real-time monitoring across city surveillance nodes (`CAM-01`, `CAM-02`, `CAM-03`, `CAM-04`).
   - Dynamic telemetry per camera: live FPS, vehicle counts, active tracking IDs, and timestamps.
2. **Vehicle Detection & Tracking**:
   - Detection classes: `Car`, `Truck`, `Bus`, `Motorcycle`.
   - Local multi-object tracking (MOT) assigning persistent track IDs within individual camera fields of view.
3. **Automatic Number Plate Recognition (ANPR)**:
   - High-confidence OCR extraction pipeline (e.g. `PB10XX1234` @ 94% confidence) with normalization.
4. **Cross-Camera Re-Identification (Re-ID)**:
   - Modular association engine matching visual appearance features, vehicle class, color, and plate data across non-overlapping views.
5. **Spatial-Temporal Engine & Camera Graph**:
   - Trajectory verification utilizing road graph constraints, timestamps, estimated travel duration, and velocity bounds.
6. **Interactive Vehicle Journey Reconstruction**:
   - Detailed timeline history and route visualization on an interactive city map.
7. **Live Alert & Event Dispatcher**:
   - Real-time notification engine flagging priority watchlist vehicles, unusual route transitions, and congestion.
8. **Urban Traffic Analytics**:
   - Hourly volume histograms, vehicle classification distributions, and average intersection speed metrics.
9. **Jury / Presentation Demo Mode (`/demo`)**:
   - Streamlined, distraction-free interface built for 3–5 minute video presentations.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Recharts, Lucide React, Axios |
| **Backend** | Python 3.12, FastAPI, WebSockets, Uvicorn, Pydantic v2 |
| **Computer Vision (Pipeline Spec)** | YOLO (Detection), ByteTrack / BoT-SORT (Tracking), PaddleOCR (ANPR), OSNet/Appearance Embeddings (Re-ID) |
| **Data Layer** | SQLite & JSON Data Stores (Engineered with ORM abstractions for future PostgreSQL / PostGIS migration) |
| **Video Simulation** | Synthetic video rendering & deterministic event replay engine |

---

## 📁 Folder Structure

```text
traffiq/
├── ai/                      # AI model training scripts, export routines & utilities
├── backend/                 # FastAPI REST and WebSocket server
│   ├── app/
│   │   ├── api/             # REST endpoints (/api/cameras, /api/vehicles, /api/alerts)
│   │   ├── database/        # Database session and connection handlers
│   │   ├── models/          # Data entity models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # Modular service layer (anpr, reid, tracking, alert, etc.)
│   │   └── utils/           # Helper functions and logger utilities
│   ├── main.py              # Application entrypoint & WebSocket broadcaster
│   └── requirements.txt     # Python backend dependencies
├── configs/                 # Camera topologies, road graph configs & model weights config
├── data/                    # Datasets & demonstration scenarios
│   └── demo/
│       └── demo-scenario.json # Deterministic vehicle journey simulation data
├── demo/                    # Assets, media & scripts for jury demonstrations
├── docs/                    # Technical documentation
│   ├── api.md               # API & WebSocket specifications
│   ├── architecture.md      # Detailed system architecture & pipeline breakdown
│   └── demo.md              # Demonstration script & evaluation guide
├── frontend/                # React + Vite + TypeScript dashboard
│   ├── src/
│   │   ├── components/      # UI widgets (CameraCard, LiveEvents, MapAnalytics, SystemStatus)
│   │   ├── pages/           # CommandCenter, VehicleJourney, DemoMode
│   │   ├── services/        # API client and WebSocket service
│   │   └── types/           # TypeScript interface definitions
│   ├── package.json         # Frontend package configuration
│   └── vite.config.ts       # Vite config with reverse-proxy integration
├── models/                  # Checkpoint weight storage directories (.gitignore filtered)
├── scripts/                 # Utility automation & testing scripts
├── start.sh                 # One-click startup script for local launch
├── README.md                # Project documentation
├── .env.example             # Environment variable template
└── .gitignore               # Strict git exclusion rules
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
- **Python**: 3.11 or 3.12 (Recommended)
- **Node.js**: v18+ or v20+ with `npm`
- **Git**

### Method 1: One-Click Startup (Recommended)

From the project root:
```bash
chmod +x start.sh
./start.sh
```

---

### Method 2: Manual Terminal Setup

#### Terminal 1 — Backend (FastAPI)
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 — Frontend (React + Vite)
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server on port 5173
npm run dev -- --host 0.0.0.0
```

---

## 🌐 URLs & Access Points

| Component | URL | Notes |
| :--- | :--- | :--- |
| **Command Center Dashboard** | [http://localhost:5173](http://localhost:5173) | Full operational control room |
| **SIH Presentation Demo Mode** | [http://localhost:5173/demo](http://localhost:5173/demo) | Streamlined presentation view |
| **Backend REST API** | [http://localhost:8000/api/cameras](http://localhost:8000/api/cameras) | Swagger documentation at `/docs` |
| **Real-Time WebSocket Feed** | `ws://localhost:8000/ws/live` | Telemetry & event stream |

---

## 🎬 Step-by-Step Demonstration Flow

The prototype includes a deterministic demonstration loop:
1. **Camera Stream Activation**: `CAM-01`, `CAM-02`, and `CAM-04` initialize and begin streaming telemetry.
2. **Vehicle Entry & Detection**: Vehicle `V-1027` (Sedan) enters `CAM-01` field of view with an active bounding box overlay.
3. **ANPR Identification**: License plate `PB10XX1234` is recognized with 94% confidence.
4. **Camera Departure**: Vehicle leaves `CAM-01`.
5. **Cross-Camera Association**: After an elapsed transit time matching the road graph, `V-1027` appears on `CAM-02`. The Re-ID engine computes a 94% match confidence.
6. **Trajectory Reconstruction**: MapLibre renders the reconstructed spatial route connecting `CAM-01` → `CAM-02`.
7. **Destination & Alert Trigger**: `V-1027` reaches `CAM-04`, triggering a high-priority watchlist alert for route anomaly.
8. **Analytics Update**: City-wide vehicle throughput and congestion indices update dynamically.

---

## 📊 Dataset & Video Attribution

The prototype design and planned deep model training pipelines reference standard public benchmark datasets:
- **CityFlowV2 / AI City Challenge**: Multi-target multi-camera vehicle tracking and spatial-temporal constraints.
- **VeRi-776 & VehicleID**: Large-scale vehicle Re-Identification feature extraction.
- **CCPD & Indian License Plate Benchmarks**: Character segmentation and recognition under challenging illumination.

---

## 🔮 Future Scope & Production Roadmap

- [ ] **Distributed Edge Nodes**: Deploy TensorRT-accelerated YOLO models on NVIDIA Jetson edge gateways at intersections.
- [ ] **PostGIS Spatial Queries**: Replace mock road nodes with real OpenStreetMap road network topologies.
- [ ] **Scalable Message Queue**: Ingest millions of telemetry pings using Apache Kafka or RabbitMQ.
- [ ] **Automated Incident Response**: Direct webhook dispatch to traffic police dispatch and emergency services.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
