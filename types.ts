export interface ProjectInputs {
  location: string; // New field for location name
  ownerNotes?: string; // Contact info, name, phone, etc.
  plotSize: number; // m2
  plotPrice: number; // EUR
  buildingCoefficient: number; // Factor (e.g. 0.8, 1.2, 2.0) - Syntelesis Domisis
  constructionCostPerSqm: number; // EUR/m2 (hard costs)
  salePricePerSqm: number; // EUR/m2
  miscCostsPercent: number; // % (taxes, notary, permits buffer)
}

export interface CalculationResults {
  maxBuildableArea: number; // Calculated m2
  constructionCostTotal: number;
  constructionCostTotalInclPlot: number;
  costPerSqmInclPlot: number;
  revenueTotal: number;
  profitTotal: number;
  profitMargin: number; // (Profit / Revenue) * 100
  roi: number; // (Profit / Cost) * 100
  miscCostsValue: number;
}

export interface AIAnalysisState {
  loading: boolean;
  content: string | null;
  error: string | null;
}

export interface DesignState {
  originalImage: string | null; // Base64
  generatedImage: string | null; // Base64
  prompt: string;
  loading: boolean;
  error: string | null;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number; // Timestamp
  inputs: ProjectInputs;
}