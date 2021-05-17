/* React component to handle displaying imported data. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Statement from "./Statement";
import DataTable from "./DataTable";
import { setCurrentColumn } from "../redux";
import { styles } from "../constants";

class DataDisplay extends Component {
  static propTypes = {
    data: PropTypes.array,
    setCurrentColumn: PropTypes.func,
    setColumnRef: PropTypes.func
  };

  render() {
    const { data, setCurrentColumn, setColumnRef } = this.props;

    if (data.length === 0) {
      return null;
    }

    return (
      <div id="data-display" style={styles.panel}>
        <Statement />
        <div
          style={styles.tableParent}
          onScroll={() => setCurrentColumn(undefined)}
        >
          <DataTable setColumnRef={setColumnRef} />
        </div>
        <div style={styles.footerText}>
          There are {this.props.data.length} rows of data.
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    data: state.data
  }),
  dispatch => ({
    setCurrentColumn(column) {
      dispatch(setCurrentColumn(column));
    }
  })
)(DataDisplay);
