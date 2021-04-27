import "./assetPath";
import { initAll } from "./index";
import queryString from "query-string";

// A list of sample modes.  Should match the dropdown in index.html.
const sampleModes = {
  minimal: {
    datasets: ["tacos_toy"],
    hideSpecifyColumns: true,
    hideSelectTrainer: "knnClassify",
    hideChooseReserve: true,
    hideModelCard: true,
    hideColumnClicking: true,
    hideSelectLabel: true
  },

  "preload-metadata": {
    hideSpecifyColumns: true,
    hideSelectTrainer: "knnClassify",
    hideChooseReserve: true
  },

  "intro-ai-tacos": {
    datasets: ["tacos_toy"],
    hideSelectLabel: true,
    hideSpecifyColumns: true,
    hideChooseReserve: true,
    hideModelCard: true,
    hideSave: true
  },

  "intro-ai-foods": {
    datasets: [
      "boba_toy",
      "cookies_toy",
      "naan_toy",
      "poke_toy",
      "poutine_toy",
      "raspado_toy",
      "salad_toy",
      "salsa_toy"
    ],
    hideSelectLabel: true,
    hideSpecifyColumns: true,
    hideChooseReserve: true,
    hideModelCard: true,
    hideSave: true
  },

  safari: {
    datasets: ["safari_toy"],
    hideSelectLabel: true,
    hideSpecifyColumns: true,
    hideChooseReserve: true,
    hideModelCard: true,
    hideSave: true,
    hideSelectTrainer: "knnRegress"
  },

  zoo: {
    datasets: ["zoo"],
    hideSpecifyColumns: true,
    hideChooseReserve: true
  },

  "final-project": {}
};

// Look for a ?mode= parameter on the URL
let parameters = queryString.parse(location.search);
const mode = parameters["mode"] ? sampleModes[parameters["mode"]] : null;

function onContinueStub() {
  console.log("This would continue to the next level.");
}

function saveTrainedModelStub(data, response) {
  console.log("This would save a trained model.", data);
  setTimeout(
    () => response({ id: 303, status: "success" }),
    2000
  );
}

function setInstructionsKeyStub(instructionsKey) {
  document.getElementById("instructions").innerText = instructionsKey;
}

// Initialize the app.
initAll({
  mode: mode,
  onContinue: onContinueStub,
  saveTrainedModel: saveTrainedModelStub,
  setInstructionsKey: setInstructionsKeyStub
});
