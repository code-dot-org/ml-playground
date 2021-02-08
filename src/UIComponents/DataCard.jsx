/* React component to show information about the currently-selected data set. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setLabelColumn,
  setColumnsByDataType,
  getCurrentColumnData,
  addSelectedFeature,
  removeSelectedFeature,
  getCurrentColumnIsSelectedFeature,
  getCurrentColumnIsSelectedLabel,
  getRangesByColumn,
  setCurrentColumn
} from "../redux";
import { ColumnTypes, styles } from "../constants.js";
import Histogram from "react-chart-histogram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class DataCard extends Component {
  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.array,
    metadata: PropTypes.object,
    dataLength: PropTypes.number
  };

  render() {
    const { name, metadata, data, dataLength } = this.props;

    const card = metadata && metadata.card;

    return (
      <div id="data-card">
        {dataLength !== 0 && (
          <div style={styles.validationMessagesLight}>
            {name}
            {card && (
              <div>
                <div>
                  Description:
                  {metadata.card.description}
                </div>
                <div>
                  Source:
                  {metadata.card.source}
                </div>
                Columns:
                <div style={styles.subPanel}>
                  {metadata.fields.map(field => {
                    return (
                      <div key={field.id}>
                        {field.id}:
                        {field.description}
                      </div>
                    );
                  })}
                </div>
                <div>
                  Rows of data:
                  {dataLength}
                </div>

                <div>
                  This data has been cleaned & prepared beforehand
                </div>
                <div>
                  This Data contains columns that can be used to identify a subgroup of people (for example: by age, by race, by gender, etc):
                </div>

                <div>
                  Potential uses:
                  {metadata.card.context.potential_uses}
                </div>
                <div>
                  Potential misuses:
                  {metadata.card.context.potential_misuses}
                </div>
                <div>
                  Last updated:
                  {metadata.card.last_updated}
                </div>
              </div>
            )}
            {!card && dataLength > 0 && (
              <div>
                Columns:
                <div style={styles.subPanel}>
                  {Object.keys(data[0]).map(key => {
                    return (
                      <div key={key}>
                        {key}
                      </div>
                    );
                  })}
                </div>
                <div>
                  Rows of data:
                  {dataLength}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  name: state.name,
  metadata: state.metadata,
  data: state.data,
  dataLength: state.data.length
}))(DataCard);