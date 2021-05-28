import {
  datasetUploaded,
  uniqueColumnNames,
  noEmptyCells,
  emptyCellFinder,
  minOneFeatureSelected,
  oneLabelSelected,
  uniqLabelFeaturesSelected,
  selectedColumnsHaveDatatype,
  numericalColumnsHaveOnlyNumbers,
  namedModel
} from "./validate.js";

import {
  ColumnTypes,
  MLTypes,
  RegressionTrainer,
  ClassificationTrainer,
  TestDataLocations,
  ResultsGrades,
  REGRESSION_ERROR_TOLERANCE,
  UNIQUE_OPTIONS_MAX
} from "./constants.js";

// Action types
const RESET_STATE = "RESET_STATE";
const SET_MODE = "SET_MODE";
const SET_SELECTED_NAME = "SET_SELECTED_NAME";
const SET_SELECTED_CSV = "SET_SELECTED_CSV";
const SET_SELECTED_JSON = "SET_SELECTED_JSON";
const SET_IMPORTED_DATA = "SET_IMPORTED_DATA";
const SET_IMPORTED_METADATA = "SET_IMPORTED_METADATA";
const SET_COLUMNS_BY_DATA_TYPE = "SET_COLUMNS_BY_DATA_TYPE";
const ADD_SELECTED_FEATURE = "ADD_SELECTED_FEATURE";
const REMOVE_SELECTED_FEATURE = "REMOVE_SELECTED_FEATURE";
const SET_LABEL_COLUMN = "SET_LABEL_COLUMN";
const SET_FEATURE_NUMBER_KEY = "SET_FEATURE_NUMBER_KEY";
const SET_RESERVE_LOCATION = "SET_RESERVE_LOCATION";
const SET_ACCURACY_CHECK_EXAMPLES = "SET_ACCURACY_CHECK_EXAMPLES";
const SET_ACCURACY_CHECK_LABELS = "SET_ACCURACY_CHECK_LABELS";
const SET_ACCURACY_CHECK_PREDICTED_LABELS =
  "SET_ACCURACY_CHECK_PREDICTED_LABELS";
const SET_TRAINING_EXAMPLES = "SET_TRAINING_EXAMPLES";
const SET_TRAINING_LABELS = "SET_TRAINING_LABELS";
const SET_TEST_DATA = "SET_TEST_DATA";
const SET_PREDICTION = "SET_PREDICTION";
const SET_MODEL_SIZE = "SET_MODEL_SIZE";
const SET_TRAINED_MODEL = "SET_TRAINED_MODEL";
const SET_TRAINED_MODEL_DETAIL = "SET_TRAINED_MODEL_DETAIL";
const SET_CURRENT_PANEL = "SET_CURRENT_PANEL";
const SET_CURRENT_COLUMN = "SET_CURRENT_COLUMN";
const SET_HIGHLIGHT_COLUMN = "SET_HIGHLIGHT_COLUMN";
const SET_HIGHLIGHT_DATASET = "SET_HIGHLIGHT_DATASET";
const SET_RESULTS_PHASE = "SET_RESULTS_PHASE";
const SET_RESULTS_HIGHLIGHT_ROW = "SET_RESULTS_HIGHLIGHT_ROW";
const SET_INSTRUCTIONS_KEY_CALLBACK = "SET_INSTRUCTIONS_KEY_CALLBACK";
const SET_SAVE_STATUS = "SET_SAVE_STATUS";
const SET_HISTORIC_RESULT = "SET_HISTORIC_RESULT";
const SET_SHOW_RESULTS_DETAILS = "SET_SHOW_RESULTS_DETAILS";
const SET_K_VALUE = "SET_K_VALUE";
const SET_INSTRUCTIONS_DISMISSED = "SET_INSTRUCTIONS_DISMISSED";
const SET_RESULTS_TAB = "SET_RESULTS_TAB";

// Action creators
export function setMode(mode) {
  return { type: SET_MODE, mode };
}

export function setSelectedName(name) {
  return { type: SET_SELECTED_NAME, name };
}

export function setSelectedCSV(csvfile) {
  return { type: SET_SELECTED_CSV, csvfile };
}

export function setSelectedJSON(jsonfile) {
  return { type: SET_SELECTED_JSON, jsonfile };
}

export function setImportedData(data) {
  return { type: SET_IMPORTED_DATA, data };
}

export function setImportedMetadata(metadata) {
  return { type: SET_IMPORTED_METADATA, metadata };
}

export const setColumnsByDataType = (column, dataType) => ({
  type: SET_COLUMNS_BY_DATA_TYPE,
  column,
  dataType
});

export function addSelectedFeature(selectedFeature) {
  return { type: ADD_SELECTED_FEATURE, selectedFeature };
}

export function removeSelectedFeature(selectedFeature) {
  return { type: REMOVE_SELECTED_FEATURE, selectedFeature };
}

export function setLabelColumn(labelColumn) {
  return { type: SET_LABEL_COLUMN, labelColumn };
}

/* featureNumberKey maps feature names to a hash of category options mapped to integers.
  {
    feature1: {
      option1 : 0,
      option2 : 1,
      option3: 2,
      ...
    },
    feature2: {
      option1 : 0,
      option2 : 1,
      ...
    }
  }
*/
export function setFeatureNumberKey(featureNumberKey) {
  return { type: SET_FEATURE_NUMBER_KEY, featureNumberKey };
}

