var outerWidth = 600;
var outerHeight = 300;
var rMin = 0; //"r" stands for radius
var rMax = 20;
var xColumn = "salary";
var rColumn = "sampleSize";


var industry = d3.select("#industry");
var company = d3.select("#company");
var jobTitleSvg = d3.select("#job-title");

// Creating Tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<span>" + d.title + "</span><br><span>$" + d.salary + "</span>";
    });

jobTitleSvg.call(tip);
company.call(tip);
industry.call(tip);

function render(data) {
    // xScale.domain(d3.extent(data.jobs, function(d) {
    //     return d[xColumn];
    // }));
    // rScale.domain(d3.extent(data.jobs, function(d) {
    //     return d[rColumn];
    // }));

    //debugger;
    var circles = jobTitleSvg.selectAll("circle").data(data.jobs)
        .enter().append("circle").attr('class', 'job-circles');

    //circles.attr("r", rMax);

    circles
        .attr("class", "job-circles")
        .attr("fill", "grey")
        .attr("cy", function(d) {
            return 200;
        })
        .attr("cx", function(d) {
            return 200 + d[xColumn] / 200;
        })
        .attr("r", function(d) {
            return d[rColumn] * 2;
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //circles.exit().remove();
}



// function renderTest(data) {
//		console.log(data);
// }

//render
d3.json("data.json", render);