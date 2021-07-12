// @TODO: YOUR CODE HERE!

// Create svg wrapper
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Import data
d3.csv("assets/data/data.csv").then(function(stateData) {

  console.log(stateData);

  // Get scatter element with d3
  var scatterPlot = d3.select("#scatter");

}).catch(function(error) {
  console.log(error);
});