export function setReserveLocation(reserveLocation) {
  return { type: SET_RESERVE_LOCATION, reserveLocation };
}

export function setAccuracyCheckExamples(accuracyCheckExamples) {
  return { type: SET_ACCURACY_CHECK_EXAMPLES, accuracyCheckExamples };
}

export function setAccuracyCheckLabels(accuracyCheckLabels) {
  return { type: SET_ACCURACY_CHECK_LABELS, accuracyCheckLabels };
}

export function setAccuracyCheckPredictedLabels(predictedLabels) {
  return { type: SET_ACCURACY_CHECK_PREDICTED_LABELS, predictedLabels };
}

export function setTrainingExamples(trainingExamples) {
  return { type: SET_TRAINING_EXAMPLES, trainingExamples };
}

export function setTrainingLabels(trainingLabels) {
  return { type: SET_TRAINING_LABELS, trainingLabels };
}

export function setTestData(testData) {
  return { type: SET_TEST_DATA, testData };
}

export function setPrediction(prediction) {
  return { type: SET_PREDICTION, prediction };
}

export function resetState() {
  return { type: RESET_STATE };
}

export function setModelSize(modelSize) {
  return { type: SET_MODEL_SIZE, modelSize };
}

export function setTrainedModel(trainedModel) {
  return { type: SET_TRAINED_MODEL, trainedModel };
}

export function setTrainedModelDetail(field, value, isColumn) {
  return { type: SET_TRAINED_MODEL_DETAIL, field, value, isColumn };
}

export function setInstructionsKeyCallback(instructionsKeyCallback) {
  return { type: SET_INSTRUCTIONS_KEY_CALLBACK, instructionsKeyCallback };
}

export function setCurrentPanel(currentPanel) {
  return { type: SET_CURRENT_PANEL, currentPanel };
}

export function setCurrentColumn(currentColumn) {
  return { type: SET_CURRENT_COLUMN, currentColumn };
}

export function setHighlightColumn(highlightColumn) {
  return { type: SET_HIGHLIGHT_COLUMN, highlightColumn };
}

export function setHighlightDataset(highlightDataset) {
  return { type: SET_HIGHLIGHT_DATASET, highlightDataset };
}

export function setResultsPhase(phase) {
  return { type: SET_RESULTS_PHASE, phase };
}

export function setResultsHighlightRow(highlightRow) {
  return { type: SET_RESULTS_HIGHLIGHT_ROW, highlightRow };
}

export function setSaveStatus(status) {
  return { type: SET_SAVE_STATUS, status };
}

export function setHistoricResult(label, features, accuracy) {
  return { type: SET_HISTORIC_RESULT, label, features, accuracy };
}

export function setShowResultsDetails(show) {
  return { type: SET_SHOW_RESULTS_DETAILS, show };
}

export function setKValue(kValue) {
  return { type: SET_K_VALUE, kValue };
}

export function setInstructionsDismissed() {
  return { type: SET_INSTRUCTIONS_DISMISSED };
}

export function setResultsTab(key) {
  return { type: SET_RESULTS_TAB, key };
}

const initialState = {
  name: undefined,
  csvfile: undefined,
  jsonfile: undefined,
  data: [],
  metadata: {},
  highlightDataset: undefined,
  highlightColumn: undefined,
  columnsByDataType: {},
  selectedFeatures: [],
  labelColumn: undefined,
  featureNumberKey: {},
  trainingExamples: [],
  reserveLocation: TestDataLocations.END,
  accuracyCheckExamples: [],
  accuracyCheckLabels: [],
  accuracyCheckPredictedLabels: [],
  testData: {},
  prediction: undefined,
  modelSize: undefined,
  trainedModel: undefined,
  trainedModelDetails: {},
  instructionCallback: undefined,
  currentPanel: "selectDataset",
  currentColumn: undefined,
  resultsPhase: undefined,
  // Possible values for saveStatus: notStarted, started, success, and failure.
  saveStatus: "notStarted",
  columnRefs: {},
  historicResults: [],
  showResultsDetails: false,
  resultsHighlightRow: undefined,
  kValue: null,
  viewedPanels: [],
  instructionsOverlayActive: false,
  resultsTab: ResultsGrades.CORRECT
};

