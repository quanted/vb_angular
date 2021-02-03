export interface PipelineModel {
  project: string;
  name: string;
  type: string;
  description: string;
  metadata?: {
    hyperParameters?: {
      name: string;
      vType: string;
      value: string;
      options: string;
    }[];
    total_runs?: number;
    avg_runtime?: number;
    avg_runtimeN?: number;
  };
}
