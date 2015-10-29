/**
 * Fernando Cucchietti 2015
 * Based on the original code of
 * Wind map code (c) 2012
 * Fernanda Viegas & Martin Wattenberg
 */

var mapAnimator, legendAnimator;

var flows, colorCategories, maxFlow, filtering;
var numberOfLegends = 6;
var fullData = [];


var onlyFlows = false;

function isAnimating() {
    return document.getElementById('animating').checked;
}

function format(x) {
    x = Math.round(x * 10) / 10;
    var a1 = ~~x;
    var a2 = (~~(x * 10)) % 10;
    return a1 + '.' + a2;
}

d3max = function (array, f) {
    var i = -1,
        n = array.length,
        a, b;
    if (arguments.length === 1) {
        while (++i < n)
            if ((b = array[i]) != null && b >= b) {
                a = b;
                break;
            }
        while (++i < n)
            if ((b = array[i]) != null && b > a) a = b;
    } else {
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
                a = b;
                break;
            }
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
};


d3.selectAll("#origin").on("click", function (d) {
    mapAnimator.listeners[0].setColorScale(1);
})
    .on("mouseout", function (d) {
        mapAnimator.listeners[0].setColorScale(0);
    });

d3.selectAll("#signal").on("mouseover", function (d) {
    mapAnimator.listeners[0].setColorScale(2);
})
    .on("mouseout", function (d) {
        mapAnimator.listeners[0].setColorScale(0);
    });

