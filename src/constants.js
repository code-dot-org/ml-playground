export const ColumnTypes = {
  CATEGORICAL: "categorical",
  NUMERICAL: "numerical"
};

export const MLTypes = {
  CLASSIFICATION: "classification",
  REGRESSION: "regression"
};

export const RegressionTrainer = "knnRegress";
export const ClassificationTrainer = "knnClassify";

export const REGRESSION_ERROR_TOLERANCE = 5;

export const ResultsGrades = {
  CORRECT: "correct",
  INCORRECT: "incorrect"
};

export const PERCENT_OF_DATASET_FOR_TESTING = 0.1;

export const TestDataLocations = {
  END: "end",
  RANDOM: "random"
};

export const ModelNameMaxLength = 150;

export const UNIQUE_OPTIONS_MAX = 50;

export const saveMessages = {
  success: "Your model was saved!",
  failure: "There was an error. Your model did not save. Please try again.",
  piiProfanity: "Your model could not be saved because it contains profanity or personally identifying information (e.g. email, address, phone number)."
};
