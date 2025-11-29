import { AnalysisResult } from '../types';

// Schema for the Training Data
// This matches the format we would want to store in a NoSQL database (like MongoDB or Firestore)
// for training future computer vision models.
interface TrainingDataEntry {
  imageId: string;
  timestamp: string;
  metadata: {
    userAgent: string;
    platform: string;
  };
  annotations: {
    label: string; // The part name
    category: string; // The part type
    boundingBox: number[]; // [ymin, xmin, ymax, xmax] 0-1000
    description: string;
  }[];
  rawImageBase64: string; // In production, this would likely be an S3/GCS URL after upload
}

/**
 * Uploads the analyzed image and results to a backend for training.
 * 
 * NOTE: Since we do not have a live backend, this function simulates the upload.
 * To implement the backend, create an endpoint (e.g., POST /api/training-data)
 * that accepts this JSON payload and saves it to a database.
 */
export const uploadTrainingData = async (image: string, result: AnalysisResult): Promise<void> => {
  const trainingPayload: TrainingDataEntry = {
    imageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    metadata: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    },
    rawImageBase64: image,
    annotations: result.parts.map(part => ({
      label: part.name,
      category: part.type,
      description: part.description,
      boundingBox: part.box_2d || [0, 0, 0, 0],
    }))
  };

  console.log("☁️ [Training Agent] Preparing to upload data for training...");
  
  // SIMULATION: In a real app, this would be:
  // await fetch('https://api.your-backend.com/v1/training-data', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(trainingPayload)
  // });

  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ [Training Agent] Data successfully uploaded. Image ID:", trainingPayload.imageId);
      console.log("   Payload size:", JSON.stringify(trainingPayload).length, "bytes");
      resolve();
    }, 1500);
  });
};
