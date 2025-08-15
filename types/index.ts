import { z } from 'zod'

// Core data types
export interface DataField {
  name: string;
  type: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'datetime' | 'categorical' | 'geographic';
  uniqueValues?: number;
  missingValues?: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  median?: number;
  std?: number;
  distribution?: Record<string, number>;
  correlation?: Record<string, number>;
}

export interface DataProfile {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  fields: DataField[];
  createdAt: Date;
  updatedAt: Date;
  size: number;
  format: 'csv' | 'xlsx' | 'json' | 'parquet' | 'arrow';
  sampleData: Record<string, any>[];
}

// Chart specification types
export interface ChartSpec {
  id: string;
  title: string;
  description?: string;
  data: {
    sourceId: string;
    transform?: TransformStep[];
  };
  mark: ChartMark;
  encoding: ChartEncoding;
  config: ChartConfig;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ChartMark = 
  | 'bar' | 'line' | 'area' | 'point' | 'circle' | 'square' | 'triangle'
  | 'boxplot' | 'violin' | 'histogram' | 'density' | 'heatmap' | 'treemap'
  | 'sankey' | 'candlestick' | 'map_choropleth' | 'map_point' | 'map_hexbin'
  | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'radar' | 'polar' | 'string'
  | 'stacked' | 'waterfall' | 'funnel' | 'gauge' | 'tree';

export interface ChartEncoding {
  x?: FieldEncoding;
  y?: FieldEncoding;
  color?: FieldEncoding;
  size?: FieldEncoding;
  shape?: FieldEncoding;
  text?: FieldEncoding;
  tooltip?: FieldEncoding[];
  facet?: {
    row?: FieldEncoding;
    col?: FieldEncoding;
  };
}

export interface FieldEncoding {
  field: string;
  type: 'quantitative' | 'temporal' | 'ordinal' | 'nominal';
  bin?: boolean | number;
  timeUnit?: string;
  aggregate?: string;
  sort?: 'ascending' | 'descending' | string[];
  scale?: {
    domain?: [number, number] | string[];
    range?: [number, number] | string[];
  };
}

export interface ChartConfig {
  theme: 'light' | 'dark' | 'auto';
  legend: boolean;
  labels: boolean;
  grid: boolean;
  axis: {
    x?: boolean;
    y?: boolean;
  };
  tooltip: boolean;
  animation: boolean;
}

// Data transformation types
export interface TransformStep {
  id: string;
  type: TransformType;
  params: Record<string, any>;
  description: string;
}

export type TransformType = 
  | 'filter' | 'sort' | 'select' | 'rename' | 'derive' | 'aggregate'
  | 'pivot' | 'join' | 'union' | 'sample' | 'impute' | 'normalize'
  | 'bin' | 'timeUnit' | 'window' | 'fold' | 'flatten';

// Dashboard types
export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  layout: DashboardLayout;
  charts: DashboardChart[];
  filters: DashboardFilter[];
  theme: 'light' | 'dark' | 'auto';
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  shareUrl?: string;
}

export interface DashboardLayout {
  type: 'grid' | 'flexible';
  columns: number;
  rows: number;
  gap: number;
}

export interface DashboardChart {
  id: string;
  chartId: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  title?: string;
  description?: string;
}

export interface DashboardFilter {
  id: string;
  type: 'select' | 'range' | 'date' | 'search';
  field: string;
  label: string;
  defaultValue?: any;
  options?: any[];
  min?: number;
  max?: number;
}

// AI/LLM types
export interface LLMProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'deepseek' | 'local';
  apiKey?: string;
  baseUrl?: string;
  models: string[];
  defaultModel: string;
  maxTokens: number;
  temperature: number;
}

export interface AIRequest {
  prompt: string;
  context: {
    dataProfile: DataProfile;
    currentChart?: ChartSpec;
    userPreferences?: Record<string, any>;
  };
  provider: LLMProvider;
  model: string;
}

export interface AIResponse {
  success: boolean;
  chartSpec?: ChartSpec;
  explanation?: string;
  suggestions?: string[];
  codeExport?: CodeExport;
  error?: string;
}

// Code export types
export interface CodeExport {
  language: 'python' | 'r' | 'javascript';
  library: string;
  code: string;
  filename: string;
  dependencies: string[];
  description: string;
}

// Story mode types
export interface Story {
  id: string;
  title: string;
  description?: string;
  slides: StorySlide[];
  theme: 'light' | 'dark' | 'auto';
  createdAt: Date;
  updatedAt: Date;
}

export interface StorySlide {
  id: string;
  title: string;
  content: string;
  chartId?: string;
  order: number;
  duration?: number;
}

