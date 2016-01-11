var go = function () {
  var name = document.getElementById('name').value;
  d3.select("#"+name)
    .attr("r", 20);
};

var main = (function () {

  var filename = "data/tsne.csv";
  var CLASS_NAME = "Grade";

  d3.csv(filename, function(error, data) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = calculateWidth(margin);
    var height = calculateHeight(margin);
    var x = setupX(width);
    var y = setupY(height);
    var svg = addGraphToBody(margin, width, height);
    var legend = createLegend(svg);
    var tooltip = createTooltip();

    string2number(data);
    drawDots(svg, data, x, y, tooltip, CLASS_NAME);

    drawLegendColoredRectangles(legend, width);
    drawLegendText(legend, width);

  })

})();