function init() {

    var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
        navigator.userAgent.indexOf('Firefox') != -1;
    var isWinFF = navigator.platform.indexOf('Win') != -1 &&
        navigator.userAgent.indexOf('Firefox') != -1;
    var isWinIE = navigator.platform.indexOf('Win') != -1 &&
        navigator.userAgent.indexOf('MSIE') != -1;
    var isLinFF = navigator.platform.indexOf('Lin') != -1 &&
        navigator.userAgent.indexOf('Firefox') != -1;

    // Create a clipping path for freaking Firefox // TODO !!!
    if (isWinIE || isMacFF || isWinFF) {

    }
    /**/


    var canvas = document.getElementById('display');
    var contxt = canvas.getContext('2d');

    var bak_image = new Image();
    bak_image.src = "imgs/outlines_clipped.png";
    contxt.drawImage(bak_image, 0, 0, canvas.width, canvas.height);

    var bounds = {
        x0: 0,
        y0: 0,
        x1: canvas.width,
        y1: canvas.height
    };

    var numParticles = 5000; // what about other browsers isMacFF || isWinIE ?

    mapAnimator = new Animator(null, isAnimating);
    legendAnimator = new Animator(null, isAnimating);

    var currentGraph = {
        links: [],
        rooms: []
    };
    var currentTimeInterval;

    var flowImages = []; //["imgs/now/normal_clipped.png"];
    var flowIdx = {
        rooms: {},
        to: {},
        from: {}
    };


    Rooms.forEach(function (roomName) {
        if (roomName != "Entry" && roomName != "Exit") {
            // Inside a room
            flowIdx.rooms[roomName] = flowImages.length;
            flowImages.push("imgs/now/NormalFill_" + roomName + ".png");
            if (roomName != "Village") {
                //Out from Village to room
                flowIdx.to[roomName] = flowImages.length;
                flowImages.push("imgs/now/NormalOut_" + roomName + ".png");
                //in from Village to room
                flowIdx.from[roomName] = flowImages.length;
                flowImages.push("imgs/now/NormalIn_" + roomName + ".png");
            }
        }
    });

    process_graph = function (inputGraphBAD) { // TODO AJAX PROBLEM UNTIL TONI RESETS THE SERVER
        var inputGraph = inputGraphBAD; //.graph[125];
        // Start zeroing out everything, but perhaps we could take previous value if new one is zero???
        var flowArray = [];
        for (var n = 0; n < flowImages.length; n++) flowArray.push(0.0);
        var date = new Date(inputGraph.time_start);
        document.getElementById("hora").innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        //        d3.select("#hora")[0][0].innerHTML= date.toLocaleDateString()+" "+date.toLocaleTimeString();
        var dict = getMACDict(new Date(inputGraph.time_start));
        var categoryGraph = {
            origin: {},
            signal: {},
            vendor: {}
        };
        Rooms.forEach(function (aname) {
            categoryGraph.origin[aname] = {};
            Rooms.forEach(function (bname) {
                categoryGraph.origin[aname][bname] = 0;
            });
            categoryGraph.signal[aname] = {};
            Signals.forEach(function (strength) {
                categoryGraph.signal[aname][strength] = 0;
            });
        });
        ///Finally process stuff
        if (inputGraph.rooms) {
            inputGraph.rooms.forEach(function (room) {
                if (dict[room.name]) {
                    flowArray[flowIdx.rooms[dict[room.name]]] += +room.devices;
                    Signals.forEach(function (strength) {
                        categoryGraph.signal[dict[room.name]][strength] += room[strength];
                    });
                }
            });
        }
        if (inputGraph.links) {
            inputGraph.links.forEach(function (link) {
                var endRoom = dict[link.end_room],
                    startRoom = dict[link.start_room];
                if (endRoom && startRoom) {
                    if (endRoom != startRoom) { // Need to deal with the people that stay in the same room
                        if (endRoom != "Village" && // This is people going into a room
                            endRoom != "Exit" && // We don't count people going out or in
                            endRoom != "Entry") {
                            flowArray[flowIdx.to[endRoom]] += +link.value;
                        } else if (startRoom != "Village" && startRoom != "Entry") { // This is people going from this room to anywhere else
                            // We aggregate them into the center Village
                            flowArray[flowIdx.from[startRoom]] += +link.value;
                        }
                    }
                    categoryGraph.origin[endRoom][startRoom] += +link.value;
                }
            });
        }
        Rooms.forEach(function (startRoomName) {
            //            console.log("Room " + startRoomName + " has occupancy " + flowArray[flowIdx.rooms[startRoomName]] + ", " + flowArray[flowIdx.to[startRoomName]] + " have gone in, and " + flowArray[flowIdx.from[startRoomName]] + " have gone out");
        });
        // set up empty containers
        var categories;
        categories = [];
        categories[0] = []; // Default scale, no categories
        categories[0][0] = [];
        categories[0][0][0] = 1.0; // 100% in this category
        categories[1] = []; //origin
        for (var n = 0; n < Rooms.length; n++) {
            categories[1][n] = [];
            for (var m = 0; m < Rooms.length; m++) {
                categories[1][n][m] = 0; // %of particles in room n coming from room m
            }
        }
        categories[2] = []; //signal
        for (var n = 0; n < Rooms.length; n++) {
            categories[2][n] = [];
            for (var m = 0; m < Signals.length; m++) {
                categories[2][n][m] = 0; // %of particles in room n with signal m
            }
        }
        //Process categories for color scales
        for (var startRoom in categoryGraph.origin) {
            for (var endRoom in categoryGraph.origin[startRoom]) {
                categories[1][RoomIdx[endRoom]][RoomIdx[startRoom]] = categoryGraph.origin[endRoom][startRoom];
            }
            for (var strength in categoryGraph.signal[startRoom]) {
                categories[2][RoomIdx[startRoom]][SignalsIdx[strength]] = categoryGraph.signal[startRoom][strength];
            }
        }
        //Normalize category values to accumulated probabilities
        for (var cats = 1; cats < 3; cats++) {
            for (var n = 0; n < categories[cats].length; n++) {
                var tot = d3.sum(categories[cats][n]);
                if (tot != 0) {
                    categories[cats][n][0] = categories[cats][n][0] / tot;
                    for (var m = 1; m < categories[cats][n].length; m++) {
                        categories[cats][n][m] = categories[cats][n][m] / tot + categories[cats][n][m - 1];
                    }
                }
            }
        }
        return {
            flow: flowArray,
            categories: categories
        };
    };


    //////////
    ////////////////
    var legendNumbers = [];
    startAnimating = function (f) {
        //flows = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];// AJAX?
        f.aggregateSpeeds(flows);
        //Create color scales
        var colorScales = {
            positions: roomPos,
            categories: colorCategories,
            colorSets: [
                ["#FFFFFF"], roomColors, signalColors
            ]
        };
        var display = new MotionDisplay(canvas, bak_image, f, numParticles, colorScales);
        mapAnimator.add(display);
        mapAnimator.start(40);
        // Scale by numbers from data
        var maxV = f.maxLength;
        for (var i = 0; i < legendNumbers.length; i++) {
            if (i == 0 || maxV == 0 || maxFlow == 0) {
                var c = document.getElementById('legend' + i);
                var g = c.getContext('2d');
                g.fillStyle = 'rgb(0,0,0)';
                g.fillRect(0, 0, c.width, c.height);
            } else {
                var c = document.getElementById('legend' + i);
                var scale = canvas.width / c.width;
                var legendField = VectorField.constant(
                    scale * maxV * legendNumbers[i] / maxFlow, 0, 0, 0, c.width, c.height, scale * maxV); ///XXX
                var legend = new MotionDisplay(c, null, legendField, 25);
                //legend.speedScale = 0.05;
                // normalize so colors correspond to wind map's maximum length!
                legendAnimator.add(legend);
            }
        }
        legendAnimator.start(40);
        d3.selectAll(".value")[0].forEach(function (d, i) {
            d.innerText = " " + legendNumbers[i] + " people"
        });
        //setInterval(reloadData(), 1000 * 60 * 2);

    };





    /////// Room legends

    var legendWidth = 200,
        legendHeight = 200;
    var LEGEND_V_MARGIN = 16;
    var LEGEND_H_MARGIN = 68;
    var LEGEND_COLOR_WIDTH = 12;
    var LEGEND_H_MARGIN_COLOR = LEGEND_H_MARGIN + LEGEND_COLOR_WIDTH;


    var jsonCirclesMap = [
        // { "titleColor": "#FFFFFF", "name": "Limbo", "id":"0"},
        {
            "titleColor": "#BF0CB9",
            "name": "Village",
            "id": "5"
        }, {
            "titleColor": "#DB57D0",
            "name": "Dome",
            "id": "1"
        }, {
            "titleColor": "#DDB0BF",
            "name": "Complex",
            "id": "2"
        }, {
            "titleColor": "#B9DBA2",
            "name": "Sonar+D",
            "id": "7"
        }, {
            "titleColor": "#7ED96D",
            "name": "Planta",
            "id": "4"
        }, {
            "titleColor": "#09AE48",
            "name": "Hall",
            "id": "3"
        },
    ];

    printRoomLegend = function (circles) {

        legendSvgContainer.selectAll("text")
            .data(jsonCirclesMap)
            .enter()
            .append("text")
            .attr("x", LEGEND_H_MARGIN_COLOR + 8)
            .attr("y", function (d, i) {
                return (i + 1) * LEGEND_V_MARGIN + 10;
            })
        //.attr("text-anchor", "left")
        .attr("fill", "#3e78f3")
            .attr("data-room", function (d) {
                return d["id"]
            })
        //.attr("font-family", "Nexa Bold")
        .attr("class", "opacitySensible legend")
        //.attr("font-size", "14px")
        .text(function (d) {
            return d.name
        });

        legendSvgContainer.selectAll("rect")
            .data(jsonCirclesMap)
            .enter()
            .append("rect")
            .attr("x", LEGEND_H_MARGIN)
            .attr("y", function (d, i) {
                return (i + 1) * LEGEND_V_MARGIN;
            })
            .attr("width", LEGEND_COLOR_WIDTH)
            .attr("class", "opacitySensible legend")
            .attr("data-room", function (d) {
                return d["id"]
            })
            .attr("height", LEGEND_COLOR_WIDTH)
            .style("fill", function (d) {
                return d.titleColor
            })
            .style("stroke", function (d) {
                return d.titleColor
            });
    }

    removeColorLegend = function () {
        legendSvgContainer.selectAll("text").remove();
        legendSvgContainer.selectAll("rect").remove();
    }

    var legendDiv = d3.select("#color_legend");

    var legendSvgContainer = legendDiv.append("svg")
        .attr("class", "legend-svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);
    //    .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight);

    //    .attr("preserveAspectRatio", "xMinYMin meet");

    printRoomLegend(jsonCirclesMap);


    /////////



    /*
    {
   // $.ajax("http://visualization-case.bsc.es/getGraphLastEntry.jsp?callback=?", {
        // 15 minute graph     $.ajax("http://visualization-case.bsc.es/getGraph.jsp?type=15&callback=?", {
        dataType: "jsonp",
        crossDomain: true
    })
        .done(
        */

    function createSlider() {

        var margin = {
                top: 0,
                right: 5,
                bottom: 0,
                left: 30
            },
            sWidth = $("#timeStamp").width() - margin.left - margin.right,
            sHeight = 50 - margin.top - margin.bottom;

        var xSlider = d3.scale.linear()
            //.domain([fullData[0].time_start, fullData[fullData.length-1].time_end])
            .domain([0, fullData.length - 1])
            .rangeRound([0, sWidth])

        .clamp(true);

        var brush = d3.svg.brush()
            .x(xSlider)
            .extent([0, 0])
            .on("brushend", brushed);

        var sliderSvg = d3.select("#slider").append("svg")
            .attr("width", sWidth + margin.left + margin.right)
            .attr("height", sHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        sliderSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + sHeight / 2 + ")")
            .call(d3.svg.axis()
                .scale(xSlider)
                .orient("bottom")
                .tickFormat(function (d) {
                    var a = new Date(fullData[d].time_start);
                    var b = a.getDay();
                    return b==4 ? "Thursday" : (b==5? "Friday" : "Saturday");
                })
                .tickSize(5)
                .ticks(3)
                .tickPadding(12)
            )
            .select(".domain")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "halo");
        
            d3.selectAll(".tick").selectAll("text")
                .style("text-anchor", "right");;

        var slider = sliderSvg.append("g")
            .attr("class", "slider")
            .call(brush);

        slider.selectAll(".extent,.resize")
            .remove();

        slider.select(".background")
            .attr("height", sHeight);

        var handle = slider.append("circle")
            .attr("class", "handle")
            .attr("transform", "translate(0," + sHeight / 2 + ")")
            .attr("r", 9);

        // slider
        //    .call(brush.event);

        function brushed() {
            var value = brush.extent()[0];

            if (d3.event.sourceEvent) { // not a programmatic event
                value = xSlider.invert(d3.mouse(this)[0]);
                brush.extent([value, value]);
            }

            handle.attr("cx", xSlider(value));
            // DO things with calue
            if (mapAnimator.listeners[0]) updatePlots(fullData[d3.round(value)]);
        }

    }

    d3.json("data/full_graph.json", function (error, fulljson) {
        if (!error) {
            console.log("Communication ok");
        } else {
            console.log("JSON error");
            console.log(error)
        }
        fulljson.graph.forEach(function (json, i) {
            if (json.time_end && json.time_start) {
                var end = new Date(json.time_end);
                var start = new Date(json.time_start);
                if (end.getHours() >= 12 && start.getHours() <= 22 && start.getDate() >= 18 && start.getDate() <= 20) {
                    fullData.push(json);
                }
            }
        });

        createSlider();

        updateData(fullData[0]);
        jjj = VectorField.gridFromNormals({
                x0: 0,
                y0: 0,
                x1: 819,
                y1: 837
            },
            flowImages, {
                width: 819,
                height: 837
            }, startAnimating);
        ///AJAX
    });


    processTimeStampedData = function (json) {
        var processed_data = process_graph(json);
        var rawFlows = processed_data.flow;
        var thisflows = rawFlows.slice(0, flowImages.length);
        var categories = processed_data.categories;
        var thismaxFlow = d3max(thisflows);
        if (thismaxFlow) {
            thisflows = thisflows.map(function (d) {
                return d / thismaxFlow
            });
        }
        var legendNumbers = [];
        for (var k = 0; k < numberOfLegends; k++) {
            legendNumbers.push(Math.floor(k * thismaxFlow / (numberOfLegends - 1)));
        }
        return {
            flow: thisflows,
            categories: categories,
            maxflow: thismaxFlow,
            legend: legendNumbers
        };
    }


    updateData = function (json) {
        var processed_data = process_graph(json);
        var rawFlows = processed_data.flow;
        flows = rawFlows.slice(0, flowImages.length);
        colorCategories = processed_data.categories;
        maxFlow = d3max(flows);
        if (maxFlow) {
            flows = flows.map(function (d) {
                return d / maxFlow
            });
        }
        legendNumbers = [];
        for (var k = 0; k < numberOfLegends; k++) {
            legendNumbers.push(Math.floor(k * maxFlow / (numberOfLegends - 1)));
        }
        return legendNumbers;
    }

    updatePlots = function (json) {
        var legendNumbers = updateData(json);
        var display = mapAnimator.listeners[0];
        var field = display.field;
        field.aggregateSpeeds(flows);
        display.colorScales.categories = colorCategories;
        var legends = legendAnimator.listeners;

        var maxV = field.maxLength;
        for (var i = 0; i < legendNumbers.length; i++) {
            if (i == 0 || maxV == 0 || maxFlow == 0) {
                var c = document.getElementById('legend' + i);
                var g = c.getContext('2d');
                g.fillStyle = 'rgb(0,0,0)';
                g.fillRect(0, 0, c.width, c.height);
            } else {
                var c = document.getElementById('legend' + i);
                var scale = canvas.width / c.width;
                legends[i - 1].field = VectorField.constant(
                    scale * maxV * legendNumbers[i] / maxFlow, 0, 0, 0, c.width, c.height, scale * maxV); ///XXX
            }
        }

        d3.selectAll(".value")[0].forEach(function (d, i) {
            d.innerText = " " + legendNumbers[i] + " people"
        });
    };



    fastUpdatePlots = function (legendNumbers, fl, cats) {
        var display = mapAnimator.listeners[0];
        var field = display.field;
        field.aggregateSpeeds(fl);
        display.colorScales.categories = cats;
        var legends = legendAnimator.listeners;

        var maxV = field.maxLength;
        for (var i = 0; i < legendNumbers.length; i++) {
            if (i == 0 || maxV == 0 || maxFlow == 0) {
                var c = document.getElementById('legend' + i);
                var g = c.getContext('2d');
                g.fillStyle = 'rgb(0,0,0)';
                g.fillRect(0, 0, c.width, c.height);
            } else {
                var c = document.getElementById('legend' + i);
                var scale = canvas.width / c.width;
                legends[i - 1].field = VectorField.constant(
                    scale * maxV * legendNumbers[i] / maxFlow, 0, 0, 0, c.width, c.height, scale * maxV); ///XXX
            }
        }
        d3.selectAll(".value")[0].forEach(function (d, i) {
            d.innerText = " " + legendNumbers[i] + " people"
        });
    };




}



function changeColorScale(num) {
    mapAnimator.listeners[0].setColorScale(num);
}


function showOnlyCommunication() {
    mapAnimator.listeners[0].showOnlyCommunication();
}