// Reducer
export default function rootReducer(state = initialState, action) {
  if (action.type === SET_MODE) {
    return {
      ...state,
      mode: action.mode
    };
  }
  if (action.type === SET_SELECTED_NAME) {
    return {
      ...state,
      name: action.name
    };
  }
  if (action.type === SET_SELECTED_CSV) {
    return {
      ...state,
      csvfile: action.csvfile
    };
  }
  if (action.type === SET_SELECTED_JSON) {
    return {
      ...state,
      jsonfile: action.jsonfile
    };
  }
  if (action.type === SET_IMPORTED_DATA) {
    return {
      ...state,
      data: action.data
    };
  }
  if (action.type === SET_IMPORTED_METADATA) {
    var newState = {
      ...state,
      metadata: action.metadata
    };

    if (
      state.mode &&
      state.mode.datasets &&
      state.mode.datasets.length > 1 &&
      state.mode.hideSelectLabel
    ) {
      newState.labelColumn = action.metadata.defaultLabelColumn;
    }

    return newState;
  }
  if (action.type === SET_COLUMNS_BY_DATA_TYPE) {
    return {
      ...state,
      columnsByDataType: {
        ...state.columnsByDataType,
        [action.column]: action.dataType
      }
    };
  }
  if (action.type === ADD_SELECTED_FEATURE) {
    if (!state.selectedFeatures.includes(action.selectedFeature)) {
      return {
        ...state,
        selectedFeatures: [...state.selectedFeatures, action.selectedFeature]
      };
    }
  }
  if (action.type === REMOVE_SELECTED_FEATURE) {
    return {
      ...state,
      selectedFeatures: state.selectedFeatures.filter(
        item => item !== action.selectedFeature
      )
    };
  }
  if (action.type === SET_LABEL_COLUMN) {
    return {
      ...state,
      labelColumn: action.labelColumn
    };
  }
  if (action.type === SET_FEATURE_NUMBER_KEY) {
    return {
      ...state,
      featureNumberKey: action.featureNumberKey
    };
  }
  if (action.type === SET_TRAINING_EXAMPLES) {
    return {
      ...state,
      trainingExamples: action.trainingExamples
    };
  }
  if (action.type === SET_TRAINING_LABELS) {
    return {
      ...state,
      trainingLabels: action.trainingLabels
    };
  }
  if (action.type === SET_RESERVE_LOCATION) {
    return {
      ...state,
      reserveLocation: action.reserveLocation
    };
  }
  if (action.type === SET_ACCURACY_CHECK_EXAMPLES) {
    return {
      ...state,
      accuracyCheckExamples: action.accuracyCheckExamples
    };
  }
  if (action.type === SET_ACCURACY_CHECK_LABELS) {
    return {
      ...state,
      accuracyCheckLabels: action.accuracyCheckLabels
    };
  }
  if (action.type === SET_ACCURACY_CHECK_PREDICTED_LABELS) {
    return {
      ...state,
      accuracyCheckPredictedLabels: action.predictedLabels
    };
  }
  if (action.type === SET_TEST_DATA) {
    return {
      ...state,
      testData: action.testData,
      prediction: undefined
    };
  }
  if (action.type === SET_PREDICTION) {
    return {
      ...state,
      prediction: action.prediction
    };
  }
  if (action.type === RESET_STATE) {
    return {
      ...initialState,
      instructionsKeyCallback: state.instructionsKeyCallback,
      mode: state.mode,
      reserveLocation: state.reserveLocation
    };
  }
  if (action.type === SET_MODEL_SIZE) {
    return {
      ...state,
      modelSize: action.modelSize
    };
  }
  if (action.type === SET_TRAINED_MODEL) {
    return {
      ...state,
      trainedModel: action.trainedModel
    };
  }
  if (action.type === SET_TRAINED_MODEL_DETAIL) {
    let trainedModelDetails = state.trainedModelDetails;

    if (action.isColumn) {
      if (!trainedModelDetails.columns) {
        trainedModelDetails.columns = [];
      }

      const column = trainedModelDetails.columns.find(column => {
        return column.id === action.field;
      });

      if (column) {
        column.description = action.value;
      } else {
        trainedModelDetails.columns.push({
          id: action.field,
          description: action.value
        });
      }
    } else {
      trainedModelDetails[action.field] = action.value;
    }

    return {
      ...state,
      ...trainedModelDetails
    };
  }
  if (action.type === SET_INSTRUCTIONS_KEY_CALLBACK) {
    return {
      ...state,
      instructionsKeyCallback: action.instructionsKeyCallback
    };
  }
  if (action.type === SET_CURRENT_PANEL) {
    let showedOverlay = false;
    if (state.instructionsKeyCallback) {
      const options = {};
      if (
        !(state.mode && state.mode.hideInstructionsOverlay) &&
        !state.viewedPanels.includes(action.currentPanel)
      ) {
        options.showOverlay = true;
        state.viewedPanels.push(action.currentPanel);
        showedOverlay = true;
      }
      state.instructionsKeyCallback(action.currentPanel, options);
    }

    if (action.currentPanel === "dataDisplayLabel") {
      return {
        ...state,
        currentPanel: action.currentPanel,
        instructionsOverlayActive: showedOverlay,
        currentColumn: undefined,
        selectedFeatures: []
      };
    }

    if (action.currentPanel === "results") {
      return {
        ...state,
        currentPanel: action.currentPanel,
        instructionsOverlayActive: showedOverlay,
        testData: {},
        prediction: undefined,
        resultsTab: ResultsGrades.CORRECT
      };
    }

    return {
      ...state,
      currentPanel: action.currentPanel,
      instructionsOverlayActive: showedOverlay,
      currentColumn: undefined
    };
  }
  if (action.type === SET_HIGHLIGHT_COLUMN) {
    if (!getShowColumnClicking(state)) {
      // If no column clicking, do nothing.
      return state;
    }
    if (
      state.currentPanel === "dataDisplayFeatures" &&
      action.highlightColumn === state.labelColumn
    ) {
      // If doing feature selection, and the label column is clicked, do nothing.
      return state;
    }
    return {
      ...state,
      highlightColumn: action.highlightColumn
    };
  }
  if (action.type === SET_HIGHLIGHT_DATASET) {
    return {
      ...state,
      highlightDataset: action.highlightDataset
    };
  }
  if (action.type === SET_CURRENT_COLUMN) {
    if (!getShowColumnClicking(state)) {
      // If no column clicking, do nothing.
      return state;
    }
    if (
      state.currentPanel === "dataDisplayFeatures" &&
      action.currentColumn === state.labelColumn
    ) {
      // If doing feature selection, and the label column is clicked, do nothing.
      return state;
    } else if (state.currentColumn === action.currentColumn) {
      // If column is selected, then deselect.
      return {
        ...state,
        currentColumn: undefined
      };
    } else {
      // Select the column.
      return {
        ...state,
        currentColumn: action.currentColumn
      };
    }
  }
  if (action.type === SET_RESULTS_PHASE) {
    return {
      ...state,
      resultsPhase: action.phase
    };
  }
  if (action.type === SET_RESULTS_HIGHLIGHT_ROW) {
    return {
      ...state,
      resultsHighlightRow: action.highlightRow
    }
  }
  if (action.type === SET_SAVE_STATUS) {
    return {
      ...state,
      saveStatus: action.status
    };
  }
  if (action.type === SET_HISTORIC_RESULT) {
    return {
      ...state,
      historicResults: [
        {
          label: action.label,
          features: action.features,
          accuracy: action.accuracy
        },
        ...state.historicResults
      ]
    };
  }
  if (action.type === SET_SHOW_RESULTS_DETAILS) {
    return {
      ...state,
      showResultsDetails: action.show
    };
  }
  if (action.type === SET_K_VALUE) {
    return {
      ...state,
      kValue: action.kValue
    };
  }
  if (action.type === SET_INSTRUCTIONS_DISMISSED) {
    return {
      ...state,
      instructionsOverlayActive: false
    }
  }
  if (action.type === SET_RESULTS_TAB) {
    return {
      ...state,
      resultsTab: action.key
    }
  }
  return state;
}

