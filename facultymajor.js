var isAscending = 1;

d3.csv("data/2012facultymajor.csv",  function(d) {
  return {
    dept: d.Department,
    faculty: +d.Faculty,
    students: +d.Students,
    year: +d.Year,
    fsratio: +d.FSRatio
  };
}, function(error, rows) {

    var margin = {top: 10, right: 40, bottom: 20, left: 40},
        depth  = 35,
        width  = 860 - margin.left - margin.right,
        height = depth * rows.length + 30;


    var vis = d3.select("#wrap").append("svg:svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    rows.forEach(function(d) {
      d.ratio = d.students / d.faculty;
      d.stuff = ["students", "faculty", "ratio", "fsratio"].map(function(name){ return {name: name, value: +d[name]}; });
    });

    rows.sort( function(a, b) {
        a.ratio - b.ratio;
    });

    var x = d3.scale.linear()
      .domain([0, d3.max(rows, function(d){ return d.students; })])
      .range([0, width/2]);

    var xpercent = d3.scale.linear()
      .domain([0, d3.max(rows, function(d){ return d.ratio; })])
      .range([width / 2, 0]);

    var y0 = d3.scale.ordinal()
      .domain(d3.range(rows.length))
      .rangeBands([0, height], 0.2)

    var y1 = d3.scale.ordinal()
      .domain(d3.range(rows.length))
      .range([0, y0.rangeBand()]);

    function make_x_axis() {
      return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(8)
    }

    function make_xpercent_axis() {
      return d3.svg.axis()
        .scale(xpercent)
        .orient("bottom")
        .ticks(8)
    }

    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ width/2+"," + margin.top + ")")
      .call(make_x_axis().orient("top").ticks(5));

    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ width/2+"," + height + ")")
      .call(make_x_axis().ticks(5));

    vis.append("g")
      .attr("class", "grid")
      .attr("transform", "translate("+ width/2+"," + height + ")")
      .call(make_x_axis().tickSize(margin.top-height, 0, 0).tickFormat(""));

    vis.append("g")
      .attr("class", "xpercent axis")
      .attr("transform", "translate(0," + margin.top + ")")
      .call(make_xpercent_axis().orient("top").ticks(5));

  vis.append("g")
      .attr("class", "xpercent axis")
      .attr("transform", "translate(0," + height + ")")
      .call(make_xpercent_axis().ticks(5));

  vis.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_xpercent_axis().tickSize(margin.top-height, 0, 0).tickFormat(""));


    var departments = vis.selectAll("g.department")
      .data(rows, function(d) { return d.dept; })
    .enter().append("svg:g")
      .attr("class",function(d){ return "department "+d.dept})
      .attr("transform", function(d,i) { return "translate(0," + (33 + i * depth) + ")";});

    var rects = departments.selectAll("rect")
      .data(function(d){return d.stuff;})
    .enter().append("rect")
      .attr("class", function(d){ return d.name; })
      .attr("x", function(d) {
         if (d.name == "ratio" || d.name == "fsratio")
           return xpercent(d.value);
        return width/2;})
      .attr("y", function(d, i){
        return (i%2) * 11;
      })
      .attr("width", function(d) {
          if (d.name == "ratio" || d.name == "fsratio")
            return width/2 - xpercent(d.value);
          return x(d.value);
        })
      .attr("height", 10)
    .on("click", function(d){ rearrange(d);});

    var rearrange = function(d) {
       departments.sort(function(a, b){ return isAscending * (b[d.name] - a[d.name]); });
       departments.transition(departments)
          .duration(750)
          .delay(function(d, i){ return (i * 20);})
          .attr("transform", function(d, i) { return "translate(0," + (33 + i * 35) + ")"; });

      //rects.on("click", function(d){ rebrrange(d);});
    };

    var rebrrange = function(d) {
        departments.sort(function(a, b){ return a[d.name] - b[d.name]; });

        departments.transition(departments)
          .duration(750)
          .delay(function(d, i){ return i * 20;})
          .attr("transform", function(d, i) { return "translate(0," + (33 + i * 35) + ")"; });
//        rects.on("click", function(d){ rearrange(d);});
        };

   rects.append("text")
      .attr("x",0)
      .attr("y",0)
      .attr("dy","-2.5em")
      .style("text-anchor","end")
      .text(function(d){return "hello, world"; });


    departments.append("text")
      .attr("x", width/2)
      .attr("y", 0)
      .attr("dy","-.25em")
      .style("text-anchor","end")
      .text(function(d){return d.dept;});

}
);

function ascending() {
  isAscending = 1;
}
function descending() {
  isAscending = -1;
}