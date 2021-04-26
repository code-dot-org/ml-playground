/* Training and prediction using a multiclassification KNN machine learning model from
https://github.com/mljs/knn */

import { store } from "../index.js";
import {
  setModelSize,
  setTrainedModel,
  setPrediction,
  setAccuracyCheckPredictedLabels,
  getSummaryStat,
  setHistoricResult
} from "../redux";
import {
  ResultsGrades
} from "../constants.js";

const KNN = require("ml-knn");

export default class KNNTrainer {
  startTraining() {
    const state = store.getState();
    let bestAccuracy = -1;
    let bestK = -1;
    let bestModel = null;

    for (var proposedK = 1; proposedK <= 20; proposedK++) {
      this.knn = new KNN(state.trainingExamples, state.trainingLabels, {
        k: proposedK
      });
      var model = this.knn.toJSON();

      let predictedLabels;

      if (state.accuracyCheckExamples.length > 0) {
        predictedLabels = this.batchPredict(state.accuracyCheckExamples);
      } else {
        store.dispatch(setAccuracyCheckPredictedLabels([]));
      }

      const accuracy = this.getAccuracyClassification(state, predictedLabels);

      if (accuracy.percentCorrect > bestAccuracy) {
        bestAccuracy = accuracy.percentCorrect;
        bestK = proposedK;
      }

      console.log(proposedK, accuracy.percentCorrect);
    }

    store.dispatch(setTrainedModel(bestModel));
    const size = Buffer.byteLength(JSON.stringify(bestModel));
    const kiloBytes = size / 1024;

    setTimeout(() => {
      store.dispatch(setModelSize(kiloBytes));
    }, 3000);

    console.log("bestAccuracy", bestAccuracy, bestK);

    const state2 = store.getState();

    const accuracy = getSummaryStat(state2).stat;
    store.dispatch(
      setHistoricResult(state2.labelColumn, state2.selectedFeatures, accuracy)
    );

  }

  getAccuracyClassification(state, accuracyCheckPredictedLabels) {
    let accuracy = {};
    let numCorrect = 0;
    let grades = [];
    const numPredictedLabels = accuracyCheckPredictedLabels.length;
    for (let i = 0; i < numPredictedLabels; i++) {
      if (
        state.accuracyCheckLabels[i].toString() ===
        accuracyCheckPredictedLabels[i].toString()
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

  batchPredict(accuracyCheckExamples) {
    const predictedLabels = this.knn.predict(accuracyCheckExamples);
    store.dispatch(setAccuracyCheckPredictedLabels(predictedLabels));
    return predictedLabels;
  }

  predict(testValues) {
    let prediction = {};
    prediction.predictedLabel = this.knn.predict([testValues])[0];
    store.dispatch(setPrediction(prediction));
  }
}
