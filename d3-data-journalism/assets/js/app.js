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
  // Type cast numeric data to numeric
  stateData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    if (data.abbr === "NH") {
      console.log(data.poverty);
      console.log(data.healthcare);
    }
  });

  // Create scales for scatter plot
  var xScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.poverty) -2, d3.max(stateData, d => d.poverty) +2])
    .range([0,width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.healthcare)+2])
    .range([height, 0]);

  // Create axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Append axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // Add axis labels
  var axisLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xAxisLabel = axisLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "x_axis")
    .attr("font-weight", "bold")
    .text("In Poverty (%)");

  // Create and plot the circles for each state
  var scatterPoints = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("g")

  scatterPoints.append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .attr("opacity", 0.7);

  scatterPoints.append("text")
    .text(d => d.abbr)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .attr("dy","0.35em")
    .attr("text-anchor", "middle");


}).catch(function(error) {
  console.log(error);
});
