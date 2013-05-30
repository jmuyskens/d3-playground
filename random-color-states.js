var width = 1160,
    height = 960;

var projection = d3.geo.albersUsa()

var path = d3.geo.path()
  .projection(projection)
  .pointRadius(2);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)

d3.json("usa.json", function(error, us) {
  svg.selectAll(".state")
    .data(topojson.object(us, us.objects.states).geometries)
    .enter().append("path")
    .attr("class", function(d) { return "state " + d.id; })
    .attr("d", path)
    .style("fill", function() {
      return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });


});



