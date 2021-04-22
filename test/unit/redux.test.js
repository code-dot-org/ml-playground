import {
  getRange,
  getAccuracyRegression,
  getAccuracyClassification
} from '../../src/redux.js';

import { ResultsGrades } from '../../src/constants.js';

const initialState = {
  data: [
    {
      name: 'Plain M&Ms',
      chocolate: 'yes',
      nuts: 'no',
      fruity: 'no',
      delicious: 'yes'
    },
    {
      name: 'Peanut M&Ms',
      chocolate: 'yes',
      nuts: 'yes',
      fruity: 'no',
      delicious: 'yes'
    },
    {
      name: 'Snickers',
      chocolate: 'yes',
      nuts: 'yes',
      fruity: 'no',
      delicious: 'yes'
    },
    {
      name: 'Almond Joy',
      chocolate: 'yes',
      nuts: 'yes',
      fruity: 'no',
      delicious: 'yes'
    },
    {
      name: 'Black Licorice',
      chocolate: 'no',
      nuts: 'no',
      fruity: 'no',
      delicious: 'no'
    },
    {
      name: 'Skittles',
      chocolate: 'no',
      nuts: 'no',
      fruity: 'yes',
      delicious: 'yes'
    }
  ],
  labelColumn: 'delicious',
  selectedFeatures: ['chocolate', 'nuts'],
  columnsByDataType: {
    chocolate: 'categorical',
    nuts: 'categorical',
    delicious: 'categorical'
  }
};

const resultsState = {
  data: [
    {
      sun: 'high',
      height: 3.8
    },
    {
      sun: 'high',
      height: 3.9
    },
    {
      sun: 'medium',
      height: 2.6
    },
    {
      sun: 'medium',
      height: 2.5
    },
    {
      sun: 'low',
      height: 0.9
    },
    {
      sun: 'low',
      height: 1.6
    }
  ],
  labelColumn: 'height',
  labelColumnCategorical: 'sun',
  accuracyCheckPredictedLabels: [4.0, 3.75, 2.63, 2.46, 1.6, 1.0],
  accuracyCheckLabels: [3.9, 3.8, 2.6, 2.5, 1.6, 0.9]
};

const resultsStateClassification = {
  data: [
    {
      weather: 'sunny',
      temp: 'hot',
      play: 'no'
    },
    {
      weather: 'overcast',
      temp: 'hot',
      play: 'yes'
    },
    {
      weather: 'overcast',
      temp: 'mild',
      play: 'yes'
    },
    {
      weather: 'overcast',
      temp: 'cool',
      play: 'yes'
    },
    {
      weather: 'rainy',
      temp: 'mild',
      play: 'yes'
    },
    {
      weather: 'rainy',
      temp: 'cool',
      play: 'no'
    }
  ],
  labelColumn: 'play',
  selectedFeatures: ['temp', 'weather'],
  columnsByDataType: {
    weather: 'categorical',
    temp: 'categorical',
    play: 'categorical'
  },
  accuracyCheckLabels: ['no', 'yes', 'yes', 'yes', 'yes', 'no']
};

describe('redux functions', () => {
  test('getAccuracyClassification - all accurate', async () => {
    const mockState = resultsStateClassification;
    mockState.accuracyCheckPredictedLabels = [
      'no',
      'yes',
      'yes',
      'yes',
      'yes',
      'no'
    ];
    const accuracy = getAccuracyClassification(mockState);
    expect(accuracy.grades).toEqual([
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT
    ]);
    expect(accuracy.percentCorrect).toBe('100.00');
  });

  test('getAccuracyClassification - mostly accurate', async () => {
    const mockState = resultsStateClassification;
    mockState.accuracyCheckPredictedLabels = [
      'no',
      'yes',
      'yes',
      'yes',
      'yes',
      'yes'
    ];
    const accuracy = getAccuracyClassification(mockState);
    expect(accuracy.grades).toEqual([
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.INCORRECT
    ]);
    expect(accuracy.percentCorrect).toBe('83.33');
  });

  test('getAccuracyClassification - not very accuracy', async () => {
    const mockState = resultsStateClassification;
    mockState.accuracyCheckPredictedLabels = [
      'yes',
      'yes',
      'yes',
      'no',
      'no',
      'yes'
    ];
    const accuracy = getAccuracyClassification(mockState);
    expect(accuracy.grades).toEqual([
      ResultsGrades.INCORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT
    ]);
    expect(accuracy.percentCorrect).toBe('33.33');
  });

  test('getAccuracyClassification - 0% accuracy', async () => {
    const mockState = resultsStateClassification;
    mockState.accuracyCheckPredictedLabels = [
      'yes',
      'no',
      'no',
      'no',
      'no',
      'yes'
    ];
    const accuracy = getAccuracyClassification(mockState);
    expect(accuracy.grades).toEqual([
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT,
      ResultsGrades.INCORRECT
    ]);
    expect(accuracy.percentCorrect).toBe('0.00');
  });

  test('getAccuracyRegression', async () => {
    const maxMin = getRange(resultsState, resultsState.labelColumn);
    const range = Math.abs(maxMin.max - maxMin.min);
    expect(range).toBe(3);
    const accuracy = getAccuracyRegression(resultsState);
    expect(accuracy.grades).toEqual([
      ResultsGrades.INCORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.CORRECT,
      ResultsGrades.INCORRECT
    ]);
    // error tolerance of +/- 0.09, 4/6 correct
    expect(accuracy.percentCorrect).toBe('66.67');
  });
});