export function getFeatures(state) {
  return state.data.length > 0 ? Object.keys(state.data[0]) : [];
}

function filterColumnsByType(state, columnType) {
  return Object.keys(state.columnsByDataType).filter(
    column => state.columnsByDataType[column] === columnType
  );
}

export function getCategoricalColumns(state) {
  return filterColumnsByType(state, ColumnTypes.CATEGORICAL);
}

function isColumnReadOnly(state, column) {
  const metadataColumnType =
    state.metadata &&
    state.metadata.fields &&
    state.metadata.fields.find(field => {
      return field.id === column;
    }).type;
  return !!metadataColumnType;
}

export function getSelectedColumns(state) {
  return state.selectedFeatures
    .concat(state.labelColumn)
    .filter(column => column !== undefined && column !== "")
    .map(columnId => {
      return { id: columnId, readOnly: isColumnReadOnly(state, columnId) };
    });
}

function isColumnCategorical(state, column) {
  return (state.columnsByDataType[column] === ColumnTypes.CATEGORICAL);
}

function isValidCategoricalData(state, column) {
  return !hasTooManyUniqueOptions(state, column);
}

function isColumnNumerical(state, column) {
  return (state.columnsByDataType[column] === ColumnTypes.NUMERICAL);
}

function isValidNumericalData(state, column) {
  return !isNaN(getMaximumValue(state, column));
}

function isColumnDataValid(state, column) {
  return (
    isColumnCategorical(state, column) && isValidCategoricalData(state,column)
  ) ||
  (isColumnNumerical(state, column) && isValidNumericalData(state,column));
}

function isLabel(state, column) {
  return column === state.labelColumn;
}

function isFeature(state, column) {
  return state.selectedFeatures.includes(column);
}

function isSelected(state, column) {
  return isLabel(state, column) || isFeature(state, column);
}

function isSelectable(state, column) {
  return isColumnDataValid(state, column) && !isSelected(state, column);
}

export function getCurrentColumnData(state) {
  if (!state.currentColumn) {
    return null;
  }

  return {
    id: state.currentColumn,
    readOnly: isColumnReadOnly(state, state.currentColumn),
    dataType: state.columnsByDataType[state.currentColumn],
    uniqueOptions: getUniqueOptions(state, state.currentColumn),
    extrema: getExtrema(state, state.currentColumn),
    frequencies: getOptionFrequencies(state, state.currentColumn),
    description: getColumnDescription(state, state.currentColumn),
    hasTooManyUniqueOptions: hasTooManyUniqueOptions(state, state.currentColumn),
    isColumnDataValid: isColumnDataValid(state, state.currentColumn),
    isSelectable: isSelectable(state, state.currentColumn)
  };
}

export function getSelectedCategoricalColumns(state) {
  let intersection = getCategoricalColumns(state).filter(
    x => state.selectedFeatures.includes(x) || x === state.labelColumn
  );
  return intersection;
}

export function getSelectedCategoricalFeatures(state) {
  let intersection = getCategoricalColumns(state).filter(x =>
    state.selectedFeatures.includes(x)
  );
  return intersection;
}

export function getSelectedNumericalColumns(state) {
  let intersection = getNumericalColumns(state).filter(
    x => state.selectedFeatures.includes(x) || x === state.labelColumn
  );
  return intersection;
}

export function getSelectedNumericalFeatures(state) {
  let intersection = getNumericalColumns(state).filter(x =>
    state.selectedFeatures.includes(x)
  );
  return intersection;
}

export function getNumericalColumns(state) {
  return filterColumnsByType(state, ColumnTypes.NUMERICAL);
}

