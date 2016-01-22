window.onload = function () {
  searchButton = document.getElementById("searchButton")
    .onclick = function searchByLogin () {
      login =  this.form.login.value;
      d3.select("#"+login)
        .attr("r", 20);
    };
};

var main = (function () {

  var filename = "data/tsne.csv";
  var CLASS_NAME = "Role";

  d3.csv(filename, function(error, data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = calculateWidth(margin);
    var height = calculateHeight(margin);
    var x = setupX(width);
    var y = setupY(height);
    var svg = addGraphToBody(margin, width, height);
    var tooltip = createTooltip();

    string2number(data);
    drawDots(svg, data, x, y, tooltip, CLASS_NAME);

    var legend = createLegend(svg);
    drawLegendColoredRectangles(legend, width);
    drawLegendText(legend, width);

  })

})();
