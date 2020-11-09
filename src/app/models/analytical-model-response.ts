export interface AnalyticalModelResponse {
    project : string;
    name : string;
    type : string;
    description : string;
    variables : string;
    model : string;
};
  
// Test model
export const mockModel : AnalyticalModelResponse = {
    project : '1',
    name : "myProject",
    type : "AProjectType",
    description : "A Project Description.",
    variables : "vars",
    model : "linear regression"
};