/*
  Categorical columns with too many unique values are unlikley to make
  accurate models, and we don't want to overflow the metadata column for saved
  models.
*/
function hasTooManyUniqueOptions(state, column) {
  if (isColumnCategorical(state, column)) {
    const uniqueOptionsCount =
      getUniqueOptions(state, state.currentColumn).length;
    return uniqueOptionsCount > UNIQUE_OPTIONS_MAX;
  }
  return false;
}

export function getSelectableFeatures(state) {
  return getFeatures(state).filter(
    column =>
      column !== state.labelColumn && !state.selectedFeatures.includes(column)
  );
}

export function getSelectableLabels(state) {
  return getFeatures(state).filter(x => !state.selectedFeatures.includes(x));
}

export function getUniqueOptions(state, column) {
  return Array.from(new Set(state.data.map(row => row[column]))).filter(
    option => option !== undefined && option !== ""
  );
}

export function getOptionFrequencies(state, column) {
  let optionFrequencies = {};
  for (let row of state.data) {
    if (optionFrequencies[row[column]]) {
      optionFrequencies[row[column]]++;
    } else {
      optionFrequencies[row[column]] = 1;
    }
  }
  return optionFrequencies;
}

export function getUniqueOptionsByColumn(state) {
  let uniqueOptionsByColumn = {};
  getSelectedCategoricalColumns(state).map(
    column => (uniqueOptionsByColumn[column] = getUniqueOptions(state, column))
  );
  return uniqueOptionsByColumn;
}

export function getExtremaByColumn(state) {
  let extremaByColumn = {};
  getNumericalColumns(state).map(
    column => (extremaByColumn[column] = getExtrema(state, column))
  );
  return extremaByColumn;
}

function getMaximumValue(state, column) {
  return Math.max(...state.data.map(row => parseFloat(row[column])));
}

function getMinimumValue(state, column) {
  return Math.min(...state.data.map(row => parseFloat(row[column])));
}

function getRange(maximumValue, minimumValue) {
  return Math.abs(maximumValue - minimumValue);
}

export function getExtrema(state, column) {
  let extrema = {};
  extrema.max = getMaximumValue(state, column);
  extrema.min = getMinimumValue(state, column)
  extrema.range = getRange(extrema.max, extrema.min);

  return extrema;
}

export function getSelectedColumnDescriptions(state) {
  return getSelectedColumns(state).map(column => {
    return {
      id: column.id,
      description: getColumnDescription(state, column.id)
    };
  });
}

