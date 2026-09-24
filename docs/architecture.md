# Architecture Overview

The TraffiQ system is designed as a distributed, scalable platform capable of processing high-volume video feeds for real-time traffic analysis. 

## High-Level Pipeline

1.  **Ingestion:** Video streams from multiple RTSP cameras are ingested by Edge Nodes.
2.  **Edge Processing:** Edge nodes perform lightweight object detection (YOLO) and extract Re-ID features (OSNet).
3.  **Central Aggregation:** Extracted features and metadata are sent to the Core Engine via a Redis message broker.
4.  **Spatial-Temporal Engine:** The core engine maps vehicle trajectories, applies cross-camera tracking, and calculates traffic metrics (density, flow, speed).
5.  **Persistence & API:** Data is stored in PostgreSQL (metrics) and MongoDB (trajectories). The FastAPI backend serves this data to the frontend.

## Multi-Camera Tracking & Re-ID

Our Multi-Target Multi-Camera Tracking (MTMCT) system solves the challenge of identifying the same vehicle across non-overlapping camera views.

*   **Detection:** YOLOv11 detects vehicles and their bounding boxes.
*   **Feature Extraction:** An OSNet model extracts a robust feature vector (appearance signature) for each detected vehicle.
*   **Local Tracking:** DeepSORT maintains tracking IDs within a single camera's field of view.
*   **Global Association:** The Core Engine uses a graph-based optimization algorithm, comparing feature vectors (Cosine Similarity) alongside spatial-temporal constraints (e.g., transition time between cameras) to link local tracklets into a global vehicle trajectory.

## Automatic Number Plate Recognition (ANPR)

The ANPR module is invoked selectively to conserve computational resources:
1.  **Trigger:** ANPR is triggered when a vehicle enters a designated "Zone of Interest" (e.g., a toll booth or enforcement line) or when flagged for a specific violation.
2.  **Localization:** A specialized YOLO model detects the precise location of the license plate.
3.  **OCR:** An Optical Character Recognition model (based on LPRNet) extracts the alphanumeric text.
4.  **Fuzzy Matching:** Results are validated against a database of registered formats and known plates using fuzzy string matching to correct minor OCR errors.

## Spatial-Temporal Engine

This engine is the brain of the analytics platform:
*   **Congestion Detection:** Analyzes the density of bounding boxes in predefined regions. If density exceeds a threshold and average speed drops, an anomaly is flagged.
*   **Trajectory Prediction:** Uses historical paths (stored in MongoDB) and current trajectory data to predict short-term vehicle movement, aiding in proactive traffic signal adjustments.
*   **Origin-Destination (OD) Matrix:** By leveraging global Re-ID tracks, the engine automatically generates OD matrices, crucial for long-term city planning.
