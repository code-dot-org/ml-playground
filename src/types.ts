export interface ResultsData {
  examples: any[][];
  labels: any[];
  predictedLabels: any[];
}

export interface CategoricalColumnDetails {
  id: string;
  uniqueOptions: Record<string, string>;
  frequencies: Record<string, number>;
}

export interface NumericalColumnDetails {
  id: string;
  extrema?: { min: number; max: number; range: number };
  containsOnlyNumbers: boolean;
}

export interface CurrentColumnInspector {
  id: string;
  readOnly: boolean;
  dataType: string;
  description: string;
  isSelectable: boolean;
}

export interface CrossTabResult {
  featureValues: any[];
  labelCounts: Record<string, number>;
  labelPercents?: Record<string, number>;
}

export interface CrossTabData {
  results: CrossTabResult[];
  uniqueLabelValues: string[];
  featureNames: string[];
  labelName: string;
}

export interface Coordinate {
  x: any;
  y: any;
}

export interface ScatterPlotData {
  label: string;
  feature: string;
  coordinates: Coordinate[];
}

export interface MetadataContext {
  createdBy?: string;
  potentialMisuses?: string;
  potentialUses?: string;
}

export interface MetadataCard {
  description?: string;
  context?: MetadataContext;
  lastUpdated?: string;
  source?: string;
}

export interface MetadataField {
  id?: string;
  description?: string;
  type?: "numerical" | "categorical";
}

export interface Metadata {
  name?: string;
  card?: MetadataCard;
  defaultLabelColumn?: string;
  fields?: MetadataField[];
}

export interface KNNTrainedModelDetails {
  model: any;
  predictedLabels: any[];
  kValue: number;
}

export interface TrainedModelDetails {
  name?: string;
  potentialMisuses?: string;
  potentialUses?: string;
}

export interface ModelCardColumn {
  id?: string;
  description?: string;
  min?: number;
  max?: number;
  values?: string[];
}

export interface DatasetDetails {
  name?: string;
  description?: string;
  isUserUploaded: boolean;
  numRows: number;
  potentialUses?: string;
  potentialMisuses?: string;
}
