var outerWidth = 600;
var outerHeight = 300;
var rMin = 0; //"r" stands for radius
var rMax = 20;
var xColumn = "salary";
var rColumn = "sampleSize";

var svg = d3.select("body").append("svg")
	.attr("width", outerWidth)
	.attr("height", outerHeight);

var xScale = d3.scale.linear().range([0, outerWidth]);
var rScale = d3.scale.linear().range([rMin, rMax]);

function render (data) {
    xScale.domain (d3.extent(data.jobs, function (d) { return d[xColumn]; }));
    rScale.domain (0, d3.max(data.jobs, function (d) { return d[rColumn]; }));

	var circles = svg.selectAll("circle").data(data);
	circles.enter().append("circle").attr("r", circleRadius);

	circles
	    .attr("cx", function (d){ return xScale(d[xColumn]); })
	    .attr("r", function (d){ return rScale(d[rColumn]); });
	 
	circles.exit().remove();
}

// function type (d) {
//   d.datavalue1 = +d.datavalue1;
//   d.datavalue2 = +d.datavalue2;
//   return d;
// }

d3.json("data.json", render);