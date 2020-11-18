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
    name : "myModel",
    type : "A Model Type",
    description : "A Model Description.",
    variables : "vars",
    model : "linear regression"
};