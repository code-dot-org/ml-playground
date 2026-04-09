/*
  Functions for logging analytics metrics via Google Analytics and Firehose.
*/
import { isUserUploadedDataset } from "./datasetDetails";
import { getPercentCorrect } from './accuracy';

function getModelMetrics(state: any): Record<string, any> {
  const modelMetrics: Record<string, any> = {};
  modelMetrics.userUploaded = isUserUploadedDataset(state);
  modelMetrics.datasetName = state.metadata.name;
  modelMetrics.features = state.selectedFeatures;
  modelMetrics.label = state.labelColumn;
  modelMetrics.accuracy = getPercentCorrect(state);
  return modelMetrics;
}

export function logFirehoseMetric(action: string, state: any): any {
  return state.firehoseMetricsLogger(action, getModelMetrics(state));
}

export function reportPanelView(panel: string): void {
  if (!(window as any).ga || !panel) {
    return;
  }
  // Record each panel as a different page view in Google Analytics.
  const syntheticPagePath = window.location.pathname + '/' + panel;
  (window as any).ga('set', 'page', syntheticPagePath);
  (window as any).ga('send', 'pageview');
}