// User and settings types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'uk' | 'de' | 'ru';
  defaultProvider: string;
  defaultModel: string;
  autoSave: boolean;
  showTutorials: boolean;
  enableAnalytics: boolean;
}

// Analytics and logging types
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  type: 'import' | 'chart_create' | 'chart_export' | 'ai_request' | 'dashboard_create' | 'story_create';
  data: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

// File upload types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  dataProfile?: DataProfile;
}

// Validation types
export interface ValidationRule {
  id: string;
  field: string;
  type: 'type' | 'range' | 'unique' | 'required' | 'regex' | 'custom';
  params: Record<string, any>;
  message: string;
  severity: 'warning' | 'error';
}

export interface ValidationResult {
  ruleId: string;
  field: string;
  passed: boolean;
  message: string;
  affectedRows: number[];
  severity: 'warning' | 'error';
}

// Export types
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'html';
  width?: number;
  height?: number;
  dpi?: number;
  backgroundColor?: string;
  includeLegend?: boolean;
  includeTitle?: boolean;
}

// Collaboration types
export interface Collaboration {
  id: string;
  type: 'view' | 'edit' | 'admin';
  userId: string;
  resourceId: string;
  resourceType: 'dashboard' | 'story' | 'chart';
  permissions: string[];
  createdAt: Date;
  expiresAt?: Date;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ChartSpec Schema (стандартизована схема для графіків)
export const ChartSpecZ = z.object({
  version: z.literal('1'),
  data: z.union([
    z.object({ id: z.string() }).strict(),
    z.object({ values: z.array(z.record(z.any())) }).strict(),
  ]),
  transforms: z.array(z.object({
    type: z.enum(['filter','aggregate','calculate','bin','timeUnit']),
    params: z.record(z.any())
  })).optional(),
  encoding: z.object({
    x: z.object({ 
      field: z.string(), 
      type: z.enum(['quantitative','temporal','ordinal','nominal']),
      aggregate: z.string().optional(),
      bin: z.boolean().optional(),
      timeUnit: z.string().optional()
    }).partial().optional(),
    y: z.object({ 
      field: z.string(), 
      type: z.enum(['quantitative','temporal','ordinal','nominal']),
      aggregate: z.string().optional()
    }).partial().optional(),
    color: z.object({ 
      field: z.string().optional(), 
      type: z.string().optional() 
    }).partial().optional(),
    size: z.object({ 
      field: z.string().optional(), 
      type: z.string().optional() 
    }).partial().optional(),
    tooltip: z.array(z.object({ 
      field: z.string(), 
      type: z.string() 
    })).optional()
  }).strict(),
  mark: z.enum(['bar','line','point','area','boxplot','heatmap','pie','treemap','sankey']),
  title: z.string().optional(),
  selection: z.any().optional(), // для linked-brushing у майбутньому
  meta: z.object({ 
    datasetHash: z.string().optional(), 
    createdAt: z.string(), 
    prompt: z.string().optional() 
  })
})

export type ChartSpecV1 = z.infer<typeof ChartSpecZ>

// Transform types для "Fix my data"
export type Transform =
 | { op: 'setType'; field: string; to: 'date'|'number'|'string' }
 | { op: 'parseDate'; field: string; pattern: 'auto'|string }
 | { op: 'normalizeDecimal'; field: string; decimal: '.'|','; thousands?: '.'|',' | ' ' }
 | { op: 'trim'; field: string }
 | { op: 'replace'; field: string; from: RegExp; to: string }
 | { op: 'dropDuplicates'; subset?: string[] }
 | { op: 'impute'; field: string; method: 'median'|'mean'|'mode'|'zero' }
 | { op: 'clip'; field: string; min?: number; max?: number }

export type TransformPlan = { 
  items: Transform[]; 
  preview: Array<{ field: string; before: any; after: any }>; 
  stats: Record<string, any> 
}

// Insight types для Auto-Report
export type Insight = {
  kind: 'trend'|'spike'|'drop'|'seasonality'|'correlation'|'cohort'|'funnel';
  summary: string; // людською мовою
  evidence: { metric: string; value?: number; delta?: number; p?: number };
  chartSpecRef: string; // id у звіті
}

export type Report = {
  id: string;
  datasetHash: string;
  specs: ChartSpecV1[];
  insights: Insight[];
  createdAt: string;
}

// Permalink types
export type PermalinkState = {
  chartSpec: ChartSpecV1;
  dataSample?: any[]; // для приватних даних
  transforms?: Transform[];
  meta: {
    originalDatasetHash: string;
    createdAt: string;
    prompt?: string;
  }
}
