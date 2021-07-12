// @TODO: YOUR CODE HERE!
d3.csv("assets/data/data.csv").then(function(stateData) {

  console.log(stateData);

}).catch(function(error) {
  console.log(error);
});
