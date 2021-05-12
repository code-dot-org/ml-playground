import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getScatterPlotData } from "../redux";
import { styles } from "../constants.js";

import vizTriangle from "@public/images/viz-triangle.png";
import vizCircle from "@public/images/viz-circle.png";
import vizSquare from "@public/images/viz-square.png";
import vizTriangleHi from "@public/images/viz-triangle-hi.png";
import vizCircleHi from "@public/images/viz-circle-hi.png";
import vizSquareHi from "@public/images/viz-square-hi.png";
import vizCrossHi from "@public/images/viz-cross-hi.png";

const vizImages = [
  { normal: vizTriangle, hi: vizTriangleHi },
  { normal: vizCircle, hi: vizCircleHi },
  { normal: vizSquare, hi: vizSquareHi }
];

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let vizItems = [];
let testItems = [];
let testItemNeighbours = [];

class Viz extends Component {
  static propTypes = {
    showingResults: PropTypes.bool,
    animationStep: PropTypes.number
  };

  getDistance(item1, item2) {
    return (
      (item2.x - item1.x) * (item2.x - item1.x) +
      (item2.y - item1.y) * (item2.y - item1.y)
    );
  }

  componentDidMount() {
    vizItems = [];
    testItems = [];
    testItemNeighbours = [];

    for (let i = 0; i < 30; i++) {
      vizItems.push({
        image: getRandomInt(vizImages.length - 1),
        x: 20 + getRandomInt(260),
        y: 20 + getRandomInt(260)
      });
    }

    for (let i = 0; i < 10; i++) {
      const item = {
        src: vizCrossHi,
        x: 20 + getRandomInt(260),
        y: 20 + getRandomInt(260)
      };

      testItems.push(item);

      // for this point, sort the other points by proximity, and get an array
      // of which items are the neighbours.

      const withDistances = vizItems
        .map((vizItem, index) => {
          return {
            index,
            item: vizItem,
            distance: this.getDistance(item, vizItem)
          };
        });

      const sorted = withDistances.sort((first, second) => {
          return first.distance - second.distance;
        });

      const sliced = sorted.slice(0, 3);

      const mapped = sliced.map(item => {
          return item.index;
        });

      testItemNeighbours[i] = mapped;

      /*
      testItemNeighbours[i] = vizItems
        .map((vizItem, index) => {
          return {
            index,
            item: vizItem,
            distance: this.getDistance(item, vizItem)
          };
        })
        .sort((first, second) => {
          return first.distance > second.distance;
        })
        .slice(0, 3)
        .map(item => {
          return item.index;
        });
      console.log(testItemNeighbours[i]);*/
    }
  }

  getItems = () => {
    const itemCount = this.props.showingResults ? 30 : this.props.animationStep;

    let highlightItems = [];
    let neighbours = [];
    if (this.props.showingResults) {
      if (this.props.animationStep < 10) {
        highlightItems = [testItems[this.props.animationStep]];
        neighbours = testItemNeighbours[this.props.animationStep];
      }
    }

    const vizItemsWithHighlights = vizItems
      .slice(0, itemCount)
      .map((vizItem, index) => {
        if (neighbours.includes(index)) {
          return { ...vizItem, src: vizImages[vizItem.image].hi };
        } else {
          return { ...vizItem, src: vizImages[vizItem.image].normal };
        }
      });
    return [...vizItemsWithHighlights, ...highlightItems];
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          position: "absolute",
          top: 40,
          right: 40,
          height: 300,
          width: 300,
          borderRadius: 15,
          background:
            "linear-gradient(11deg, rgba(0,0,0,1) 0%, rgba(86,88,84,1) 64%, rgba(162,166,159,1) 100%)"
        }}
      >
        {this.getItems().map((image, index) => {
          return (
            <img
              key={index}
              src={image.src}
              style={{
                position: "absolute",
                left: image.x,
                top: image.y,
                width: 15,
                height: 15
              }}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(state => ({}))(Viz);
