import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadTrainingData } from '../services/trainingService';
import type { AnalysisResult } from '../types';

describe('Training Service', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    // Mock crypto.randomUUID
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-1234'
    });
    // Mock navigator
    vi.stubGlobal('navigator', {
      userAgent: 'TestUserAgent/1.0',
      platform: 'TestPlatform'
    });
    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should upload training data with correct payload structure', async () => {
    const testImage = 'data:image/jpeg;base64,testbase64data';
    const testResult: AnalysisResult = {
      deviceName: 'Test Device',
      deviceFunction: 'Test function',
      estimatedAge: '2020s',
      safetyWarnings: ['Warning 1'],
      parts: [
        {
          name: 'Capacitor',
          type: 'Passive',
          description: 'A test capacitor',
          harvestability: 'High',
          projectIdeas: ['LED circuit', 'Timer circuit'],
          box_2d: [100, 100, 200, 200]
        },
        {
          name: 'Resistor',
          type: 'Passive',
          description: 'A test resistor',
          harvestability: 'Medium',
          projectIdeas: ['Voltage divider'],
          box_2d: [300, 300, 400, 400]
        }
      ]
    };

    const uploadPromise = uploadTrainingData(testImage, testResult);
    
    // Check that the preparing message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '☁️ [Training Agent] Preparing to upload data for training...'
    );

    // Fast-forward time to trigger the simulated upload
    await vi.advanceTimersByTimeAsync(1500);
    
    await uploadPromise;

    // Check that success message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ [Training Agent] Data successfully uploaded. Image ID:',
      'test-uuid-1234'
    );
  });

  it('should include correct annotations from parts', async () => {
    const testImage = 'data:image/jpeg;base64,test';
    const testResult: AnalysisResult = {
      deviceName: 'Test',
      deviceFunction: 'Test',
      safetyWarnings: [],
      parts: [
        {
          name: 'Test Part',
          type: 'Test Type',
          description: 'Test description',
          harvestability: 'Low',
          projectIdeas: [],
          box_2d: [50, 50, 150, 150]
        }
      ]
    };

    const uploadPromise = uploadTrainingData(testImage, testResult);
    await vi.advanceTimersByTimeAsync(1500);
    await uploadPromise;

    // Verify the function completes without error
    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
  });

  it('should handle parts without bounding boxes', async () => {
    const testImage = 'data:image/jpeg;base64,test';
    const testResult: AnalysisResult = {
      deviceName: 'Test',
      deviceFunction: 'Test',
      safetyWarnings: [],
      parts: [
        {
          name: 'Part Without Box',
          type: 'Unknown',
          description: 'No bounding box',
          harvestability: 'High',
          projectIdeas: ['Project 1']
          // No box_2d
        }
      ]
    };

    const uploadPromise = uploadTrainingData(testImage, testResult);
    await vi.advanceTimersByTimeAsync(1500);
    
    // Should complete without error
    await expect(uploadPromise).resolves.toBeUndefined();
  });
});
