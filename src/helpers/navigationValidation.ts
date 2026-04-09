import I18n from "../i18n";
/*
Validation checks to determine if app set up is ready for machine learning
training. Panels prompt users to incrementally complete actions in preparation
for training. Navigation is blocked if the user has not yet completed the
action for a given panel.
*/

/*
const panelList = [
  { id: "selectDataset", label: "Import" },
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
export function isPanelEnabled(state: any, panelId: string): boolean {
  if (panelId === "dataDisplayLabel") {
    if (!isDataUploaded(state)) {
      return false;
    }
  }

  if (panelId === "dataDisplayFeatures") {
    if (!labelSelected(state)) {
      return false;
    }
  }

  if (panelId === "selectFeatures") {
    if (!minOneFeatureSelected(state)) {
      return false;
    }
  }

  if (panelId === "trainModel") {
    if (!uniqLabelFeaturesSelected(state)) {
      return false;
    }
  }

  if (panelId === "results") {
    if (!resultsAvailable(state)) {
      return false;
    }
  }

  if (panelId === "modelSummary") {
    if (isSaveInProgress(state)) {
      return false;
    }

    if (!isModelNamed(state)) {
      return false;
    }
  }

  return true;
}

// Is a panel available to be shown?  This determines what panels
// can possibly be visited in the app.
function isPanelAvailable(state: any, panelId: string): boolean {
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
    if ((mode && mode.hideSave) || didSaveSucceed(state)) {
      return false;
    }
  }

  return true;
}

function isDataUploaded(state: any): boolean {
  return state.data.length > 0 && !state.invalidData;
}

function minOneFeatureSelected(state: any): boolean {
  return state.selectedFeatures.length !== 0;
}

function labelSelected(state: any): boolean {
  return !!state.labelColumn;
}

export function uniqLabelFeaturesSelected(state: any): boolean {
  return (
    minOneFeatureSelected(state) &&
    labelSelected(state) &&
    !state.selectedFeatures.includes(state.labelColumn)
  );
}

function resultsAvailable(state: any): boolean {
  if (state.accuracyCheckExamples.length === 0) {
    return false;
  }
  return !didSaveSucceed(state) || !isSaveInProgress(state);
}

function isSaveInProgress(state: any): boolean {
  return state.saveStatus === "started";
}

function didSaveSucceed(state: any): boolean {
  return state.saveStatus === "success";
}

export function isSaveComplete(saveStatus: string): boolean {
  return ["success", "failure", "piiProfanity"].includes(saveStatus);
}

export function shouldDisplaySaveStatus(saveStatus: string): boolean {
  return ["success", "failure", "started", "piiProfanity"].includes(saveStatus);
}

function isModelNamed(state: any): boolean {
  return ![undefined, ""].includes(state.trainedModelDetails.name);
}

function isAccuracyAcceptable(state: any): boolean {
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
interface NavButton {
  panel: string;
  text: string;
  enabled?: boolean;
}

interface PrevNextButtons {
  prev: NavButton | null | undefined;
  next: NavButton | null | undefined;
}

export function prevNextButtons(state: any): PrevNextButtons {
  let prev: NavButton | null | undefined, next: NavButton | null | undefined;

  if (state.currentPanel === "selectDataset") {
    prev = null;
    next = isPanelAvailable(state, "dataDisplayLabel")
      ? { panel: "dataDisplayLabel", text: I18n.t("navigateForward") }
      : isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: I18n.t("navigateForward") }
      : null;
  } else if (state.currentPanel === "dataDisplayLabel") {
    prev = isPanelAvailable(state, "selectDataset")
      ? { panel: "selectDataset", text: I18n.t("navigateBack") }
      : null;
    next = isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: I18n.t("navigateForward") }
      : null;
  } else if (state.currentPanel === "dataDisplayFeatures") {
    prev = isPanelAvailable(state, "dataDisplayLabel")
      ? { panel: "dataDisplayLabel", text: I18n.t("navigateBack") }
      : null;
    next = isPanelAvailable(state, "trainModel")
      ? { panel: "trainModel", text: I18n.t('trainModelButtonText') }
      : null;
  } else if (state.currentPanel === "trainModel") {
    if (state.trainedModel) {
      prev = null;
      next = { panel: "generateResults", text: I18n.t("navigateForward") };
    }
  } else if (state.currentPanel === "generateResults") {
    if (state.trainedModel) {
      prev = null;
      next = { panel: "results", text: I18n.t("navigateForward") };
    }
  } else if (state.currentPanel === "results") {
    prev = isPanelAvailable(state, "dataDisplayFeatures")
      ? { panel: "dataDisplayFeatures", text: I18n.t("tryAgain") }
      : null;
    next = !isAccuracyAcceptable(state)
      ? null
      : isPanelAvailable(state, "saveModel")
      ? { panel: "saveModel", text: I18n.t("navigateForward") }
      : { panel: "continue", text: I18n.t("navigateDone") };
  } else if (state.currentPanel === "saveModel") {
    prev = { panel: "results", text: I18n.t("navigateBack") };
    next = isPanelAvailable(state, "modelSummary")
      ? { panel: "modelSummary", text: I18n.t("saveProgress") }
      : null;
  } else if (state.currentPanel === "modelSummary") {
    prev = isPanelAvailable(state, "saveModel")
      ? { panel: "saveModel", text: I18n.t("navigateBack") }
      : null;
    next = isPanelAvailable(state, "finish")
      ? { panel: "finish", text: I18n.t("navigateDone") }
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
