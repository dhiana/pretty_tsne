var calculateWidth = function (margin) {
  var width = 900 - margin.left - margin.right;
  return width;
};

var calculateHeight = function (margin) {
  var height = 900 - margin.top - margin.bottom;
  return height;
};

var setupX = function (width) {
  var x = {
    'Value': function(d) { return d.x;}, // data -> value
    'Scale': d3.scale.linear().range([0, width]), // value -> display
  };
  x.Map = function(d) { return x.Scale(x.Value(d));}; // data -> display
  return x;
};

var setupY = function (height) {
  var y = {
    'Value': function(d) { return d.y;}, // data -> value
    'Scale': d3.scale.linear().range([height, 0]), // value -> display
  };
  y.Map = function(d) { return y.Scale(y.Value(d));}; // data -> display
  return y;
};

var cValue = function(d, className) { return d[className];};
var color = d3.scale.category20();

var addGraphToBody = function (margin, width, height) {
  var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right + 100) // +100 for class labels
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return svg;
};

var createTooltip = function () {
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  return tooltip;
};

var string2number = function (data) {
  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });
};

var drawDots = function (svg, data, x, y, tooltip, className) {

  (addBufferToDataDomain = function (data, x, y) {
    x.Scale.domain([d3.min(data, x.Value)-1, d3.max(data, x.Value)+1]);
    y.Scale.domain([d3.min(data, y.Value)-1, d3.max(data, y.Value)+1]);
  })(data, x, y);

  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 10)
      .attr("cx", x.Map)
      .attr("cy", y.Map)
      .style("fill", function(d) { return color(cValue(d, className));})
      .attr("id", function(d){
         return d["label"];
       })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);

          tooltip.html(d["label"] + " (" + x.Value(d).toFixed(1) + ", " + y.Value(d).toFixed(1) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
};

var createLegend = function (svg) {
  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  return legend;
};

var drawLegendColoredRectangles = function (legend, width) {
  legend.append("rect")
      .attr("x", width + 70)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
};

var drawLegendText = function (legend, width) {
  legend.append("text")
      .attr("x", width + 50)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
};