export function getColumnDescription(state, columnId) {
  if (!state || !columnId) {
    return null;
  }

  // Use metadata if available.
  if (state.metadata && state.metadata.fields) {
    const field = state.metadata.fields.find(field => {
      return field.id === columnId;
    });
    return field.description;
  }

  // Try using a user-entered column description if available.
  if (!state.columns) {
    return;
  }
  const matchedColumn = state.columns.find(column => {
    return column.id === columnId;
  });
  if (matchedColumn) {
    return matchedColumn.description;
  }

  // No column description available.
  return null;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

export function getConvertedValue(state, rawValue, column) {
  const convertedValue =
    getCategoricalColumns(state).includes(column) &&
    !isEmpty(state.featureNumberKey)
      ? getKeyByValue(state.featureNumberKey[column], rawValue)
      : rawValue;
  return convertedValue;
}

export function getConvertedAccuracyCheckExamples(state) {
  const convertedAccuracyCheckExamples = [];
  var example;
  for (example of state.accuracyCheckExamples) {
    let convertedAccuracyCheckExample = [];
    for (var i = 0; i < state.selectedFeatures.length; i++) {
      convertedAccuracyCheckExample.push(
        getConvertedValue(state, example[i], state.selectedFeatures[i])
      );
    }
    convertedAccuracyCheckExamples.push(convertedAccuracyCheckExample);
  }
  return convertedAccuracyCheckExamples;
}

export function getConvertedLabel(state, rawLabel) {
  if (state.labelColumn) {
    return getConvertedValue(state, rawLabel, state.labelColumn);
  }
}

export function getConvertedPredictedLabel(state) {
  return getConvertedLabel(state, state.prediction);
}

export function getConvertedLabels(state, rawLabels = []) {
  return rawLabels.map(label => getConvertedLabel(state, label));
}

export function isRegression(state) {
  return isColumnNumerical(state, state.labelColumn);
}

export function getAccuracyGrades(state) {
  const grades = isRegression(state)
    ? getAccuracyRegression(state).grades
    : getAccuracyClassification(state).grades;
  return grades;
}

export function getAccuracyClassification(state) {
  let accuracy = {};
  let numCorrect = 0;
  let grades = [];
  const numPredictedLabels = state.accuracyCheckPredictedLabels
    ? state.accuracyCheckPredictedLabels.length
    : 0;
  for (let i = 0; i < numPredictedLabels; i++) {
    if (
      state.accuracyCheckLabels[i].toString() ===
      state.accuracyCheckPredictedLabels[i].toString()
    ) {
      numCorrect++;
      grades.push(ResultsGrades.CORRECT);
    } else {
      grades.push(ResultsGrades.INCORRECT);
    }
  }
  accuracy.percentCorrect = ((numCorrect / numPredictedLabels) * 100).toFixed(
    2
  );
  accuracy.grades = grades;
  return accuracy;
}

export function getAccuracyRegression(state) {
  let accuracy = {};
  let numCorrect = 0;
  let grades = [];
  const range = getExtrema(state, state.labelColumn).range;
  const errorTolerance = (range * REGRESSION_ERROR_TOLERANCE) / 100;
  const numPredictedLabels = state.accuracyCheckPredictedLabels.length;
  for (let i = 0; i < numPredictedLabels; i++) {
    const diff = Math.abs(
      state.accuracyCheckLabels[i] - state.accuracyCheckPredictedLabels[i]
    );
    if (diff <= errorTolerance) {
      numCorrect++;
      grades.push(ResultsGrades.CORRECT);
    } else {
      grades.push(ResultsGrades.INCORRECT);
    }
  }
  accuracy.percentCorrect = ((numCorrect / numPredictedLabels) * 100).toFixed(
    2
  );
  accuracy.grades = grades;
  return accuracy;
}

export function getSummaryStat(state) {
  let summaryStat = {};
  if (isRegression(state)) {
    summaryStat.type = MLTypes.REGRESSION;
    summaryStat.stat = getAccuracyRegression(state).percentCorrect;
  } else {
    summaryStat.type = MLTypes.CLASSIFICATION;
    summaryStat.stat = getAccuracyClassification(state).percentCorrect;
  }
  return summaryStat;
}

export function validationMessages(state) {
  const validationMessages = {};
  validationMessages["notEnoughData"] = {
    panel: "dataDisplay",
    readyToTrain: datasetUploaded(state),
    errorString: "There is not enough data to train a model.",
    successString: `There are ${state.data.length} rows of data.`
  };
  validationMessages["columnNames"] = {
    panel: "dataDisplay",
    readyToTrain: uniqueColumnNames(state),
    errorString:
      "Each column must have a name, and column names must be unique.",
    successString: "Each column has a unique name."
  };
  validationMessages["emptyCells"] = {
    panel: "dataDisplay",
    readyToTrain: noEmptyCells(state),
    errorString: "There can't be any empty cells.",
    successString: "Each cell has a value!"
  };
  validationMessages["selectLabel"] = {
    panel: "selectFeatures",
    readyToTrain: oneLabelSelected(state),
    errorString: "Please designate one column as the label column.",
    successString: "Label column has been selected."
  };
  validationMessages["selectFeatures"] = {
    panel: "selectFeatures",
    readyToTrain: minOneFeatureSelected(state),
    errorString: "Please select at least one feature to train.",
    successString: "At least one feature is selected."
  };
  validationMessages["columnUsage"] = {
    panel: "selectFeatures",
    readyToTrain: uniqLabelFeaturesSelected(state),
    errorString:
      "A column can not be selected as a both a feature and a label.",
    successString: "Label and feature(s) columns are unique."
  };
  validationMessages["columnData"] = {
    panel: "selectFeatures",
    readyToTrain: selectedColumnsHaveDatatype(state),
    errorString:
      "Feature and label columns must contain only numerical or categorical data.",
    successString:
      "Selected features and label contain numerical or categorical data"
  };
  validationMessages["numericalNumbers"] = {
    panel: "selectFeatures",
    readyToTrain: numericalColumnsHaveOnlyNumbers(state),
    errorString: "Numerical columns should contain only numbers.",
    successString: "Numerical columns contain only numbers."
  };
  validationMessages["nameModel"] = {
    panel: "saveModel",
    readyToTrain: namedModel(state),
    errorString: "Please name your model.",
    successString: "Your model is named."
  };
  return validationMessages;
}

export function isDataUploaded(state) {
  return state.data.length > 0;
}

export function readyToTrain(state) {
  return uniqLabelFeaturesSelected(state);
}

export function getEmptyCellDetails(state) {
  const emptyCellLocations = emptyCellFinder(state).map(cellDetails => {
    return `Column: ${cellDetails.column} Row: ${cellDetails.row}`;
  });
  return emptyCellLocations;
}

export function getDataDescription(state) {
  // If this a dataset from the internal collection that already has a description, use that.
  if (
    state.metadata &&
    state.metadata.card &&
    state.metadata.card.description
  ) {
    return state.metadata.card.description;
  } else if (
    state.trainedModelDetails &&
    state.trainedModelDetails.datasetDescription
  ) {
    return state.trainedModelDetails.datasetDescription;
  } else {
    return undefined;
  }
}

export function getDatasetDetails(state) {
  const datasetDetails = {};
  datasetDetails.name = state.metadata.name;
  datasetDetails.description = getDataDescription(state);
  datasetDetails.numRows = state.data.length;
  datasetDetails.isUserUploaded = isUserUploadedDataset(state);
  return datasetDetails;
}

export function getColumnDataToSave(state, column) {
  const columnData = {};
  columnData.id = column;
  columnData.description = getColumnDescription(state, column);
  if (isColumnCategorical(state, column)) {
    columnData.values = getUniqueOptions(state, column);
  } else if (isColumnNumerical(state, column)) {
    const {max, min} = getExtrema(state, column);
    columnData.max = max;
    columnData.min = min;
  }
  return columnData;
}

export function getFeaturesToSave(state) {
  const features = state.selectedFeatures.map(feature =>
    getColumnDataToSave(state, feature)
  );
  return features;
}

export function getTrainedModelDataToSave(state) {
  const dataToSave = {};
  dataToSave.name = state.trainedModelDetails.name;
  dataToSave.datasetDetails = getDatasetDetails(state);
  dataToSave.potentialUses = state.trainedModelDetails.potentialUses;
  dataToSave.potentialMisuses = state.trainedModelDetails.potentialMisuses;
  dataToSave.selectedTrainer = isRegression(state)
    ? RegressionTrainer
    : ClassificationTrainer;
  dataToSave.featureNumberKey = state.featureNumberKey;
  dataToSave.label = getColumnDataToSave(state, state.labelColumn);
  dataToSave.features = getFeaturesToSave(state);
  dataToSave.summaryStat = getSummaryStat(state);
  dataToSave.trainedModel = state.trainedModel
    ? state.trainedModel.toJSON()
    : null;
  dataToSave.kValue = state.kValue;

  return dataToSave;
}

export function getSpecifiedDatasets(state) {
  return state.mode && state.mode.datasets;
}

export function getShowColumnClicking(state) {
  return !(state.mode && state.mode.hideColumnClicking);
}

export function getPredictAvailable(state) {
  return (
    Object.keys(state.testData).filter(
      value => state.testData[value] && state.testData[value] !== ""
    ).length === state.selectedFeatures.length
  );
}

/*
const panelList = [
  { id: "selectDataset", label: "Import" },
  { id: "specifyColumns", label: "Columns" },
  { id: "dataDisplayLabel", label: "Label" },
  { id: "dataDisplayFeatures", label: "Features" },
  { id: "trainModel", label: "Train" },
  { id: "generateResults", label: "Test" },
  { id: "results", label: "Results" },
  { id: "predict", label: "Predict" },
  { id: "saveModel", label: "Save" },
  { id: "modelSummary", label: "Finish" }
];
*/

// Is a panel ready to be visited?  This determines whether a visible
// nav button is enabled or disabled.
function isPanelEnabled(state, panelId) {
  if (panelId === "specifyColumns") {
    if (state.data.length === 0) {
      return false;
    }
  }

  if (panelId === "dataDisplayLabel") {
    if (state.data.length === 0) {
      return false;
    }
  }

  if (panelId === "dataDisplayFeatures") {
    if (!state.labelColumn || state.labelcolumn === "") {
      return false;
    }
  }

  if (panelId === "columnInspector") {
    if (getSelectedColumns(state).length === 0) {
      return false;
    }
  }

  if (panelId === "selectFeatures") {
    if (!isDataUploaded(state)) {
      return false;
    }
  }

  if (panelId === "trainModel") {
    if (!readyToTrain(state)) {
      return false;
    }
  }

  if (panelId === "results") {
    if (
      state.accuracyCheckExamples.length === 0 ||
      ["success", "started"].includes(state.saveStatus)
    ) {
      return false;
    }
  }

  if (panelId === "modelSummary") {
    if (state.saveStatus === "started") {
      return false;
    }

    if ([undefined, ""].includes(state.trainedModelDetails.name)) {
      return false;
    }
  }

  return true;
}

// Is a panel available to be shown?  This determines what panels
// can possibly be visited in the app.
function isPanelAvailable(state, panelId) {
  const mode = state.mode;

  if (panelId === "selectDataset") {
    if (mode && mode.datasets && mode.datasets.length === 1) {
      return false;
    }
  }

  if (panelId === "dataDisplayLabel") {
    if (mode && mode.hideSelectLabel) {
      return false;
    }
  }

  if (panelId === "saveModel") {
    if ((mode && mode.hideSave) || state.saveStatus === "success") {
      return false;
    }
  }

  return true;
}

function isAccuracyAcceptable(state) {
  const mode = state.mode;

  if (
    mode &&
    mode.requireAccuracy &&
    mode.requireAccuracy > state.historicResults[0].accuracy
  ) {
    return false;
  }

  return true;
}

// Given the current panel, return the appropriate previous & next buttons.
export function getPanelButtons(state) {
  let prev, next;

  if (state.currentPanel === "selectDataset") {
    prev = null;
    next = isPanelAvailable(state, "dataDisplayLabel")
      ? { panel: "dataDisplayLabel", text: "Continue" }
      : isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: "Continue" }
      : null;
  } else if (state.currentPanel === "dataDisplayLabel") {
    prev = isPanelAvailable(state, "selectDataset")
      ? { panel: "selectDataset", text: "Back" }
      : null;
    next = isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: "Continue" }
      : null;
  } else if (state.currentPanel === "dataDisplayFeatures") {
    prev = isPanelAvailable(state, "dataDisplayLabel")
      ? { panel: "dataDisplayLabel", text: "Back" }
      : null;
    next = isPanelAvailable(state, "trainModel")
      ? { panel: "trainModel", text: "Train" }
      : null;
  } else if (state.currentPanel === "trainModel") {
    if (state.modelSize) {
      prev = null;
      next = { panel: "generateResults", text: "Continue" };
    }
  } else if (state.currentPanel === "generateResults") {
    if (state.modelSize) {
      prev = null;
      next = { panel: "results", text: "Continue" };
    }
  } else if (state.currentPanel === "results") {
    prev = isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: "Try again" }
      : null;
    next = !isAccuracyAcceptable(state)
      ? null
      : isPanelAvailable(state, "saveModel")
      ? { panel: "saveModel", text: "Continue" }
      : { panel: "continue", text: "Finish" };
  } else if (state.currentPanel === "saveModel") {
    prev = { panel: "results", text: "Back" };
    next = isPanelAvailable(state, "modelSummary")
      ? { panel: "modelSummary", text: "Save" }
      : null;
  } else if (state.currentPanel === "modelSummary") {
    prev = isPanelAvailable(state, "saveModel")
      ? { panel: "saveModel", text: "Back" }
      : null;
    next = isPanelAvailable(state, "finish")
      ? { panel: "finish", text: "Finish" }
      : null;
  }

  if (prev) {
    prev.enabled = isPanelEnabled(state, prev.panel);
  }
  if (next) {
    next.enabled = isPanelEnabled(state, next.panel);
  }

  return { prev, next };
}

