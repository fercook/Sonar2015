queue()
  .defer(d3.json, "./DATA/testdata.json")
  .await(ready);

var jsonCirclesMap = [
    { "x": 400, "y": 400, "diameter": 800, "titleAngle" : Math.PI/4, "titleColor": "#FFFFFF", "lineMargin": 5,  "name": "Limbo", "nameId":"Limbo",      "eventsName": "Limbo",                                  "id":"0", "angle": Math.PI*3/4, "titleX": "0em" },
    { "x": 210, "y": 228, "diameter": 160, "titleAngle" : Math.PI,   "titleColor": "#DB57D0", "lineMargin": 10, "name": "Dome", "nameId":"Dome",        "eventsName": "SonarDome by Red BULL Music Academy",    "id":"1", "angle": Math.PI*3/4, "titleX": "-2.5em"},
    { "x": 222, "y": 546, "diameter": 155, "titleAngle" : Math.PI,   "titleColor": "#DDB0BF", "lineMargin": 10, "name": "Complex", "nameId":"Complex",  "eventsName": "SonarComplex",                           "id":"2", "angle": Math.PI*3/4, "titleX": "-3.7em"},
    { "x": 590, "y": 234, "diameter": 150, "titleAngle" : 0,         "titleColor": "#09AE48", "lineMargin": 10, "name": "Hall", "nameId":"Hall",        "eventsName": "SonarHall",                              "id":"3", "angle": Math.PI*3/4, "titleX": "0em"},
    { "x": 630, "y": 440, "diameter": 140, "titleAngle" : 0,         "titleColor": "#7ED96D", "lineMargin": 10, "name": "Planta", "nameId":"Planta",    "eventsName": "Planta",                                 "id":"4", "angle": Math.PI*3/4, "titleX": "0em"},
    { "x": 400, "y": 378, "diameter": 250, "titleAngle" : Math.PI/2, "titleColor": "#BF0CB9", "lineMargin": 10, "name": "Village", "nameId":"Village",  "eventsName": "SonarVillage by ESTRELLA DAMM",          "id":"5", "angle": Math.PI*3/4, "titleX": "-1.5em"},
    { "x": 500, "y": 618, "diameter": 190, "titleAngle" : 0,         "titleColor": "#B9DBA2", "lineMargin": 10, "name": "Sonar+D", "nameId":"PlusD",    "eventsName": "Hall+D",                                 "id":"6", "angle": Math.PI*3/4, "titleX": "0em"}];

var LIMBO = 0;

