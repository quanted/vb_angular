export interface PipelineModel {
  id?: string;
  project: string;
  name: string;
  type: string;
  description: string;
  metadata?: {
    hyper_parameters: {
    }
  };
}
