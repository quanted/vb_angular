export interface PipelineInfoModel {
  name: string;
  ptype: string;
  description: string;
  'hyper-parameters': {
    name: string;
    vType: string;
    value: string;
    options: string;
  }[];
  metadata: {
    total_runs: number;
    avg_runtime: number;
    avg_runtimeN: number;
  };
}
