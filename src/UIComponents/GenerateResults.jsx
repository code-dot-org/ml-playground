/* React component to handle training. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { readyToTrain } from "../redux";
import { styles, getFadeOpacity } from "../constants";
import aiBotClosed from "@public/images/ai-bot/ai-bot-closed.png";
import blueScanner from "@public/images/ai-bot/blue-scanner.png";
import background from "@public/images/results-background-light.png";
import DataTable from "./DataTable";

const framesPerCycle = 80;
const numItems = 7;

class GenerateResults extends Component {
  static propTypes = {
    data: PropTypes.array,
    readyToTrain: PropTypes.bool,
    modelSize: PropTypes.number,
    labelColumn: PropTypes.string,
    selectedFeatures: PropTypes.array,
    instructionsOverlayActive: PropTypes.bool
  };

  state = {
    frame: 0,
    animationTimer: undefined,
    headOpen: false
  };

  constructor(props) {
    super(props);

    this.state = {
      frame: 0,
      animationTimer: undefined,
      finished: false
    };
  }

  componentDidMount() {
    const animationTimer = setInterval(
      this.updateAnimation.bind(this),
      1000 / 30
    );

    this.setState({ animationTimer });
  }

  getAnimationSubstep = () => {
    return this.state.frame % framesPerCycle;
  };

  updateAnimation = () => {
    if (this.getAnimationStep() >= numItems) {
      this.setState({ finished: true });
    }

    if (!this.props.instructionsOverlayActive) {
      this.setState({ frame: this.state.frame + 1 });
    }
  };

  componentWillUnmount = () => {
    if (this.state.animationTimer) {
      clearInterval(this.state.animationTimer);
      this.setState({ animationTimer: undefined });
    }
  };

  getAnimationProgess = () => {
    let amount = (2 * (this.state.frame % framesPerCycle)) / framesPerCycle;
    amount -= Math.sin(amount * 2 * Math.PI) / (2 * Math.PI);
    return amount / 2;
  };

  getAnimationStep = () => {
    return Math.floor(this.state.frame / framesPerCycle);
  };

  render() {
    const animationProgress = this.getAnimationProgess();
    const translateX = 30 + animationProgress * 40;
    const translateY = 15;
    const rotateZ = 5 + animationProgress * -10;
    const transform = `translateX(-50%) translateY(-50%) rotateZ(${rotateZ}deg)`;
    const opacity = getFadeOpacity(animationProgress);
    const hideLabel = this.getAnimationSubstep() < framesPerCycle / 2;
    const showAnimation = this.getAnimationStep() < numItems;
    const botImage = aiBotClosed;
    const maxFrames = framesPerCycle * (numItems - 1.5);
    const tableOpacity =
      this.state.frame < framesPerCycle
        ? this.state.frame / framesPerCycle
        : this.state.frame >= maxFrames &&
          this.state.frame < maxFrames + framesPerCycle
        ? 1 - (this.state.frame - maxFrames) / framesPerCycle
        : this.state.frame >= maxFrames + framesPerCycle
        ? 0
        : 1;

    // Let's still show the starting row on our very first frame, because we might
    // be paused waiting for the overlay to be dismissed.
    const startingRow =
      this.state.frame === 0 ? undefined : this.getAnimationStep();

    return (
      <div
        id="train-model"
        style={{
          ...styles.panel,
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + background + ")"
        }}
      >
        <div style={styles.statement}>Testing accuracy</div>

        <div style={styles.generateResultsContainer}>
          <div
            style={{
              ...styles.generateResultsDataTable,
              opacity: tableOpacity
            }}
          >
            <DataTable
              reducedColumns={true}
              startingRow={startingRow}
              noLabel={true}
            />
          </div>

          {showAnimation && (
            <div
              style={{
                position: "absolute",
                transformOrigin: "center center",
                bottom: translateY + "%",
                left: translateX + "%",
                transform: transform,
                opacity: opacity * tableOpacity,
                zIndex: 1
              }}
            >
              <DataTable
                reducedColumns={true}
                singleRow={this.getAnimationStep()}
                hideLabel={hideLabel}
              />
            </div>
          )}
        </div>

        {this.props.readyToTrain && (
          <div style={styles.generateResultsBotContainer}>
            <div style={{ ...styles.trainBot, margin: "0 auto" }}>
              <div>
                <img src={botImage} style={styles.trainBotBody} />
              </div>
              <div style={{ width: 150 }}>
                <img
                  src={blueScanner}
                  style={{ width: "100%", opacity: tableOpacity }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  readyToTrain: readyToTrain(state),
  modelSize: state.modelSize,
  labelColumn: state.labelColumn,
  selectedFeatures: state.selectedFeatures,
  instructionsOverlayActive: state.instructionsOverlayActive
}))(GenerateResults);