app.directive('dataline', function($timeout,$window, $interval, $rootScope, glassData) {


    var lineCirclesLink = function(scope, element, attrs) {
                glassData.filterData('industry', 'Internet').then(function(s){
            scope.allData = s;
            //remove later



            var rMin = 4, // min radius size
                rMax = 35, // max radius size
                rProperty = "overallRating", // "r" property will always be sampleSize
                xScale, // scaling x-axis, so values al fit on line and are relative
                rScale, // scaling radius size
                newData;

            d3.json("sampleJSON/" + scope.lineId + ".json", (data) => render(data,scope.lineId, "salary"));

            function render(data, typeProp, xProp) {
                data = s;
                data = data.sort(function(a,b){return a.salary - b.salary})
                data = data.slice(data.length-7,data.length)
                console.log(data)
                var lineToAppendTo = d3.select("#" + scope.lineId);
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html((d) => "<span>" + d[typeProp] + "</span><br><span>$" + d.salary + "</span><br><span>rating: "+ d.overallRating + "</span>");
                lineToAppendTo.call(tip); // attach hover info to bubbles

                xScale = d3.scale.linear().domain(d3.extent(data, function(d){
                    return d[xProp]}))
                    .range([300, 1100]);

                rScale = d3.scale.linear().domain(d3.extent(data, (d) => d[rProperty]))
                    .range([rMin, rMax]);

                var circles = lineToAppendTo
                    .selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle");

                circles
                    .attr("class", "data-line-circles")
                    .attr("fill", "grey")
                    .attr("cy", (d) => 200)
                    .attr("cx", (d,i)=>{console.log(d[xProp], xScale(i))
                                        return i*100+300
                                        })
                    .attr('r', 0)
                    .transition()
                    .delay((d,i)=>(i*50))
                    .attr("r",  (d) => rScale(d[rProperty]))

                circles
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('click', (d) => glassData.filterData('industry', 'Internet'));


         scope.getNewData = function(s){
                var circles = d3.selectAll('circle')
                circles
                    .transition()
                    .attr('r', 0)
                    .remove()

                circles
                    .data(s)
                    .enter()
                    .append('circle')

                circles
                    .attr("class", "data-line-circles")
                    .attr("fill", "grey")
                    .attr("cy", (d) => 200)
                    .attr("cx", (d,i)=>{console.log(d[xProp], xScale(i))
                                        return i*100+300
                                        })
                    .attr('r', 0)
                    .transition()
                    .delay((d,i)=>(i*50))
                    .attr("r",  (d) => rScale(d[rProperty]))

            }

            }
        })
            
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
