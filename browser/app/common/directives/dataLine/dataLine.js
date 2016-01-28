app.directive('dataline', function($timeout,$window, $interval, $rootScope, glassData) {

    const splitIntoThree = /\d{3}/g;
    const numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var lineCirclesLink = function(scope, element, attrs) {

        var dirty = false, // checks for one succesful render to direct to render or getNewData, should probs make these the same if we can
            focusCircle = 'null',// to animate the tranistion between all data and focused data
            startData = 0;
        
        const rMin = 10, // min radius size
        rMax = 35, // max radius size
        rProperty = "overallRating";// "r" property will always be sampleSize

        // Re-draw pies upon changes to 'passedData'
        scope.$watch('lineData', (newVal, oldVal) =>
            dirty ?
            getNewData(scope.ZoomFilterValue, scope.lineData, scope.lineId, startData, focusCircle) :
            render(scope.lineData, scope.lineId, startData));

        scope.xProp = "salary"; // initialize xProp with salary

       // addscroll buttons

        function render(data, typeProp, start) {
            if(!data.length) return;
            dirty = true;
            //bad form must fix
            data = glassData.filterByProp(typeProp, data);
            data = data.filter((obj)=>obj.jobTitle!== 'Intern')
            var trimmedData = data.slice(data.length-start-7, data.length-start);

            // console.log(data)
            const lineToAppendTo = d3.select("#" + scope.lineId);
            const tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html((d) => typeProp === 'company' ?
                        `<span>${d[typeProp]}</span><br><span>${d.jobTitle}</span><br><span>$${scope.xProp === 'salary' && d[scope.xProp] ? numberWithCommas(d[scope.xProp]) : d[scope.xProp]}</span><br><span> work/life: ${d[rProperty]}</span>` :
                        `<span>${d[typeProp]}</span><br><span>$${scope.xProp === 'salary' && d[scope.xProp] ? numberWithCommas(d[scope.xProp]) : d[scope.xProp]}</span><br><span> work/life: ${d[rProperty]}</span>`);
            lineToAppendTo.call(tip); // attach hover info to bubbles

            const xScale = d3.scale.linear().domain(d3.extent(trimmedData, (d) => d[scope.xProp])) // scaling x-axis, so values al fit on line and are relative
                .range([300, 900]);

            const rScale = d3.scale.linear().domain([1,5]) // scaling radius size
                .range([rMin, rMax]);

            const circles = lineToAppendTo
                .selectAll('prop-'+typeProp)
                .data(trimmedData)
                .enter()
                .append("circle")
                .attr('id', (d,i)=>'circle-'+i +'-'+ typeProp)
                .attr("class", "data-line-circles prop-"+typeProp)
                .attr("fill", (d) => d[rProperty] <2.5 ? 'red' : 'grey');

            circles
                .attr("cy", 200)
                .attr('cx', 600)
                .attr('r', 0)
                .transition()
                .delay((d,i)=>(i*50))
                .attr("r",  (d) => rScale(d[rProperty]))
                .attr("cx", (d,i) => {
                    if(i>0)if(xScale(d.salary) - xScale(trimmedData[i-1].salary) < 50) return (xScale(d.salary)+(50*i))
                    console.log(xScale(d.salary))
                    return xScale(d.salary)})
                

            circles
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click', (d,i) =>{
                    circles.on('click', null)
                    $rootScope.directiveCheck = typeProp
                    focusCircle = focusCircle.slice(focusCircle.length)
                    focusCircle = focusCircle.concat('circle-',i,'-',typeProp)
                    scope.ZoomFilterValue = d[scope.lineId]; 
                  scope.filterLines({
                        prop: scope.lineId,
                        val: d[scope.lineId]
                    })});
            

            var buttondata = ['forward', 'back']
            lineToAppendTo.selectAll('button-circles')
                .data(buttondata)
                .enter()
                .append('rect')
                .attr('id', (d,i)=>'button-'+i + '-'+ typeProp)
                .style('fill', 'darkgrey')
                .attr('x', (d,i)=> {if(i===1)return 1000
                                    return 200})
                .attr('y', 192)
                .attr('height', 15)
                .attr('width', 15)

            d3.select('#button-0-'+typeProp)
                .on('click', function(){
                    startData = startData + 6;
                    if(startData > 50) startData = startData - 6;
                    console.log('hit', startData)
                    trimmedData = data.slice(data.length-startData-7, data.length-startData) 
                    console.log(trimmedData)
                    var changeCircles = d3.select("#" + scope.lineId).transition()

                    const newXScale = d3.scale.linear().domain(d3.extent(data, (d) => d[scope.xProp])) // scaling x-axis, so values al fit on line and are relative
                        .range([300, 900])

                    circles
                        .data(trimmedData)
                        .transition()
                        .attr('cx', (d,i) => {
                            console.log(d.salary)
                    if(newXScale(d.salary)> 600){
                        if(i<trimmedData.length&& i!==0)if(newXScale(d.salary) - newXScale(trimmedData[i-1].salary) < 50) {
                        console.log('first',newXScale(d.salary))
                        return (newXScale(d.salary)-(50*(trimmedData.length-i)))
                        }
                    }
                    if(i>0)if(newXScale(d.salary) - newXScale(trimmedData[i-1].salary) < 50) {
                        console.log(newXScale(d.salary))
                        return (newXScale(d.salary)+(50*i))
                    }
                    console.log(newXScale(d.salary))
                    return newXScale(d.salary)})                
                })
            
        d3.select('#button-1-'+typeProp)
                .on('click', function(){
                    startData = startData - 6;
                    if(startData <0) startData = 0;
                    console.log('hit', startData)
                    trimmedData = data.slice(data.length-startData-7, data.length-startData) 
                    console.log(trimmedData)
                    var changeCircles = d3.select("#" + scope.lineId).transition()

                    const newXScale = d3.scale.linear().domain(d3.extent(trimmedData, (d) => d[scope.xProp])) // scaling x-axis, so values al fit on line and are relative
                        .range([300, 900])

                    console.log()

                    circles
                        .data(trimmedData)
                        .transition()
                        .attr('cx', (d,i) => {
                        if(newXScale(d.salary)> 600){
                            if(i>0)if(newXScale(d.salary) - newXScale(trimmedData[i-1].salary) < 50) {
                            console.log('first',newXScale(d.salary))
                            return (newXScale(d.salary)+(50*(trimmedData.length-i)))
                            }
                        }
                        if(i>0)if(newXScale(d.salary) - newXScale(trimmedData[i-1].salary) < 50) {
                            console.log(newXScale(d.salary))
                            return (newXScale(d.salary)+(50*i))
                        }
                        console.log(newXScale(d.salary))
                        return newXScale(d.salary)})                
                })

        }

        function getNewData(filter,data, typeProp, dataposition, currentCircle) {
            if($rootScope.directiveCheck !==typeProp )return 0;
            data = data.filter((obj)=> obj[typeProp] === filter)
                 data = data.sort((a,b)=> b.salary - a.salary);
                 data = data.slice(0,6)
            const xScale = d3.scale.linear().domain(d3.extent(data, (d) => d[scope.xProp])) // scaling x-axis, so values al fit on line and are relative
                .range([300, 1000]);

            const rScale = d3.scale.linear().domain([1,5]) // scaling radius size
                .range([rMin, rMax]);

            var circles = d3.selectAll('.prop-' + typeProp);
            var circle = d3.select('#'+currentCircle)
            circles[0] = circles[0].filter((obj)=>{
                if(obj !== circle[0][0])return true;
                return false;
            })

            circles
                .transition()
                .attr('r', 0);            
            
                circle
                    .transition()
                    .ease('linear')
                    .attr('r', 40)

            

                circle
                    .transition()
                    .delay(500)
                    .duration(500)
                    .attr('cx', 600)
                
            const lineToAppendTo = d3.select("#" + scope.lineId)
                    var fakeCirclesLine = lineToAppendTo.selectAll('fakeData' + typeProp)
                      const smallTip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html((d) => 
                        `<span>${d.company}</span><br><span>${d.jobTitle}</span><br><span>$${scope.xProp === 'salary' && d[scope.xProp] ? numberWithCommas(d[scope.xProp]) : d[scope.xProp]}</span><br><span> work/life: ${d[rProperty]}</span>`);
            lineToAppendTo.call(smallTip); 

                    var tempXScale = d3.scale.linear().domain(d3.extent(data, (d)=>d.salary)).range([300,900])
                        console.log('hit' + typeProp)
                        fakeCirclesLine
                            .data(data)
                            .enter()
                            .append('circle')
                            .attr('class', 'tempCircles' + typeProp)
                            .attr('fill', 'grey')
                            .attr('r', 0)
                            .attr('cx', 600)
                            .attr("cy", 200)
                            .transition()
                            .delay((d,i)=>{
                                if(i===0||i===5) return 1000; 
                                if(i===1||i===4) return 1200; 
                                return 1400})
                            .duration(200)
                            .ease('linear')
                            .attr('r', 20)
                            .attr('cx',(d,i)=>{
                                if((i*100)+300 >= 600) return (i*100)+400
                                return (i*100)+300
                            })





                        var fakeCircles = d3.selectAll('.tempCircles'+typeProp)
                        fakeCircles
                            .on('mouseover', smallTip.show)
                            .on('mouseout', smallTip.hide)
                            .on('click', (d)=>{
                            
                        fakeCircles
                                .transition()
                                .attr('r',0)
                                .remove()

                            d3.selectAll('.d3-tip').remove()
                            d3.selectAll('rect').remove()
                        
                            circle.remove()
                                .transition()
                                .delay(1000)
                                .attr('r',0)
                                .remove()
                            circles.remove()
                            render(scope.lineData, scope.lineId, startData)
                        })

             

        }

    };

    return {
        restrict: 'E',
        scope: {
            lineId: '@',
            viewLabel: '@',
            filterLines: '&',
            lineData: '='
        },
        templateUrl: 'app/common/directives/dataLine/dataLine.html',
        link: lineCirclesLink
    };
});
