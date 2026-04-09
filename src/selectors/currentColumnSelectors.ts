import { createSelector } from 'reselect';
import {
  getUniqueOptions,
  getExtrema,
  isColumnReadOnly,
  getColumnDescription,
  tooManyUniqueOptions,
  containsOnlyNumbers
} from '../helpers/columnDetails';
import {
  getSelectedColumns,
  getData,
  getColumnsByDataType,
  getMetadata,
  getTrainedModelDetails
 } from '../selectors';
import { ColumnTypes } from "../constants";

export const getCurrentColumn = (state: any): string | undefined => state.currentColumn;

export const getCurrentColumnDetails = createSelector(
  [
    getCurrentColumn,
    (state: any) => isCurrentColumnReadOnly(state),
    getColumnsByDataType,
    (state: any) => getCurrentColumnDescription(state),
    (state: any) => isCurrentColumnSelectable(state)
  ],
  (
    currentColumn: string | undefined,
    isReadOnly: boolean,
    columnsByDataType: Record<string, string>,
    description: string | undefined,
    isSelectable: boolean
  ): any => {
    if (currentColumn) {
      return {
        id: currentColumn,
        readOnly: isReadOnly,
        dataType: columnsByDataType[currentColumn],
        description: description,
        isSelectable: isSelectable
      };
    }
  }
)

export const isCurrentColumnReadOnly = createSelector(
  [getCurrentColumn, getMetadata],
  (currentColumn: string | undefined, metadata: any): boolean => {
    return isColumnReadOnly(metadata, currentColumn!)
  }
)

export const getCurrentColumnDescription = createSelector(
  [getCurrentColumn, getMetadata, getTrainedModelDetails],
  (currentColumn: string | undefined, metadata: any, trainedModelDetails: any): string | undefined => {
    return currentColumn ? getColumnDescription(currentColumn, metadata, trainedModelDetails) ?? undefined : undefined;
  }
)

export const isCurrentColumnSelectable = createSelector(
  [
    (state: any) => isCurrentColumnSelected(state),
    (state: any) => isValidData(state)
  ],
  (selected: boolean, isValidData: boolean): boolean => {
    return !selected && isValidData;
  }
)

export const isCurrentColumnSelected = createSelector(
  [getSelectedColumns, getCurrentColumn],
  (selectedColumns: string[], currentColumn: string | undefined): boolean => {
    return !!currentColumn && selectedColumns.includes(currentColumn);
  }
)

export const isValidData = createSelector(
  [
    (state: any) => isValidNumericalData(state),
    (state: any) => isValidCategoricalData(state)
  ],
  (isValidNumericalData: boolean, isValidCategoricalData: boolean): boolean => {
    return isValidNumericalData || isValidCategoricalData;
  }
)

export const getNumericalColumnDetails = createSelector(
  [
    getCurrentColumn,
    (state: any) => currentColumnIsNumerical(state),
    (state: any) => getExtremaCurrentColumn(state),
    (state: any) => currentColumnContainsOnlyNumbers(state)
  ],
  (
    currentColumn: string | undefined,
    isNumerical: boolean,
    extrema: any,
    containsOnlyNumbers: boolean
  ): any => {
    const numericalColumnDetails: any = {};
    numericalColumnDetails.id = currentColumn;
    if (isNumerical) {
      numericalColumnDetails.extrema = extrema;
      numericalColumnDetails.containsOnlyNumbers = containsOnlyNumbers;
    }
    return numericalColumnDetails;
  }
)

export const currentColumnIsNumerical = createSelector(
  [getCurrentColumn, getColumnsByDataType],
  (currentColumn: string | undefined, columnsByDataType: Record<string, string>): boolean => {
    return columnsByDataType[currentColumn!] === ColumnTypes.NUMERICAL;
  }
)

export const getExtremaCurrentColumn = createSelector(
  [getCurrentColumn, getData],
  (currentColumn: string | undefined, data: any[]): any => {
    return getExtrema(data, currentColumn!);
  }
)

export const currentColumnContainsOnlyNumbers = createSelector(
  [getCurrentColumn, getData],
  (currentColumn: string | undefined, data: any[]): boolean => {
    return containsOnlyNumbers(data, currentColumn!);
  }
)

export const isValidNumericalData = createSelector(
  [currentColumnIsNumerical, currentColumnContainsOnlyNumbers],
  (isNumerical: boolean, containsOnlyNumbers: boolean): boolean => {
    return isNumerical && containsOnlyNumbers;
  }
)

export const getCategoricalColumnDetails = createSelector(
  [
    getCurrentColumn,
    (state: any) => currentColumnIsCategorical(state),
    (state: any) => getUniqueOptionsCurrentColumn(state),
    (state: any) => getOptionFrequenciesCurrentColumn(state)
  ],
  (
    currentColumn: string | undefined,
    isCategorical: boolean,
    uniqueOptions: string[],
    uniqueOptionFrequencies: Record<string, number>
  ): any => {
    const categeoricalColumnDetails: any = {};
    categeoricalColumnDetails.id = currentColumn;
    if (isCategorical) {
      categeoricalColumnDetails.uniqueOptions = uniqueOptions;
      categeoricalColumnDetails.frequencies = uniqueOptionFrequencies;
    }
    return categeoricalColumnDetails;
  }
)

export const getUniqueOptionsCurrentColumn = createSelector(
  [getCurrentColumn, getData],
  (currentColumn: string | undefined, data: any[]): string[] => {
    return getUniqueOptions(data, currentColumn!).sort()
  }
)

export const getOptionFrequenciesCurrentColumn = createSelector(
  [getCurrentColumn, getData],
  (currentColumn: string | undefined, data: any[]): Record<string, number> => {
    const optionFrequencies: Record<string, number> = {};
    for (const row of data) {
      if (optionFrequencies[row[currentColumn!]]) {
        optionFrequencies[row[currentColumn!]]++;
      } else {
        optionFrequencies[row[currentColumn!]] = 1;
      }
    }
    return optionFrequencies;
  }
)

export const currentColumnIsCategorical = createSelector(
  [getCurrentColumn, getColumnsByDataType],
  (currentColumn: string | undefined, columnsByDataType: Record<string, string>): boolean => {
    return columnsByDataType[currentColumn!] === ColumnTypes.CATEGORICAL;
  }
)

export const hasTooManyUniqueOptions = createSelector(
  [getUniqueOptionsCurrentColumn, currentColumnIsCategorical],
  (uniqueOptions: string[], isCategorical: boolean): boolean => {
    return isCategorical && tooManyUniqueOptions(uniqueOptions.length);
  }
)

export const isValidCategoricalData = createSelector(
  [currentColumnIsCategorical, getUniqueOptionsCurrentColumn],
  (isCategorical: boolean, uniqueOptions: string[]): boolean => {
    return isCategorical && !tooManyUniqueOptions(uniqueOptions.length);
  }
)
