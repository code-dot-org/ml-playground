import I18n from "../i18n";

/* Helper functions for getting information about a column and its data. */

import { ColumnTypes, UNIQUE_OPTIONS_MAX } from "../constants";

export interface Extrema {
  max: number;
  min: number;
  range: number;
}

export function isColumnCategorical(state: any, column: string): boolean {
  return (state.columnsByDataType[column] === ColumnTypes.CATEGORICAL);
}

export function isColumnNumerical(state: any, column: string): boolean {
  return (state.columnsByDataType[column] === ColumnTypes.NUMERICAL);
}

export function filterColumnsByType(columnsByDataType: Record<string, string>, columnType: string): string[] {
  return Object.keys(columnsByDataType).filter(
    column => columnsByDataType[column] === columnType
  );
}
/*
  Categorical columns with too many unique values are unlikley to make
  accurate models, and we don't want to overflow the metadata column for saved
  models.
*/
export function tooManyUniqueOptions(uniqueOptionsCount: number): boolean {
  return uniqueOptionsCount > UNIQUE_OPTIONS_MAX;
}

export function getUniqueOptions(data: Record<string, any>[], column: string): any[] {
  const columnData = getColumnData(data, column);
  return Array.from(new Set(columnData)).filter(
    option => option !== undefined && option !== ""
  );
}

export function isColumnReadOnly(metadata: any, column: string): boolean {
  const metadataColumnType =
    column &&
    metadata &&
    metadata.fields &&
    metadata.fields.find((field: any) => {
      return field.id === column;
    }).type;
  return !!metadataColumnType;
}

function getColumnData(data: Record<string, any>[], column: string): any[] {
  return data.map(row => row[column]);
}

export function getExtrema(data: Record<string, any>[], column: string): Extrema {
  const columnData = getColumnData(data, column);
  const extrema: Extrema = {
    max: Math.max(...columnData),
    min: Math.min(...columnData),
    range: 0
  };
  extrema.range = Math.abs(extrema.max - extrema.min);

  return extrema;
}

export function containsOnlyNumbers(data: Record<string, any>[], column: string): boolean {
  const columnData = getColumnData(data, column);
  return columnData.every(cell => !isNaN(cell));
}

export function getColumnDescription(columnId: string, metadata: any, trainedModelDetails: any): string | null {
  // Use metadata if available.
  if (columnId && metadata && metadata.fields) {
    const field = metadata.fields.find((field: any) => {
      return field.id === columnId;
    });
    return getLocalizedColumnDescription(metadata.name, columnId, field.description);
  }

  // Try using a user-entered column description if available.
  if (trainedModelDetails && trainedModelDetails.columns) {
    const matchedColumn = trainedModelDetails.columns.find((column: any) => {
      return column.id === columnId;
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
export function buildOptionNumberKey(state: any, feature: string): Record<string, number> {
  const optionsMappedToNumbers: Record<string, number> = {};
  const uniqueOptions = getUniqueOptions(state.data, feature);
  uniqueOptions.forEach(
    (option: any) => (optionsMappedToNumbers[option] = uniqueOptions.indexOf(option))
  );
  return optionsMappedToNumbers;
}

export function getColumnDataToSave(state: any, column: string): any {
  const columnData: any = {};
  columnData.id = column;
  columnData.description = getColumnDescription(column, state.metadata, state.trainedModelDetails);
  if (isColumnCategorical(state, column)) {
    columnData.values = getUniqueOptions(state.data, column);
  } else if (isColumnNumerical(state, column)) {
    const {max, min} = getExtrema(state.data, column);
    columnData.max = max;
    columnData.min = min;
  }
  return columnData;
}

export function getLocalizedColumnName(datasetId: string, columnId: string): string {
  return getLocalizedColumnAttr(datasetId, columnId, "id", columnId);
}

function getLocalizedColumnDescription(datasetId: string, columnId: string, description: string): string {
  return getLocalizedColumnAttr(datasetId, columnId, "description", description);
}

function getLocalizedColumnAttr(datasetId: string, columnId: string, attribute: string, fallback: string): string {
  return I18n.t(attribute,
    {
      scope: ["datasets", datasetId, "fields", columnId],
      default: fallback
    }
  ) ?? fallback;
}
