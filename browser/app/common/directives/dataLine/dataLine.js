app.directive('dataline', function($timeout, $interval, $rootScope, glassData) {

    var lineCirclesLink = function(scope, element, attrs) {
            console.log(scope);
            // var outerWidth = 600,
            //     outerHeight = 300;
            //"r" below stands for radius, "x" for x axis
            var rMin = 4, // min radius size
                rMax = 35, // max radius size
                rProperty = "sampleSize", // "r" property will always be sampleSize
                xScale, // scaling x-axis, so values al fit on line and are relative
                rScale; // scaling radius size

            // Creating Tooltip


            function render(data, typeProp, xProp) {
                console.log(data);
                // use provided ID selector
                var lineToAppendTo = d3.select("#" + scope.lineId);
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<span>" + d[typeProp] + "</span><br><span>$" + d.salary + "</span>";
                    });
                lineToAppendTo.call(tip); // attach hover info∫ to bubbles
                xScale = d3.scale.linear().domain(d3.extent(data, function(d) {
                    return d[xProp];
                })).range([300, 1100]);

                rScale = d3.scale.linear().domain(d3.extent(data, function(d) {
                    return d[rProperty];
                })).range([rMin, rMax]);

                var circles = lineToAppendTo
                    .selectAll("circle")
                    .data(data)
                    .enter().append("circle");

                circles
                    .attr("class", "data-line-circles")
                    .attr("fill", "grey")
                    .attr("cy", function(d) {
                        return 200;
                    })
                    .attr("cx", function(d) {
                        return xScale(d[xProp]);
                    })
                    .attr("r", function(d) {
                        return rScale(d[rProperty]);
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('click', function(d) {
                        glassData.update(typeProp, d[typeProp]);
                    });
            }

            d3.json("sampleJSON/" + scope.lineId + ".json", function(data){
                render(data,scope.lineId, "salary");
            });

            ////////saved for sliding between
            // Directs incrementing percentages
            // function percentClimber(){
            //     var start = false;
            //     if(!scope.percentageData.length) {
            //         for (var i = 0; i < scope.passedData.length; i++) {
            //             scope.percentageData.push({
            //                 value: 0,
            //                 count: 0,
            //                 description: scope.passedData[i].description
            //             });
            //         }
            //         start = true;
            //     }
            //     $timeout(function(){
            //         for (var i = 0; i < scope.percentageData.length; i++) {
            //             incrementTo(scope.percentageData[i], scope.passedData[i], 'value');
            //             incrementTo(scope.percentageData[i], scope.passedData[i], 'count');
            //         }
            //     }, start ? 1000: 200); //wait 1 second on initial load, .2 seconds when moving between buildings
            // }
            //
            // // Manages actual incrementing
            // function incrementTo(startVal, endVal, prop){
            //     var interval = $interval(function () {
            //         if(startVal[prop] < endVal[prop]) {
            //             startVal[prop]++;
            //         } else if(startVal[prop] > endVal[prop]) {
            //             startVal[prop]--;
            //         } else {
            //             $interval.cancel(interval);
            //         }
            //     }, 500/Math.abs(startVal[prop]-endVal[prop]));
            // }
            // Build chart
            // function ಠ_ಠ() {
            //     // hide if specific apartment is selected
            //     if (scope.passedData.length) {
            //         drawLineBubbles(scope.lineId, scope.passedData);
            //         //percentClimber();
            //     }
            // }

            // // Re-draw pies upon changes to 'passedData'
            // scope.$watch('passedData', function(newVal, oldVal) {
            //     $timeout(function() {
            //         ಠ_ಠ();
            //     });
            // }, true);
    };

    return {
        restrict: 'E',
        scope: {
            passedData: '=',
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
//});
