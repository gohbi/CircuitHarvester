export interface Part {
  name: string;
  type: string;
  description: string;
  harvestability: 'High' | 'Medium' | 'Low';
  projectIdeas: string[];
  box_2d?: number[]; // [ymin, xmin, ymax, xmax] normalized to 1000
}

export interface AnalysisResult {
  deviceName: string;
  deviceFunction: string;
  estimatedAge?: string;
  parts: Part[];
  safetyWarnings: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  image: string | null; // Base64 string
}