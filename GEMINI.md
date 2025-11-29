# CircuitHarvester Backend & AI Research Architecture

This document outlines the technical architecture required to implement the backend services, data persistence, and AI training pipeline for the CircuitHarvester application.

---

## 1. System Overview

The system consists of three main components:
1.  **Client (React PWA)**: Captures images, uses Gemini API for initial labeling, and submits data to the backend.
2.  **API Server (Backend)**: Authentication, data validation, storage management, and data set aggregation.
3.  **Research Engine (AI)**: Automated pipeline to train custom computer vision models (e.g., YOLOv8) using the harvested images.

---

## 2. Backend Implementation Guide

We recommend using **Python (FastAPI)** for the backend due to its native support for AI/ML libraries, or **Node.js (Express/NestJS)** if keeping a full JS stack is preferred.

### Recommended Stack
*   **Language**: Python 3.10+ (FastAPI)
*   **Database**: PostgreSQL (Metadata & Relational Data) + MongoDB (Flexible JSON Storage for Annotations)
*   **Object Storage**: AWS S3 or Google Cloud Storage (for raw images)
*   **Vector DB (Optional)**: Pinecone or Milvus (for visual similarity search)

### API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | User authentication |
| `POST` | `/api/v1/submissions` | Upload new image + Gemini analysis result |
| `GET` | `/api/v1/submissions` | List user's past scans |
| `PATCH` | `/api/v1/submissions/{id}` | Update labels (Human-in-the-loop correction) |
| `POST` | `/api/v1/research/export` | Export dataset for training (COCO/YOLO format) |

---

## 3. Database Schema

### A. Users Table (PostgreSQL)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### B. Submissions Table (PostgreSQL)
```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    image_url TEXT NOT NULL,
    device_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'unverified', -- unverified, verified, training_ready
    created_at TIMESTAMP DEFAULT NOW()
);
```

### C. Annotations Collection (MongoDB / JSONB in Postgres)
Stores the bounding boxes and Gemini-generated metadata.
```json
{
  "submission_id": "uuid-string",
  "gemini_prompt_version": "v1.2",
  "parts": [
    {
      "label": "555 Timer IC",
      "category": "Integrated Circuit",
      "bbox_normalized": [100, 200, 150, 250], // [ymin, xmin, ymax, xmax]
      "confidence_score": 0.95
    }
  ]
}
```

---

## 4. AI Training Pipeline

To transition from general Gemini analysis to a specialized, low-latency computer vision model, follow this pipeline:

### Step 1: Data Ingestion (The "Harvest")
*   The React app uploads the image (`base64` -> `S3`) and the Gemini JSON result (`Database`).
*   **Action**: `uploadTrainingData` function in `services/trainingService.ts` needs to point to the real API.

### Step 2: Verification (Human-in-the-Loop)
*   Before training, data must be cleaned.
*   **Tool**: Build a simple admin dashboard (or use tools like Label Studio).
*   **Process**:
    1.  Fetch "unverified" submissions.
    2.  Display image with Gemini's bounding boxes overlay.
    3.  Human expert corrects boxes or labels.
    4.  Mark submission as `training_ready`.

### Step 3: Dataset Conversion
Convert the stored data into standard formats (YOLO or COCO).

**Python Script Example (YOLO Format):**
```python
def export_for_yolo(submission):
    # YOLO format: <class_id> <x_center> <y_center> <width> <height>
    img_width, img_height = get_image_dims(submission.image_url)
    
    with open(f"{submission.id}.txt", "w") as f:
        for part in submission.annotations:
            # Convert [ymin, xmin, ymax, xmax] (0-1000) to YOLO normalized center/width
            y_min, x_min, y_max, x_max = part['bbox']
            
            w = (x_max - x_min) / 1000.0
            h = (y_max - y_min) / 1000.0
            x_center = (x_min / 1000.0) + (w / 2)
            y_center = (y_min / 1000.0) + (h / 2)
            
            class_id = class_map[part['label']]
            f.write(f"{class_id} {x_center} {y_center} {w} {h}\n")
```

### Step 4: Model Training (The "Research Agent")
We recommend training a **YOLOv8** or **YOLOv11** model for real-time object detection on mobile devices.

**Training Command (using Ultralytics):**
```bash
yolo task=detect mode=train model=yolov8n.pt data=custom_circuit_data.yaml epochs=100 imgsz=640
```

### Step 5: Inference Deployment
Once trained, the model can be deployed back to the app in two ways:
1.  **Server-side**: Python API runs the model (High accuracy, network latency).
2.  **Client-side (Edge)**: Export model to ONNX or TensorFlow.js and run directly in the browser.

---

## 5. Security & Privacy
*   **Data Scrubbing**: Automatically blur text that looks like PII (names, addresses on shipping labels) before saving to the public dataset.
*   **License**: Ensure uploaded images are flagged with a Creative Commons license (e.g., CC-BY-SA) to allow open research usage.
