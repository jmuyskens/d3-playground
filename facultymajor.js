

d3.csv("data/2012facultymajor.csv",  function(d) {
  return {
    dept: d.Department,
    faculty: +d.Faculty,
    students: +d.Students,
    year: +d.Year,
    fsratio: +d.FSRatio
  };
}, function(error, rows) {

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
        depth  = 35,
        width  = 760 - margin.left - margin.right,
        height = depth * rows.length;


    var vis = d3.select("body").append("svg:svg")
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


    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ width/2+"," + margin.top + ")")
      .call(d3.svg.axis().scale(x).orient("top"));

    vis.append("g")
      .attr("class", "xpercent axis")
      .attr("transform", "translate(0," + margin.top + ")")
      .call(d3.svg.axis().scale(xpercent).orient("top"));

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
       departments.sort(function(a, b){ return b[d.name] - a[d.name]; });
       departments.transition(departments)
          .duration(750)
          .delay(function(d, i){ return (i * 20);})
          .attr("transform", function(d, i) { return "translate(0," + (33 + i * 35) + ")"; });

      //rects.on("click", function(d){ rebrrange(d);});
    }

    var rebrrange = function(d) {
        departments.sort(function(a, b){ return a[d.name] - b[d.name]; });

        departments.transition(departments)
          .duration(750)
          .delay(function(d, i){ return i * 20;})
          .attr("transform", function(d, i) { return "translate(0," + (33 + i * 35) + ")"; });
        rects.on("click", function(d){ rearrange(d);});
        }



    departments.append("text")
      .attr("x", width/2)
      .attr("y", 0)
      .attr("dy","-.25em")
      .style("text-anchor","end")
      .text(function(d){return d.dept;});

}
);

