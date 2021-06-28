/* Helper functions for getting information about a column and its data. */

import { ColumnTypes, UNIQUE_OPTIONS_MAX } from "../constants.js";

export function isColumnCategorical(state, column) {
  return (state.columnsByDataType[column] === ColumnTypes.CATEGORICAL);
}

export function isColumnNumerical(state, column) {
  return (state.columnsByDataType[column] === ColumnTypes.NUMERICAL);
}

/*
  Categorical columns with too many unique values are unlikley to make
  accurate models, and we don't want to overflow the metadata column for saved
  models.
*/
export function hasTooManyUniqueOptions(uniqueOptionsCount) {
  return uniqueOptionsCount > UNIQUE_OPTIONS_MAX;
}

export function getUniqueOptions(data, column) {
  return Array.from(new Set(data.map(row => row[column]))).filter(
    option => option !== undefined && option !== ""
  );
}

function isValidCategoricalData(state, column) {
  return !hasTooManyUniqueOptions(state, column);
}

export function containsOnlyNumbers(currentColumnData) {
  return currentColumnData.every(cell => !isNaN(cell));
}

function isValidNumericalData(state, column) {
  return columnContainsOnlyNumbers(state.data, column);
}

export function isColumnDataValid(state, column) {
  return (
    isColumnCategorical(state, column) && isValidCategoricalData(state,column)
  ) ||
  (isColumnNumerical(state, column) && isValidNumericalData(state, column));
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

export function isSelectable(state, column) {
  return isColumnDataValid(state, column) && !isSelected(state, column);
}

export function isColumnReadOnly(metadata, column) {
  const metadataColumnType =
    metadata &&
    metadata.fields &&
    metadata.fields.find(field => {
      return field.id === column;
    }).type;
  return !!metadataColumnType;
}

function getColumnData(data, column) {
  return data.map(row => row[column]);
}

export function getExtrema(columnData) {
  let extrema = {};
  extrema.max = Math.max(...columnData);
  extrema.min = Math.min(...columnData);
  extrema.range = Math.abs(extrema.max - extrema.min);

  return extrema;
}

export function getColumnDescription(column, metadata, trainedModelDetails) {
  // Use metadata if available.
  if (metadata && metadata.fields) {
    const field = metadata.fields.find(field => {
      return field.id === column;
    });
    return field.description;
  }

  // Try using a user-entered column description if available.
  if (trainedModelDetails && trainedModelDetails.columns) {
    const matchedColumn = trainedModelDetails.columns.find(column => {
      return column.id === column;
    });
    if (matchedColumn) {
      return matchedColumn.description;
    }
  }

  // No column description available.
  return null;
}

/* Builds a hash that maps a feature's categorical options to numbers because
  the ML algorithms only accept numerical inputs.
  @param {string} - feature name
  @return {
    option1 : 0,
    option2 : 1,
    option3: 2,
    ...
  }
  */
export function buildOptionNumberKey(state, feature) {
  let optionsMappedToNumbers = {};
  const uniqueOptions = getUniqueOptions(state.data, feature);
  uniqueOptions.forEach(
    option => (optionsMappedToNumbers[option] = uniqueOptions.indexOf(option))
  );
  return optionsMappedToNumbers;
}

export function getColumnDataToSave(state, column) {
  const columnData = {};
  columnData.id = column;
  columnData.description = getColumnDescription(state, column);
  if (isColumnCategorical(state, column)) {
    columnData.values = getUniqueOptions(state.data, column);
  } else if (isColumnNumerical(state, column)) {
    const {max, min} = getExtrema(state.data, column);
    columnData.max = max;
    columnData.min = min;
  }
  return columnData;
}