function ready(error, jsonfile, device_mac) {
    var dayColors = ["#FFA800", "#FFFFFF", "#00AFFF"]
    var dayTriangleColors = ["#a66d02", "#999999", "#006999"]
    var SIZE = 2;
    var TICK_RADIUS = 10;
    var HOUR_RADIUS = 5;
    var ARTIST_RADIUS = 40;
    var ARTIST_SPACE = 20;
    var ROOM_NAME_RADIUS = 50;
    var MAXIMUM_TIME = 20;
    var MAXIMUM_JUMP = 10000;
    var LIMBO_POLY_COLOR = "#30d4fd";
    var LEFT_MARGIN = 400;
    var TOP_MARGIN = 200;
    var width = 800,
        height = 800;
    var DAILY_RADIUS = 25;
    var DAILY_VERTICAL_MARGIN = 20;
    var DAILY_H_MARGIN_CHART = 150;
    var DAILY_H_MARGIN_TEXT = 45;
    var DAILY_H_MARGIN_CHECK = 20;
    var DAILY_CHECK_SIDE = 20;
    var DAILY_WEIGHT = 15;
    var dailyWidth=250,
        dailyHeight = 400;
    var legendWidth=40,
        legendHeight=100;
    var LEGEND_V_MARGIN = 8;
    var LEGEND_H_MARGIN_COLOR = 40;
    var MAX_NUM_OF_ARTISTS = 6;
    var artistWidth = 600,
        artistHeight = 600;
    var currentDeviceMac = device_mac;

    var dayPermission = [true, true, true];

    var lastArcId = -1;

    var lineIdGenerator = 0;
    var arcIdGenerator = -1;
    var steps = []

  var userSteps;
  /*if(localStorage.getItem('datainput')) userSteps = localStorage.getItem('datainput');
  else {
    var records = crossfilter(jsonfile);
    var userDimension = records.dimension(function(d) { return [d.id, d.room, d.time]; });
    userDimension.filter("a88898c7-f2ad-11e4-a412-0088653e3f56")
    datainput = userDimension.group().top(10000);
    userSteps = JSON.stringify(datainput)
    // Put the object into storage
    localStorage.setItem('datainput', userSteps);
  }*/

  userSteps = jsonfile;

  if(userSteps.length < 1) d3.select("#errorMessage").style("visibility", "visible");
  else d3.select("#errorMessage").style("visibility", "hidden");

    var directionline = d3.svg.line()
                .x(function(d) {
                  return d[0];
                })
                .y(function(d) {
                  return d[1];
                });

  /*var fill = d3.scale.ordinal()
      .range(["#f0f0f0", "#d9d9d9", "#bdbdbd"]);*/

    var getAngleOfLine = function(a, b) {
        dy = (b.y - a.y)*-1;
        dx = b.x - a.x;
        theta = Math.atan2(dy, dx);
        theta *= 180/Math.PI; // rads to degs
        return theta;
    };

    /**
     * Given an angle, diameter and center returns the point of the circumference
     * with this angle.
     *
     * Angle in radiants.
     */
    var getCirclePoint = function(angle, diameter, center) {
        var newX = center["x"]+(diameter/2)*Math.cos(angle)
        var newY = center["y"]+(diameter/2)*Math.sin(angle)
        return [newX, newY];
    }


    var printHour = function(circlesData) {
        initAngle = -Math.PI*2/6;
        for(var i = 1; i <= 12; ++i) {
            for(var j = 0; j < circlesData.length; ++j) {
                var tickRadius;
                var srokeWidth;
                if(j == 0) {
                    tickRadius = circlesData[j]["diameter"]/14;
                    srokeWidth = 3;
                }
                else {
                    tickRadius = circlesData[j]["diameter"]/8;
                    srokeWidth = 1;
                }
                var printHourText = false;
                if(i == 12 || i == 3 || i == 6 || i == 9) {
                    srokeWidth = circlesData[j]["diameter"]/40;
                    tickRadius = circlesData[j]["diameter"]/7;
                    printHourText = true;
                }
                var pointA = getCirclePoint(initAngle, circlesData[j]["diameter"]+tickRadius/2, circlesData[j]);
                var pointB = getCirclePoint(initAngle, circlesData[j]["diameter"]-tickRadius/2, circlesData[j]);
                svgContainer
                    .append("path")
                      .attr("class", "line")
                      .attr("d", directionline([pointA, pointB]))
                      .attr("stroke", "#B2B2B2")
                      .attr("stroke-width", srokeWidth)
                      .attr("opacity", 0.5);

                /*if(printHourText) {
                    var pointText = getCirclePoint(initAngle, circlesData[j]["diameter"]-circlesData[j]["diameter"]/HOUR_RADIUS, circlesData[j]);
                    var fontSize = circlesData[j]["diameter"]/15;
                    svgContainer.append("text")
                        .attr("x", pointText[0])
                        .attr("y", pointText[1])
                        .attr("dy", ".35em")
                        .style("font-size", fontSize + "px")
                        .style("fill", "#B2B2B2")
                        .style("text-anchor", "middle")
                        .text(i);
                }*/
            }
            initAngle += Math.PI/6;
        }

        svgContainer.append("g").selectAll("path");
    };

    var printActivityWaterBar = function(circlesData) {
      for(var day = 0; day < 3; ++day) {
        svgContainer.append("g").selectAll("circle")
              .data(circlesData)
              .enter()
              .append("circle")
                .attr("class", "line")
                .attr("cx", function(d){return d["x"]})
                .attr("cy", function(d){return d["y"]})
                .attr("r",  function(d){return (d.diameter/2)-5-day*d.lineMargin})
                .attr("opacity", 0.1)
                .attr("stroke-width", function(d){return  d.lineMargin;})
                .attr("stroke", dayColors[day])
                .attr("fill-opacity", 0);
      }
    };

    var printColorShadow = function(circlesData) {
        svgContainer.append("g").selectAll("circle")
              .data(circlesData)
              .enter()
              .append("circle")
                .attr("data-room", function(d){return d["id"]})
                .attr("class", "shadowColor")
                .attr("cx", function(d){return d["x"]})
                .attr("cy", function(d){return d["y"]})
                .attr("r",  function(d){return d["diameter"]/2+10;})
                .attr("stroke-width", 0)
                .attr("fill", function(d){return d["titleColor"]});
    };

    var printScenario = function() {
        d3.selectAll("#fingerprint").selectAll("*").remove();

        /**
         * GLOBAL VARIABLES.
         */
        svgContainer = d3.select("#fingerprint").append("svg")
            .attr("class", "general-svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            .style("position", "absolute");

        activityContainer = svgContainer.append("g");
        arcHourContainer = svgContainer.append("g");

        svgContainer.selectAll("text")
                    .data(jsonCirclesMap)
                    .enter()
                    .append("text")
                        .attr("x", function(d) { return getCirclePoint(-d.titleAngle, d["diameter"]+ROOM_NAME_RADIUS, d)[0]; })
                        .attr("y", function(d) { return getCirclePoint(-d.titleAngle, d["diameter"]+ROOM_NAME_RADIUS, d)[1]; })
                        .attr("fill", function(d) { return d.titleColor;})
                        //.attr("dy", ".35em")
                        .attr("dx", function(d) { return d.titleX; })
                        .attr("font-family", "Nexa")
                        .attr("font-weight", "Bold")
                        .text(function(d) { return d.name });


        /*var circleAttributes = circles
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.diameter/2; })
            .style("fill", function(d) { return d.color; })
            //.style("stroke", "black")
            //.style("stroke-width", "10px")
            .style("opacity", 1);*/

        printHour(jsonCirclesMap.slice(1, jsonCirclesMap.length));
        printActivityWaterBar(jsonCirclesMap);

        printColorShadow(jsonCirclesMap.slice(1, jsonCirclesMap.length));

        var initTime = 0;
        var lastDot = undefined;
        var currentRoom = -1;
        var lastDay = -1;
        var dayInit;
        for(var i = 0; i <= userSteps.length && userSteps.length > 0 ; ++i) {
            if (i >= userSteps.length || currentRoom != userSteps[i].room) {
                if(currentRoom != -1) {
                    dayInit = Math.floor(userSteps[i-1].initTime/720) + 1;
                    var auxReturn = printDot(userSteps[i-1].room, userSteps[i-1].finalTime-userSteps[i-1].initTime, userSteps[i-1].initTime, lastDot, dayInit != lastDay, dayInit);
                    lastDot = auxReturn[0];
                    lastDay = auxReturn[1];
                    initTime = userSteps[i-1].time;
                }
                if(i < userSteps.length) currentRoom = userSteps[i].room;
            }
        }
    };


    var lastDot = undefined;
    var lastDurationDot = undefined;
    var poli = [];

    var calculateMiddlePoints = function(x1, y1, x2, y2) {
        var MARGIN = 50; //10 pixels between one contabiliced point and the next.

        margin = (x2-x1)/MARGIN;
        result = [];
        result[0] = [x1, y1]
        var m = (y2 - (y1))/(x2-x1);
        while(x1 != x2) {
            x1 += margin;
            if(margin < 0)
                x1 = Math.max(x1, x2);
            else x1 = Math.min(x1, x2);
            y1 = m*x1+y2-m*x2;
            result[result.length] = [x1, y1];
        }
        return result;
        //if(x1 >= x2) return [];
        //else {
        //    x1 = Math.min(x1+MARGIN, x2);
        //    points = calculateMiddlePoints(m, x1, x2, y2);
        //    y1 = m*x1+y2-m*x2;
        //    result = [[x1, y1]];
        //    result += points;
        //    return result;
        //}
    }

    var printPolygon = function(x1, y1, x2, y2, color) {
        var points = calculateMiddlePoints(x1, y1, x2, y2);

            var strokeWidth;

            var test = points.length/6;

            for(var i = 0; i < points.length-1; ++i) {
                var lineDots = [points[i], points[i+1]];
                strokeWidth = i/test+1;
                strokeWidth = Math.max(2.5, strokeWidth);
                  svgContainer
                    .append("path")
                      .attr("class", "line")
                      .attr("d", directionline(lineDots))
                      .attr("stroke", color || "black")
                      .attr("fill", color || "black")
                      .attr("stroke-width", strokeWidth)
                      .attr("opacity", 0.8)
                      .style("stroke-linecap", "butt");
            }
    };

    var getLimboPoint = function (x, y) {
      var decisiveAxis;
      if(Math.abs(x) > Math.abs(y)) {
        if(x < 0) return {x: jsonCirclesMap[0].x - jsonCirclesMap[0].diameter/2, y: jsonCirclesMap[0].y};
        else return {x: jsonCirclesMap[0].x + jsonCirclesMap[0].diameter/2, y: jsonCirclesMap[0].y};
      }
      else {
        if(y < 0) return {x: jsonCirclesMap[0].x, y: jsonCirclesMap[0].y  - jsonCirclesMap[0].diameter/2};
        else return {x: jsonCirclesMap[0].x, y: jsonCirclesMap[0].y + jsonCirclesMap[0].diameter/2};
      }
    }

    var degreeToRadians = function(angleDegree) {
        return (Math.abs(angleDegree)-90) * Math.PI / 180.0;
    }


    getClockArcRadius = function(day, diameter, lineWidth) {
        return (diameter/2)-5-(day-1)*lineWidth;
    }


    var applyMouseLeave = function() {
        if(lastArcId != -1) {
            d3.selectAll(".arcHour")
                .classed("active", false);
            d3.selectAll(".shadowColor")
                .classed("active", false);
            d3.selectAll(".artist")
                .attr('visibility', "hidden")
                .attr('opacity', 0);
            svgContainer.classed("darken", false)
            dailySvgContainer.classed("darken", false)
            legendSvgContainer.classed("darken", false)
            d3.selectAll(".total-visibility")
                .classed("highlighted-line", false)
                .classed("total-visibility", false);
            lastArcId = -1;
        }
    };

    var printClockText = function(hourContainer, initAngle, finalAngle, initTime, finalTime, circle, arcId) {
        initAngle -= Math.PI/2;
        finalAngle -= Math.PI/2;

        initMinutes = Math.floor(initTime%60).toString();
        if(initMinutes.length == 1) initMinutes = "0".concat(initMinutes);
        finalMinutes = Math.floor(finalTime%60).toString();
        if(finalMinutes.length == 1) finalMinutes = "0".concat(finalMinutes);

        initHour = Math.floor(12 + initTime/60) + ":" + initMinutes;
        finalHour = Math.floor(12 + finalTime/60) + ":" + finalMinutes;

        var initPointText = getCirclePoint(initAngle, circle.diameter+30, circle);
        var finalPointText = getCirclePoint(finalAngle, circle.diameter+30, circle);
        var fontSize = circle.diameter/15;
        fontSize = Math.min(fontSize, 18)
        fontSize = Math.max(fontSize, 12)
        hourContainer.append("text")
            .attr("x", initPointText[0])
            .attr("y", initPointText[1])
            .attr("dy", ".35em")
            .style("font-size", fontSize + "px")
            .style("fill", "#B2B2B2")
            .style("text-anchor", "middle")
            .attr("class", "arcHour")
            .attr("data-arc-id", arcId)
            .text(initHour);

        if(Math.abs(initAngle - finalAngle) > Math.PI/8) {
            hourContainer.append("text")
                .attr("x", finalPointText[0])
                .attr("y", finalPointText[1])
                .attr("dy", ".35em")
                .style("font-size", fontSize + "px")
                .style("fill", "#B2B2B2")
                .style("text-anchor", "middle")
                .attr("class", "arcHour")
                .attr("data-arc-id", arcId)
                .text(finalHour);
        }
    }

    var printClock = function(initTime, totalTime, circle, day, isLimbo) {
        ++arcIdGenerator;
        var clockRadius = getClockArcRadius(day, circle.diameter, circle.lineMargin);
        initTime -= (day-1)*720;

        initAngle = posAngle(initTime);
        finalAngle = posAngle(totalTime + initTime);

        var opacity = 0.9;

        var arc = d3.svg.arc();
        var clockRadiusOuter = clockRadius+circle.lineMargin/2;
        var clockRadiusInner = clockRadiusOuter-circle.lineMargin;
        arc.innerRadius(clockRadiusInner);
        arc.outerRadius(clockRadiusOuter);
        arc.startAngle(initAngle);
        arc.endAngle(finalAngle);

        svgContainer.append("path")
            .attr("d", arc)
            .attr("class", "opacitySensible")
            .attr("transform", "translate(" + circle.x + "," + circle.y + ")")
            .attr('fill', dayColors[day-1])
            //.attr('stroke', dayColors[day-1])
            .attr("opacity", opacity)
            .attr("data-room", circle.id)
            .attr("data-arc-id", arcIdGenerator)
            .attr("data-day", day)
            .on("mouseenter", function() {
                applyMouseLeave();
                var roomNum = d3.select(event.target).attr("data-room");
                var arcId = d3.select(event.target).attr("data-arc-id");
                if(arcId == lastArcId) lastArcId = -1; //Anulate arc occultation.
                var day = d3.select(event.target).attr("data-day");
                d3.select("[data-line-id='"+ (arcId) +"']")
                    .classed("highlighted-line", true)
                    .classed("total-visibility", true);
                d3.select("[data-line-id='"+ (parseInt(arcId)+1) +"']")
                    .classed("highlighted-line", true)
                    .classed("total-visibility", true);
                d3.selectAll("[data-arc-id='"+ arcId +"']").classed("total-visibility", true);
                d3.select(".shadowColor[data-room='"+ roomNum +"']")
                    .classed("active", true);
                d3.selectAll(".legend[data-room='"+ roomNum +"']")
                    .classed("total-visibility", true);
                d3.selectAll(".day-text[data-day='"+ (day-1) +"']")
                    .classed("total-visibility", true);
                d3.select(".shadowColor[data-arc-id='"+ roomNum +"']");
                d3.selectAll(".artist[data-arc-id='"+ arcId +"']")
                    .attr('visibility', "visible")
                    .attr('opacity', 1);
                d3.selectAll(".arcHour[data-arc-id='"+ arcId +"']")
                    .classed("active", true);
                svgContainer.classed("darken", true)
                dailySvgContainer.classed("darken", true)
                legendSvgContainer.classed("darken", true)
            })
            .on("mouseleave", function() {
                lastArcId = d3.select(event.target).attr("data-arc-id"); 
                setTimeout(applyMouseLeave, 1000);
            });

            printClockText(svgContainer, initAngle, finalAngle, initTime, initTime+totalTime, circle, arcIdGenerator)

        return [
            [
             circle.x + clockRadius*Math.sin(initAngle),
             circle.y - clockRadius*Math.cos(initAngle)
            ],
            [
             circle.x + clockRadius*Math.sin(finalAngle),
             circle.y - clockRadius*Math.cos(finalAngle)
            ],
             dayColors[day-1]
            ];
    };

    var printDailyGraph = function(initTime, totalTime, roomCircle, day, isLimbo, hasClockRepresentation) {
        initTime -= (day-1)*720;

        var initAngle = posAngle(initTime);
        var finalAngle = posAngle(totalTime + initTime);

        var opacity = 0.9;

        var arc = d3.svg.arc();
        var clockRadiusOuter = DAILY_RADIUS+DAILY_WEIGHT/2;
        var clockRadiusInner = DAILY_RADIUS-DAILY_WEIGHT/2;
        arc.innerRadius(clockRadiusInner);
        arc.outerRadius(clockRadiusOuter);
        arc.startAngle(initAngle);
        arc.endAngle(finalAngle);

        var arcDayResume = dailySvgContainer.select('g').append("path")
            .attr("d", arc)
            .attr("class", "opacitySensible")
            .attr("transform", "translate(" + (DAILY_RADIUS+DAILY_H_MARGIN_CHART) + "," + (DAILY_RADIUS+DAILY_WEIGHT/2+(DAILY_RADIUS*2+DAILY_WEIGHT+DAILY_VERTICAL_MARGIN)*day) + ")")
            .attr('fill', roomCircle.titleColor)
            //.attr('stroke', dayColors[day-1])
            .attr("opacity", opacity);

        if(hasClockRepresentation) arcDayResume.attr("data-arc-id", arcIdGenerator);
    }

    var printConnectionLine = function(x1, y1, x2, y2, color, lineId) {
        var shadowLineGraph = svgContainer.append("path")
            .attr("d", directionline([[x1, y1],[x2, y2]]))
            .attr("class", "opacitySensible")
            .attr("stroke", "black")
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .attr("opacity", 0.4)
            .attr("pointer-events", "none");
        var lineGraph = svgContainer.append("path")
            .attr("d", directionline([[x1, y1],[x2, y2]]))
            .attr("class", "opacitySensible")
            .attr("data-line-id", lineIdGenerator)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("pointer-events", "none");
    }

    var printNewDaySignal = function(initTime, circleRoom, day) {
        initAngle = posAngle(initTime+1)-Math.PI/2;
        finalAngle = posAngle(10 + day*2 + initTime)-Math.PI/2;
        var radius = getClockArcRadius(day, circleRoom.diameter, circleRoom.lineMargin)
        radiusSup = radius + circleRoom.lineMargin/2;
        radiusInf = radius - circleRoom.lineMargin/2;
        var triangle = [];
        triangle[0] = getCirclePoint(initAngle, radiusSup*2, circleRoom);
        triangle[1] = getCirclePoint(initAngle, radiusInf*2, circleRoom);
        triangle[2] = getCirclePoint(finalAngle, radius*2, circleRoom);
        svgContainer.append("polygon")
            .style("stroke", dayTriangleColors[day-1])
            .style("stroke-width", 1)
            .style("opacity", 1)
            .style("fill", dayTriangleColors[day-1])
            .attr("pointer-events", "none")
            //.style("mix-blend-mode", "multiply")
            .attr("points", triangle.map(function(d) {
              return [d[0],d[1]].join(",");
                }).join(" "));
    }

    var printDot = function(room, totalTime, initTime, lastDot, isNewDay, dayInit) {
        console.log("Time " + initTime);
        var diameter = d3.scale.linear()
          .domain([0, 10000])
          .range([1, 5]);

        var isLimbo = (room == LIMBO);

        var dayEnd = Math.floor((initTime+totalTime)/720) + 1;
        if(dayInit != dayEnd) {
          var remainingDayTime = 720 - initTime%720 - 1;
          var auxResult = printDot(room, remainingDayTime, initTime, lastDot, isNewDay, dayInit);
          lastDot = auxResult[0];
          dayInit = auxResult[1];
          initTime = initTime + remainingDayTime + 1;
          totalTime = totalTime - remainingDayTime;
          lastDot = null;
          isNewDay = true;
        }

        if(dayPermission[dayEnd-1]) {
            dots = printClock(initTime, totalTime, jsonCirclesMap[room], dayEnd, isLimbo);
            if(lastDot) {
                printConnectionLine(lastDot[0], lastDot[1], dots[0][0], dots[0][1], dots[2]);
                //printPolygon(lastDot[0], lastDot[1], dots[0][0], dots[0][1], dots[2]);
            }
            if(isNewDay) printNewDaySignal(initTime, jsonCirclesMap[room], dayEnd);
            lastDot = dots[1];
            steps[steps.length] = {"initTime": initTime, "finalTime": initTime+totalTime, "room": room, "generatedId": lineIdGenerator}
            ++lineIdGenerator;
        }


        printDailyGraph(initTime, totalTime, jsonCirclesMap[room], dayEnd, isLimbo, dayPermission[dayEnd-1]);

        return [lastDot, dayEnd];
    }

    var stroke = d3.scale.linear()
      .domain([1, 1000])
      .range(["#e5be24", "#0531ae"]);

    var durationWidth = d3.scale.linear()
      .domain([0, 20000])
      .range([1, 5]);

    var totalTime = 0;

  /*var treemap = d3.layout.treemap()
      .size([width, height])
      .value(function(d) { return d.size; });
  */
  //var bundle = d3.layout.bundle();

    var line = d3.svg.line()
      .interpolate("bundle")
      .tension(.85)
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

    var posAngle = d3.scale.linear()
      .domain([0, 720])
      .range([0, 2*Math.PI]);

  /*d3.json("/d/1044242/readme-flare-imports.json", function(error, classes) {
    var nodes = treemap.nodes(packages.root(classes)),
        links = packages.imports(nodes);*/

    /*div.selectAll(".cell")
        .data(nodes)
      .enter().append("div")
        .attr("class", "cell")
        .style("background-color", function(d) { return d.children ? fill(d.key) : null; })
        .call(cell)
        .text(function(d) { return d.children ? null : d.key; });*/

    printDailyDayText = function() {
        for(var i = 1; i < 4/* NumberOfDays*/; ++i) {
            dailySvgContainer.append("text")
                .attr("x", DAILY_H_MARGIN_TEXT)
                .attr("y", (DAILY_RADIUS+DAILY_WEIGHT/2+(DAILY_RADIUS*2+DAILY_WEIGHT+DAILY_VERTICAL_MARGIN)*i))
                .attr("dy", ".35em")
                .attr("font-family", "Nexa")
                .attr("font-weight", "Light")
                .attr("data-day", i-1)
                .attr("class", "day-text opacitySensible")
                .style("font-size", 28)
                .style("fill", dayColors[i-1])
                .text("Day " + parseInt(i));

            dailySvgContainer.append("rect")
                .attr("x", DAILY_H_MARGIN_CHECK)
                .attr("y", (DAILY_RADIUS+DAILY_WEIGHT/2+(DAILY_RADIUS*2+DAILY_WEIGHT+DAILY_VERTICAL_MARGIN)*i)-DAILY_CHECK_SIDE/2)
                .attr("width", DAILY_CHECK_SIDE)
                .attr("height", DAILY_CHECK_SIDE)
                .attr("class", "day-text opacitySensible")
                .attr("data-day", parseInt(i-1))
                .style("fill", dayColors[i-1])
                .style("stroke", dayColors[i-1])
                .on("click", function() {
                    d3.select(event.target)
                        .style("fill-opacity", -1*parseInt(d3.select(event.target).style("fill-opacity")))
                    d3.selectAll("#fingerprint").selectAll("*").remove();
                    d3.selectAll("#dailyfingerprint svg g").selectAll("*").remove();
                    var dayIndex = d3.select(event.target).attr("data-day");
                    dayPermission[dayIndex] = !dayPermission[dayIndex];
                    printScenario();
                });
        }
    };

    d3.selectAll("#dailyfingerprint").selectAll("*").remove();

    var dailyDiv = d3.select("#dailyfingerprint");

    var dailySvgContainer = dailyDiv.append("svg")
        .attr("class", "daily-svg")
        .style("position", "absolute")
        .attr("viewBox", "0 0 " + dailyWidth + " " + dailyHeight)
        .attr("preserveAspectRatio", "xMinYMin meet");

    dailySvgContainer.append('g');

    printDailyDayText();

    // svgContainer.append("linearGradient")
    //     .attr("id", "line-gradient")
    //     .attr("gradientUnits", "userSpaceOnUse")
    //     .attr("x1", 0).attr("y1", 0)
    //     .attr("x2", 0).attr("y2", 1000)
    // .selectAll("stop")
    //     .data([
    //         {offset: "0%", color: "red"},
    //         {offset: "40%", color: "red"},
    //         {offset: "40%", color: "black"},
    //         {offset: "62%", color: "black"},
    //         {offset: "62%", color: "lawngreen"},
    //         {offset: "100%", color: "lawngreen"}
    //     ])
    // .enter().append("stop")
    //     .attr("offset", function(d) { return d.offset; })
    //     .attr("stop-color", function(d) { return d.color; });

    retrieveEvents = function(initTime, finalTime, room, json) {
        var found = false;
        var i;
        var events = [];
        json = json[room];
        for(i = 0; i < json.length; ++i)
            if (json[i].initTime < finalTime &&
                json[i].finalTime > initTime )
                    events[events.length] = json[i];
            else if(json[i].initTime > finalTime) return events;
        return events;
    }

    _addToArtistList = function(artistList, eventName, id, room, percent) {
        found = false;
        for(var i = 0; i < artistList.length && !found; ++i) {
            if(artistList[i].id == id) {
                console.log('Already visited event.');
                artistList[i].percent += percent;
                found = true;
            }
        }
        if(!found) artistList[artistList.length] = {'id':id, 'eventName': eventName, 'percent': percent, 'room': room};
    };

    /*
        x: x-coordinate
        y: y-coordinate
        w: width
        h: height
        r: corner radius
        tl: top_left rounded?
        tr: top_right rounded?
        bl: bottom_left rounded?
        br: bottom_right rounded?
    */
    function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
        var retval;
        retval  = "M" + (x + r) + "," + y;
        retval += "h" + (w - 2*r);
        if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
        else { retval += "h" + r; retval += "v" + r; }
        retval += "v" + (h - 2*r);
        if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
        else { retval += "v" + r; retval += "h" + -r; }
        retval += "h" + (2*r - w);
        if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
        else { retval += "h" + -r; retval += "v" + -r; }
        retval += "v" + (2*r - h);
        if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
        else { retval += "v" + -r; retval += "h" + r; }
        retval += "z";
        return retval;
    }

    _printCircleArtist = function(list, room, arcId) {
        var angle = -Math.PI*1/6;
        for(var i=0; i < Math.min(list.length, MAX_NUM_OF_ARTISTS); ++i) {
            if(list[i].eventName != "No Activity") {
                point = getCirclePoint(angle, jsonCirclesMap[0]["diameter"]*1.4, jsonCirclesMap[0]);
                var artistDiv = artistSvgContainer.append("g")
                    .attr("class", "artist")
                    .attr("visibility", "hidden")
                    .attr("opacity", 0)
                    .attr("data-arc-id", arcId)
                    .on("mouseenter", function() {
                        lastArcId = -1;
                    })
                    .on("mouseleave", function() {
                        lastArcId = d3.select(event.target.parentElement).attr("data-arc-id");
                        setTimeout(applyMouseLeave, 1000);
                    });
                artistDiv.append("path")
                    .attr("d", function(d) {
                      return rounded_rect(point[0]-ARTIST_RADIUS-10, point[1]-ARTIST_RADIUS-10, 280, ARTIST_RADIUS*2+20, Math.PI*2, true, true, true, true);
                    })
                    .attr("fill", "#575b5a")
                    .attr("opacity", 0.5);

                /*artistDiv.append("circle")
                  .attr("class", "room"+room)
                  .attr("cx", point[0])
                  .attr("cy", point[1])
                  .attr("r", ARTIST_RADIUS)
                  .attr("fill", "white");*/
                var aImg = artistDiv.append("a")
                    .attr("xlink:href", list[i].url);
                aImg.append("image")
                    .attr('x', point[0]-ARTIST_RADIUS)
                    .attr('y', point[1]-ARTIST_RADIUS)
                    .attr('xlink:href',list[i].pic)
                    .attr("class", "room"+room)
                    .attr('height', ARTIST_RADIUS*2)
                    .attr('width', ARTIST_RADIUS*2);

                /*artistDiv.append("text")
                    .attr("x", point[0] + ARTIST_RADIUS + 5)
                    .attr("y", point[1] - ARTIST_RADIUS/2)
                    .attr("text-anchor", "start")
                    .attr("fill", "#e99634")
                    .attr("font-family", "Nexa")
                    .attr("font-weight", "Bold")
                    .attr("width", 22)
                    .attr("font-size", "1em")
                    .text(list[i].eventName /*+ " " + list[i].percent*//*);*/

                var textWithBreaks = artistDiv.append("text"); 
                textWithBreaks = textWithBreaks.append("a")
                    .attr("xlink:href", list[i].url);
                var arr = list[i].eventName.split(" ");
                var LINELIMIT = 25;
                if (arr != undefined) {
                    var lineNum = 0;
                    var currentLine = "";
                    for (var j = 0; j < arr.length + 1; j++) {
                        if(!arr[j] || (currentLine + arr[j] + " ").length > LINELIMIT) {
                            textWithBreaks.append("tspan")
                                .text(currentLine)
                                .attr("x", point[0] + ARTIST_RADIUS + 5)
                                .attr("y", point[1] - ARTIST_RADIUS/2 + lineNum*15)
                                .attr("text-anchor", "start")
                                .attr("fill", "#e99634")
                                .attr("class", "artistName")
                                .attr("font-family", "Nexa")
                                .attr("font-weight", "Bold");
                            ++lineNum;
                            if(arr[j]) currentLine = arr[j] + " ";
                        }
                        else currentLine = currentLine + arr[j] + " ";
                    }
                }

                var aText = artistDiv.append("a")
                    .attr("xlink:href", "./recommend.html?device_mac=" + currentDeviceMac + "&artist=" +  list[i].eventName);
                aText.append("text")
                    .attr("x", point[0] + ARTIST_RADIUS + 65)
                    .attr("y", point[1] + ARTIST_RADIUS-5)
                    .attr("text-anchor", "start")
                    .attr("fill", "white")
                    .attr("font-family", "Nexa")
                    .attr("font-weight", "Light")
                    .attr("width", 20)
                    .attr("font-size", "1em")
                    .text("Similar artists");

                angle += Math.PI/13;
            }
        }
    }

    _printArtistList = function(list) {
        for(var i = 0; i < list.length; ++i) {
            d3.select('#artists').append('p').text(list[i].eventName+' percent '+ list[i].percent + ' room: ' + list[i].room);
        }
    };

    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    }

    printArtist = function(steps) {
        eventCsvParser(steps);
        /*d3.json('./DATA/scheduledata.json', function(error, data) {
            artistList = []
            for(var i = 0; i < jsonCirclesMap.length; ++i) {
                artistList[artistList.length] = [];
            }
            for(var i = 0; i < steps.length ; ++i) {
                if(steps[i].room != LIMBO) {
                    events = retrieveEvents(steps[i].initTime, steps[i].finalTime, steps[i].room-1, data);
                    console.log(events);
                    var eventList = []
                    for(var j = 0; j < events.length; ++j) {
                        var duration = Math.min(events[j].finalTime, steps[i].finalTime) - Math.max(events[j].initTime, steps[i].initTime)
                        var percent = duration*100/(events[j].finalTime-events[j].initTime);
                        //_addToArtistList(artistList[steps[i].room], events[j].eventName, events[j].id, events[j].room, percent)
                        eventList[eventList.length] = {'id': events[j].id, 'eventName': events[j].eventName, 'percent': percent}
                    }
                    eventList.sort(sort_by('percent', true, parseInt));
                    _printCircleArtist(eventList, steps[i].room, steps[i].generatedId);
                }
            }
            /*for(var i = 0; i < jsonCirclesMap.length; ++i) {
                artistList[i].sort(sort_by('percent', true, parseInt));
                _printCircleArtist(artistList[i], i);
            }*/
        /*});*/
    };

    printRoomLegend = function(circles) {

        legendSvgContainer.selectAll("text")
            .data(jsonCirclesMap)
            .enter()
            .append("text")
                .attr("x", 30)
                .attr("y", function(d, i) {
                    return (i+1)*LEGEND_V_MARGIN;
                })
                .attr("text-anchor", "end")
                .attr("fill", "#3e78f3")
                .attr("data-room", function(d){return d["id"]})
                .attr("font-family", "Nexa")
                .attr("font-weight", "Bold")
                .attr("class", "opacitySensible legend")
                .attr("font-size", ".32em")
                .text(function(d) { return d.name });
        legendSvgContainer.selectAll("rect")
            .data(jsonCirclesMap)
            .enter()
            .append("rect")
                .attr("x", 34)
                .attr("y", function(d, i) {
                    return (i+1)*LEGEND_V_MARGIN-4;
                })
                .attr("width", 4)
                .attr("class", "opacitySensible legend")
                .attr("data-room", function(d){return d["id"]})
                .attr("height", 4)
                .style("fill", function(d) { return d.titleColor })
                .style("stroke", function(d) { return d.titleColor });
    }

    d3.selectAll("#legend").selectAll("*").remove();

    var legendDiv = d3.select("#legend");

    var legendSvgContainer = legendDiv.append("svg")
        .attr("class", "legend-svg")
        .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight)
        .attr("preserveAspectRatio", "xMinYMin meet");


    d3.selectAll("#artists").selectAll("*").remove();
    var artistDiv = d3.select("#artists");

    var artistSvgContainer = artistDiv.append("svg")
        .attr("class", "legend-svg")
        .attr("viewBox", "750 0 " + artistWidth + " " + artistHeight)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("z-index", "0");

    printScenario();
    printArtist(steps);
    printRoomLegend(jsonCirclesMap);

}
