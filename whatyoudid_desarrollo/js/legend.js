var legendWidth=400,
    legendHeight=100;
var LEGEND_V_MARGIN = 20;
var LEGEND_H_MARGIN_COLOR = 40;
var LEGEND_H_MARGIN = 35;

 var jsonCirclesMap = [
    { "titleColor" : "#FFFFFF", "name": "Limbo", "id":"0"},
    { "titleColor": "#DB57D0", "name": "Dome", "id":"1"},
    { "titleColor": "#DDB0BF", "name": "Complex", "id":"2"},
    { "titleColor": "#09AE48", "name": "Hall", "id":"3"},
    { "titleColor": "#7ED96D", "name": "Planta", "id":"4"},
    { "titleColor": "#BF0CB9", "name": "Village", "id":"5"},
    { "titleColor": "#B9DBA2", "name": "Sonar+D", "id":"7"}];

printRoomLegend = function(circles) {

        legendSvgContainer.selectAll("text")
            .data(jsonCirclesMap)
            .enter()
            .append("text")
                .attr("x", function(d, i) { 
                    return (i+1)*LEGEND_H_MARGIN;
                })
                .attr("y", LEGEND_V_MARGIN)
                .attr("text-anchor", "end")
                .attr("fill", "#3e78f3")
                .attr("data-room", function(d){return d["id"]})
                .attr("font-family", "Glegoo")
                .attr("class", "opacitySensible legend")
                .attr("font-size", ".32em")
                .text(function(d) { return d.name });
        legendSvgContainer.selectAll("rect")
            .data(jsonCirclesMap)
            .enter()
            .append("rect")
                .attr("x", function(d, i) { 
                    return (i+1)*LEGEND_H_MARGIN+4;
                })
                .attr("y", LEGEND_V_MARGIN-4)
                .attr("width", 4)
                .attr("class", "opacitySensible legend")
                .attr("data-room", function(d){return d["id"]})
                .attr("height", 4)
                .style("fill", function(d) { return d.titleColor })
                .style("stroke", function(d) { return d.titleColor });
    }

var legendDiv = d3.select("#legend");

var legendSvgContainer = legendDiv.append("svg")
    .attr("class", "legend-svg")
    .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight)
    .attr("preserveAspectRatio", "xMinYMin meet");

printRoomLegend(jsonCirclesMap);