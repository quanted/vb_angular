export interface PipelineModel {
  id?: string;
  project: string;
  name: string;
  type: string;
  description: string;
  hyperParameters?: {
    name: string;
    vType?: string;
    value: string;
    options?: string;
  }[];
  metadata?: {
    total_runs?: number;
    avg_runtime?: number;
    avg_runtimeN?: number;
  };
}
