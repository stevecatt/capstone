import React, {Component} from '../../node_modules/react';
import * as urls from '../utils/urls'
import { CHINA_KEY } from "../.env.json";
import { connect } from "react-redux"
import * as actionTypes from '../store/actions/actionTypes'


const HEATMAP_SOURCE_ID = "aqis";


heatMapLayer = (id, source) => {
    const MAX_ZOOM_LEVEL = 13;
    return {
      id,
      source,
      maxzoom: MAX_ZOOM_LEVEL,
      type: "heatmap",
      paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": {
          property: "aqi",
          type: "linear",
          stops: [[1, 0], [150, 1]]
        },
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          MAX_ZOOM_LEVEL,
          3
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          2,
          MAX_ZOOM_LEVEL,
          20
        ],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(236,222,239,0)",
          0.2,
          "#ffffb2",
          0.4,
          "#fecc5c",
          0.6,
          "#fd8d3c",
          0.8,
          "#f03b20",
          1,
          "#bd0026"
        ]
      }
    };
  };
