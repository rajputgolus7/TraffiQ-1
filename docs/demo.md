# TraffiQ Demo Mode

This document outlines how to run TraffiQ in a controlled "Demo Mode". This is specifically designed for the Smart India Hackathon final presentation, ensuring a flawless, high-performance demonstration without reliance on live external camera feeds.

## What is Demo Mode?

Demo mode uses pre-recorded video sequences and pre-computed metadata to simulate a live, multi-camera environment. It allows presenters to showcase:
*   Cross-camera tracking (Re-ID) in action.
*   Dashboard responsiveness under high-load simulations.
*   ANPR trigger events and alerts.
*   Historical analytics visualizations.

## Setup Instructions

1.  **Download Demo Dataset:**
    Download the `sih_demo_dataset.zip` (link provided internally to the team) and extract it into the `traffiq/backend/data/` directory.
    ```bash
    mkdir -p backend/data
    unzip sih_demo_dataset.zip -d backend/data/
    ```

2.  **Configure Environment:**
    Ensure your `.env` file has the demo flag enabled:
    ```env
    DEMO_MODE=True
    DEMO_DATA_PATH=./data/sih_demo_dataset
    ```

3.  **Initialize Demo Database:**
    Run the seeding script to populate the database with historical demo data (simulating past weeks of traffic for the analytics dashboard).
    ```bash
    docker-compose exec backend python scripts/seed_demo_data.py
    ```

4.  **Run the System:**
    Start the system normally using Docker Compose. The backend will detect `DEMO_MODE=True` and start streaming the pre-recorded video files via internal simulated RTSP streams.
    ```bash
    docker-compose up -d
    ```

## Presenter Script / Flow

1.  **Overview Dashboard:** Show the live city map with simulated camera markers and overall health metrics.
2.  **Camera View (Node 1):** Click on Camera 1. Point out the bounding boxes, local tracking IDs, and vehicle classification (Car, Truck, Bus).
3.  **Cross-Camera Re-ID (The "Wow" Factor):** Highlight a specific vehicle in Camera 1. Switch to Camera 2 and show the system successfully maintaining the same Global ID as the vehicle enters the new frame.
4.  **Analytics & Insights:** Navigate to the analytics tab. Show the Origin-Destination matrix and the congestion heatmaps generated from the seeded data.
5.  **Alerts (ANPR):** Trigger the simulated "Stolen Vehicle Alert" from the admin panel to demonstrate real-time notifications and ANPR accuracy on the dashboard.
