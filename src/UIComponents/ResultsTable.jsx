/* React component to handle displaying test data and A.I. Bot's guesses. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { isRegression, setResultsHighlightRow } from "../redux";
import { styles, colors, REGRESSION_ERROR_TOLERANCE } from "../constants";

class ResultsTable extends Component {
  static propTypes = {
    selectedFeatures: PropTypes.array,
    labelColumn: PropTypes.string,
    results: PropTypes.object,
    isRegression: PropTypes.bool,
    setResultsHighlightRow: PropTypes.func,
    resultsHighlightRow: PropTypes.number
  };

  getRowCellStyle = index => {
    return {
      ...styles.tableCell,
      ...(index === this.props.resultsHighlightRow &&
        styles.resultsCellHighlight)
    };
  };

  render() {
    const { setResultsHighlightRow } = this.props;
    const featureCount = this.props.selectedFeatures.length;

    return (
      <div style={styles.panel}>
        {this.props.isRegression && (
          <div style={styles.smallTextRight}>
            {`Predictions are +/- ${REGRESSION_ERROR_TOLERANCE}% of range`}
          </div>
        )}

        <div style={styles.tableParent}>
          <table style={styles.displayTable}>
            <thead>
              <tr>
                <th
                  colSpan={featureCount}
                  style={{
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  Features
                </th>
                <th
                  style={{
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  Actual
                </th>
                <th
                  style={{
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  A.I. Prediction
                </th>
              </tr>
              <tr>
                {this.props.selectedFeatures.map((feature, index) => {
                  return (
                    <th
                      style={{
                        ...styles.tableHeader,
                        backgroundColor: colors.feature,
                        ...styles.resultsTableSecondHeader
                      }}
                      key={index}
                    >
                      {feature}
                    </th>
                  );
                })}
                <th
                  style={{
                    ...styles.tableHeader,
                    backgroundColor: colors.label,
                    ...styles.resultsTableSecondHeader
                  }}
                >
                  {this.props.labelColumn}
                </th>
                <th
                  style={{
                    ...styles.tableHeader,
                    backgroundColor: colors.label,
                    ...styles.resultsTableSecondHeader
                  }}
                >
                  {this.props.labelColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.results.examples.map((examples, index) => {
                return (
                  <tr
                    key={index}
                    onMouseEnter={() => setResultsHighlightRow(index)}
                    onMouseLeave={() => setResultsHighlightRow(undefined)}
                  >
                    {examples.map((example, i) => {
                      return (
                        <td style={this.getRowCellStyle(index)} key={i}>
                          {example}
                        </td>
                      );
                    })}
                    <td style={this.getRowCellStyle(index)}>
                      {this.props.results.labels[index]}
                    </td>
                    <td style={this.getRowCellStyle(index)}>
                      {this.props.results.predictedLabels[index]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    selectedFeatures: state.selectedFeatures,
    labelColumn: state.labelColumn,
    isRegression: isRegression(state),
    resultsHighlightRow: state.resultsHighlightRow
  }),
  dispatch => ({
    setResultsHighlightRow(column) {
      dispatch(setResultsHighlightRow(column));
    }
  })
)(ResultsTable);
