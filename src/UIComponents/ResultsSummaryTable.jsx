/* React component to handle displaying accuracy of multiple training runs. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { styles, colors} from "../constants";

class ResultsSummaryTable extends Component {
  static propTypes = {
    trainingLog: PropTypes.array,
  };

  render() {
    return (
      <div>
        <div style={styles.tableParent}>
          <table style={styles.displayTable}>
            <thead>
              <tr>
                <th
                  style={{
                    ...styles.largeText,
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  Features
                </th>
                <th
                  style={{
                    ...styles.largeText,
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  Label
                </th>
                <th
                  style={{
                    ...styles.largeText,
                    ...styles.tableHeader,
                    ...styles.resultsTableFirstHeader
                  }}
                >
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.trainingLog.map((entry, index) => {
                return (
                  <tr key={index}>
                    <td style={styles.tableCell}>
                      {entry.features.join(", ")}
                    </td>
                    <td style={styles.tableCell}>
                      {entry.labelColumn}
                    </td>
                    <td style={styles.tableCell}>
                      {entry.accuracy}
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

export default connect(state => ({
  trainingLog: state.trainingLog,
}))(ResultsSummaryTable);
