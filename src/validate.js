/* Validation checks to determine if app set up is ready for machine learning training */

import { ColumnTypes } from "./constants.js";
import { getSelectedNumericalColumns } from "./redux.js";

// Checks to see if there is any data.
// @return {boolean}
export function datasetUploaded(state) {
  return state.data.length > 0;
}

// Gets the names of each column in the dataset.
// @return {array} of {string} column names
export function getColumnNames(state) {
  const columnNames = datasetUploaded(state) ? Object.keys(state.data[0]) : [];
  return columnNames;
}

// Checks that each column is named.
// @return {boolean}
export function columnsNamed(state) {
  const columnNames = getColumnNames(state);
  return (
    columnNames.length > 0 &&
    !columnNames.includes("") &&
    !columnNames.includes(undefined)
  );
}

// Checks that each column is named, and that the names are unique.
// @return {boolean}
export function uniqueColumnNames(state) {
  const columnNames = getColumnNames(state);
  const uniqueColumnNames = columnNames.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  return columnsNamed(state) && columnNames.length === uniqueColumnNames.length;
}

/* Iterates through the data and tracks location of empty cells.
  @return {array} of {objects} indicating where the empty cells are.
  [
    {
      row: index,
      column: columnName
    }
  ]
*/
export function emptyCellFinder(state) {
  let columns = getColumnNames(state);
  let emptyCells = [];
  state.data.forEach(function(row, i) {
    columns.forEach(function(column) {
      if (row[column] === "" || row[column] === undefined) {
        emptyCells.push({ row: i + 1, column: column });
      }
    });
  });
  return emptyCells;
}

// Checks if there are any identified empty cells in dataset.
// @return {boolean}
export function noEmptyCells(state) {
  return datasetUploaded(state) && emptyCellFinder(state).length === 0;
}

// Checks if at least one feature is selected.
// @return {boolean}
export function minOneFeatureSelected(state) {
  return state.selectedFeatures.length !== 0;
}

// Checks if one label is selected.
// @return {boolean}
export function oneLabelSelected(state) {
  return !!state.labelColumn;
}

// Checks that the same column is not selected as both a label and a feature.
// @return {boolean}
export function uniqLabelFeaturesSelected(state) {
  return (
    minOneFeatureSelected(state) &&
    oneLabelSelected(state) &&
    !state.selectedFeatures.includes(state.labelColumn)
  );
}

// Check that each feature column and the label column contain numerical or
// categorical data, not "Other".
// @return {boolean}
export function selectedColumnsHaveDatatype(state) {
  const selectedColumns = state.selectedFeatures
    .concat(state.labelColumn)
    .filter(column => column !== undefined && column !== "");
  let columnTypesOk = true;
  for (const column of selectedColumns) {
    if (state.columnsByDataType[column] === ColumnTypes.OTHER) {
      columnTypesOk = false;
      return columnTypesOk;
    }
  }
  return selectedColumns.length > 0 && columnTypesOk;
}

// Check that selected numerical columns only contain numbers.
// @return {boolean}
export function numericalColumnsHaveOnlyNumbers(state) {
  const columns = getSelectedNumericalColumns(state);
  let allNumbers = true;
  state.data.forEach(function(row, i) {
    for (const column of columns) {
      if (isNaN(parseFloat(row[column]))) {
        allNumbers = false;
        return allNumbers;
      }
    }
  });
  return columns.length === 0 || allNumbers;
}

/* Checks that the model is named. */
export function namedModel(state) {
  const name = state.trainedModelDetails.name;
  return !!name;
}