/* Returns an object with information for the CrossTab UI.
 *
 * Here is an example result:
 *
 *  {
 *    results: [
 *      {
 *        featureValues: ["1", "1"],
 *        labelCounts: { yes: 2, no: 1 },
 *        labelPercents: { yes: 67, no: 33 }
 *      },
 *      {
 *        featureValues: ["0", "0"],
 *        labelCounts: { yes: 25, no: 42 },
 *        labelPercents: { yes: 37, no: 63 }
 *      },
 *      {
 *        featureValues: ["1", "0"],
 *        labelCounts: { yes: 6, no: 5 },
 *        labelPercents: { yes: 55, no: 45 }
 *      },
 *      {
 *        featureValues: ["0", "1"],
 *        labelCounts: { no: 2, yes: 2 },
 *        labelPercents: { no: 50, yes: 50 }
 *      }
 *    ],
 *    uniqueLabelValues: ["yes", "no"],
 *    featureNames: ["caramel", "crispy"],
 *    labelName: "delicious?"
 *  }
 *
 */

export function getCrossTabData(state) {
  if (!state.labelColumn || !state.currentColumn) {
    return null;
  }

  if (
    !isColumnCategorical(state, state.labelColumn) || !isColumnCategorical(state, state.currentColumn)
  ) {
    return null;
  }

  var results = [];

  // For each row of data, determine whether we have found a new or existing
  // combination of feature values.  If new, then add a new entry to our results
  // array.  Then record or increment the count for the corresponding label
  // value.

  for (let row of state.data) {
    var featureValues = [];
    featureValues.push(row[state.currentColumn]);

    var existingEntry = results.find(result => {
      return areArraysEqual(result.featureValues, featureValues);
    });

    if (!existingEntry) {
      existingEntry = {
        featureValues,
        labelCounts: { [row[state.labelColumn]]: 1 }
      };
      results.push(existingEntry);
    } else {
      if (!existingEntry.labelCounts[row[state.labelColumn]]) {
        existingEntry.labelCounts[row[state.labelColumn]] = 1;
      } else {
        existingEntry.labelCounts[row[state.labelColumn]]++;
      }
    }
  }

  // Now that we have all the counts of label values, we can determine the
  // corresponding percentage values.

  for (let result of results) {
    let totalCount = 0;
    for (let labelCount of Object.values(result.labelCounts)) {
      totalCount += labelCount;
    }
    result.labelPercents = {};
    for (let key of Object.keys(result.labelCounts)) {
      result.labelPercents[key] = Math.round(
        (result.labelCounts[key] / totalCount) * 100
      );
    }
  }

  // Take inventory of all unique label values we have seen, which allows us to
  // generate the header at the top of the CrossTab UI.

  const uniqueLabelValues = getUniqueOptions(state, state.labelColumn);

  return {
    results,
    uniqueLabelValues,
    featureNames: [state.currentColumn],
    labelName: state.labelColumn
  };
}

