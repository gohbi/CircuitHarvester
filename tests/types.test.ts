import { describe, it, expect } from 'vitest';
import type { Part, AnalysisResult, AnalysisState } from '../types';

describe('Type Definitions', () => {
  it('should allow creating a valid Part object', () => {
    const part: Part = {
      name: 'Test Component',
      type: 'Microcontroller',
      description: 'A test microcontroller',
      harvestability: 'High',
      projectIdeas: ['Robot brain', 'IoT sensor'],
      box_2d: [100, 100, 200, 200]
    };

    expect(part.name).toBe('Test Component');
    expect(part.harvestability).toBe('High');
    expect(part.box_2d).toEqual([100, 100, 200, 200]);
  });

  it('should allow Part without optional box_2d', () => {
    const part: Part = {
      name: 'Unknown Component',
      type: 'Passive',
      description: 'No location data',
      harvestability: 'Low',
      projectIdeas: []
    };

    expect(part.box_2d).toBeUndefined();
  });

  it('should only allow valid harvestability values', () => {
    const highPart: Part = {
      name: 'High',
      type: 'Type',
      description: 'Desc',
      harvestability: 'High',
      projectIdeas: []
    };
    
    const mediumPart: Part = {
      name: 'Medium',
      type: 'Type',
      description: 'Desc',
      harvestability: 'Medium',
      projectIdeas: []
    };
    
    const lowPart: Part = {
      name: 'Low',
      type: 'Type',
      description: 'Desc',
      harvestability: 'Low',
      projectIdeas: []
    };

    expect(highPart.harvestability).toBe('High');
    expect(mediumPart.harvestability).toBe('Medium');
    expect(lowPart.harvestability).toBe('Low');
  });

  it('should allow creating a valid AnalysisResult', () => {
    const result: AnalysisResult = {
      deviceName: 'Test Router',
      deviceFunction: 'Networking device',
      estimatedAge: 'Early 2000s',
      safetyWarnings: ['Disconnect power before opening'],
      parts: [
        {
          name: 'CPU',
          type: 'Processor',
          description: 'Main processor',
          harvestability: 'Medium',
          projectIdeas: ['Home automation']
        }
      ]
    };

    expect(result.deviceName).toBe('Test Router');
    expect(result.parts.length).toBe(1);
    expect(result.safetyWarnings.length).toBe(1);
  });

  it('should allow AnalysisResult without optional estimatedAge', () => {
    const result: AnalysisResult = {
      deviceName: 'Unknown Device',
      deviceFunction: 'Unknown function',
      safetyWarnings: [],
      parts: []
    };

    expect(result.estimatedAge).toBeUndefined();
  });

  it('should allow creating a valid AnalysisState', () => {
    const loadingState: AnalysisState = {
      isLoading: true,
      error: null,
      result: null,
      image: null
    };

    const completedState: AnalysisState = {
      isLoading: false,
      error: null,
      result: {
        deviceName: 'Test',
        deviceFunction: 'Test',
        safetyWarnings: [],
        parts: []
      },
      image: 'data:image/jpeg;base64,test'
    };

    const errorState: AnalysisState = {
      isLoading: false,
      error: 'Something went wrong',
      result: null,
      image: null
    };

    expect(loadingState.isLoading).toBe(true);
    expect(completedState.result).not.toBeNull();
    expect(errorState.error).toBe('Something went wrong');
  });
});
