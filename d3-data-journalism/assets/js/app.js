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


var selectedYAxis = "healthcare";

// Functions to be run after axis selection

// Function to update the plot's yscale after new selection
function updateYScale(stateData, selectedYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d[selectedYAxis]) * 1.2])
    .range([height, 0]);
  return yLinearScale;

}

// Function used to update y axis
function updateAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating scatter plot points
function updatePoints(scatterPoints, stateAbbrevText, newYScale, selectedYAxis) {

  scatterPoints.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[selectedYAxis]));

  stateAbbrevText.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[selectedYAxis]));

  return scatterPoints;
}

// Function to update tool tip
function updateToolTip(selectedYAxis, scatterPoints) {

  var label;

  if (selectedYAxis === "healthcare") {
    label = "Healthcare:";
  }
  else {
    label = "Obesity:";
  }
  // Create labels
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<hr>Poverty: ${d.poverty}%
        <br>${label} ${d[selectedYAxis]}%<strong>`);
    });

  scatterPoints.call(toolTip);

  scatterPoints.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  return scatterPoints;
}



// Import data
d3.csv("assets/data/data.csv").then(function(stateData) {

  console.log(stateData);
  // Type cast numeric data to numeric
  stateData.forEach(function(data) {
    data[selectedYAxis] = +data[selectedYAxis];
    data.poverty = +data.poverty;
  });

  // Create scales for scatter plot
  var xScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.poverty) * 0.8, d3.max(stateData, d => d.poverty) * 1.2])
    .range([0,width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.healthcare) *1.2])
    .range([height, 0]);

  // Create axes
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Append axes to chart
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Add axis labels
  var axisLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xAxisLabel = axisLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "x_axis")
    .attr("font-weight", "bold")
    .classed("aText", true)
    .text("In Poverty (%)");

  var healthcareLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .attr("font-weight", "bold")
      .classed("active", true)
      .classed("aText", true)
      .text("Lacks Healthcare (%)");

  var obesityLabel = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/(3/2))
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "obesity")
      .attr("font-weight", "bold")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Obesity (%)");

  // Create and plot the circles for each state
  var scatterPlotting = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("g")

  var scatterPoints = scatterPlotting.append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("stroke-width", "1")
    .attr("stroke", "white")
    .attr("opacity", 0.7);

  // Add state abbreviations for each point
  var stateAbbrevText = scatterPlotting.append("text")
    .text(d => d.abbr)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .attr("dy","0.35em")
    .attr("text-anchor", "middle")
    .attr("class", "stateText");

  // Create tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<hr>Poverty: ${d.poverty}%
      <br>Healthcare: ${d.healthcare}%<strong>`);
    });

  chartGroup.call(toolTip);

  // Create event listener for mouseover/out
  scatterPoints.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  chartGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== selectedYAxis) {

        // Update selected y value
        selectedYAxis = value;

        // Update y scale
        yLinearScale = updateYScale(stateData, selectedYAxis);

        // Update y axis using new y scale
        yAxis = updateAxis(yLinearScale, yAxis);

        // Update scatter plot points
        scatterPoints = updatePoints(scatterPoints, stateAbbrevText, yLinearScale, selectedYAxis);

        // Update tooltip boxes
        scatterPoints = updateToolTip(selectedYAxis, scatterPoints);

        // Updates selected y label
        if (selectedYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


}).catch(function(error) {
  console.log(error);
});