export function getScatterPlotData(state) {
  if (!state.labelColumn || !state.currentColumn) {
    return null;
  }

  if (
    !isColumnNumerical(state, state.labelColumn)
    || !isColumnNumerical(state, state.currentColumn)
  ) {
    return null;
  }

  if (state.labelColumn === state.currentColumn) {
    return null;
  }

  // For each row, record the X (feature value) and Y (label value).
  const data = [];
  for (let row of state.data) {
    data.push({ x: row[state.currentColumn], y: row[state.labelColumn] });
  }

  const label = state.labelColumn;
  const feature = state.currentColumn;

  return {
    label,
    feature,
    data
  };
}

function areArraysEqual(array1, array2) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => {
      return value === array2[index];
    })
  );
}

export function isUserUploadedDataset(state) {
  // The csvfile for internally curated datasets are strings; those uploaded by
  // users are objects. Use data type as a proxy to know which case we're in.
  return typeof state.csvfile === "object" && state.csvfile !== null;
}

export function getCorrectResults(state) {
  return getResultsByGrade(state, ResultsGrades.CORRECT);
}

export function getIncorrectResults(state) {
  return getResultsByGrade(state, ResultsGrades.INCORRECT);
}

function getResultsByGrade(state, grade) {
  const results = {};
  const accuracyGrades = getAccuracyGrades(state);
  const examples = getConvertedAccuracyCheckExamples(state).filter((example, index) => {
    return grade === accuracyGrades[index];
  });
  const labels = getConvertedLabels(state, state.accuracyCheckLabels).filter((example, index) => {
    return grade === accuracyGrades[index];
  });
  const predictedLabels = getConvertedLabels(state, state.accuracyCheckPredictedLabels).filter((example, index) => {
    return grade === accuracyGrades[index];
  });
  results.examples = examples;
  results.labels = labels;
  results.predictedLabels = predictedLabels;
  return results;
}

export function isSaveComplete(saveStatus) {
  return ["success", "failure"].includes(saveStatus);
}

export function shouldDisplaySaveStatus(saveStatus) {
  return ["success", "failure", "started"].includes(saveStatus);
}
