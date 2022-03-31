export interface ProjectModel {
    name: string;
    description: string;
    dataset: number;
    metadata: {
        target: string;
        features: string[];
    };
}
