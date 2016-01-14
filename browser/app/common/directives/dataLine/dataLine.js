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
                if(typeProp === 'jobTitle'){
                data = s;
                data = data.map(function(obj){
                    var avgDiv = 1
                    var total =  obj.salary;
                    var ovrRat = obj.overallRating;
                    for(var i = 0; i<data.length; i++){
                        if(obj.jobTitle === data[i].jobTitle){
                            avgDiv = avgDiv+1;
                            total = total + data[i].salary;
                            ovrRat =  ovrRat + data[i].overallRating;
                        }
                    }
                    return {
                        jobTitle: obj.jobTitle,
                        salary: Math.floor(total/avgDiv),
                        overallRating: ovrRat/avgDiv
                    }
                })
                data = data.sort(function(a,b){
                        var textA = a.jobTitle.toUpperCase();
                        var textB = b.jobTitle.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                var jobData = [];
                    for(var i = 0; i < data.length-1; i++){
                        if(data[i].jobTitle !== data[i+1].jobTitle){
                            jobData.push(data[i])
                        }
                    }
                jobData = jobData.sort((a,b)=>a.salary-b.salary)
                data = jobData.slice(jobData.length-7,jobData.length)
                }
                else if(typeProp === "company"){
                data = s;
                data = data.sort(function(a,b){return a.salary - b.salary})
                data = data.slice(data.length-7,data.length)
                }

                console.log(data)
                var lineToAppendTo = d3.select("#" + scope.lineId);
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html((d) => "<span>" + d[typeProp] + "</span><br><span>$" + d.salary + "</span>");
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

        let startData = 0;
         scope.getNewData = function(s){
                console.log(startData, s.length)
                var newData = s.slice(startData,startData+6)
                var circles = d3.selectAll('circle')
                circles
                    .transition()
                    .attr('r', 0)

                circles
                    .data(newData)
                    .attr("cy", (d) => 200)
                    .attr("cx", (d,i)=>{console.log(d[xProp], xScale(i))
                                        return i*100+300
                                        })

                circles
                    .transition()
                    .delay((d,i)=>(i*50))
                    .attr("r",  (d) => {
                            console.log(d[rProperty])
                        return rScale(d[rProperty])})

                    if(startData >= s.length-1){
                        startData = 0;
                    }
                    startData = startData + 6;

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
