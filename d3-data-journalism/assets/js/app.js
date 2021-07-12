// @TODO: YOUR CODE HERE!

// Create svg wrapper dimensions
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

// Create svg wrapper element
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Create group that is shifted by top and left margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("assets/data/data.csv").then(function(stateData) {

  console.log(stateData);
  stateData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.poverty = +data.poverty;
  });


}).catch(function(error) {
  console.log(error);
});
