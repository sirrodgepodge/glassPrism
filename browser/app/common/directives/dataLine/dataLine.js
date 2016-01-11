app.directive('dataline', function($timeout, $interval, $rootScope, glassData) {

    var lineCirclesLink = function(scope, element, attrs) {
            var rMin = 4, // min radius size
                rMax = 35, // max radius size
                rProperty = "sampleSize", // "r" property will always be sampleSize
                xScale, // scaling x-axis, so values al fit on line and are relative
                rScale; // scaling radius size

            d3.json("sampleJSON/" + scope.lineId + ".json", (data) => render(data,scope.lineId, "salary"));

            function render(data, typeProp, xProp) {
                // use provided ID selector
                var lineToAppendTo = d3.select("#" + scope.lineId);
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html((d) => "<span>" + d[typeProp] + "</span><br><span>$" + d.salary + "</span>");
                lineToAppendTo.call(tip); // attach hover info to bubbles

                xScale = d3.scale.linear().domain(d3.extent(data, (d) =>  d[xProp]))
                    .range([300, 1100]);

                rScale = d3.scale.linear().domain(d3.extent(data, (d) => d[rProperty]))
                    .range([rMin, rMax]);

                var circles = lineToAppendTo
                    .selectAll("circle")
                    .data(data)
                    .enter().append("circle");

                circles
                    .attr("class", "data-line-circles")
                    .attr("fill", "grey")
                    .attr("cy", (d) => 200)
                    .attr("cx", (d) => xScale(d[xProp]))
                    .attr("r",  (d) => rScale(d[rProperty]))
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('click', (d) => glassData.filterData(typeProp, d[typeProp]));
            }
    };

    return {
        restrict: 'E',
        scope: {
            lineId: '@',
            viewLabel: '@'
        },
        templateUrl: 'app/common/directives/dataLine/dataLine.html',
        link: lineCirclesLink,
        controller: function($scope) {
            //nothing needed now
        }
    };
});
