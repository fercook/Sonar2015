/**
 * Fernando Cucchietti 2015
 * Based on the original code of
 * Wind map code (c) 2012
 * Fernanda Viegas & Martin Wattenberg
 */


var mapAnimator,legendAnimator;

var maxFlow,colorScales, filtering;

var onlyFlows = false, flows;

function isAnimating() {
    return document.getElementById('animating').checked;
}

function format(x) {
    x = Math.round(x * 10) / 10;
    var a1 = ~~x;
    var a2 = (~~(x * 10)) % 10;
    return a1 + '.' + a2;
}

d3max = function(array, f) {
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

/*
d3.select("#marking").selectAll("circles")
    .data(roomPos).enter()
    .append("circle")
    .attr("cx", function(d) {
        return d.cx + "px"
    })
    .attr("cy", function(d) {
        return d.cy + "px"
    })
    .attr("r", function(d) {
        return d.r + "px"
    })
    .style("stroke", "none")
    .style("fill", "steelblue")
    .style("opacity", 0)
    .on("mouseover", function(d) {

    });
*/
d3.selectAll("#origin").on("click", function(d){ mapAnimator.listeners[0].setColorScale(1) ;})
                       .on("mouseout", function(d){ mapAnimator.listeners[0].setColorScale(0) ;});

d3.selectAll("#signal").on("mouseover", function(d){ mapAnimator.listeners[0].setColorScale(2) ;})
                       .on("mouseout", function(d){ mapAnimator.listeners[0].setColorScale(0) ;});

function init() {

    //var imageCanvas = document.getElementById('image-canvas');
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

    loading = false;

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

    // Get graph and process data
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
    var categories;
    categories=[];
    categories[0] = []; // Default scale, no categories
    categories[0][0]=[];
    categories[0][0][0]=1.0; // 100% in this category
    categories[1]=[]; //origin
    for (var n=0;n<Rooms.length;n++) {
        categories[1][n]=[];
            for (var m=0;m<Rooms.length;m++) {
                categories[1][n][m]=0;  // %of particles in room n coming from room m
        }
    }
    categories[2]=[]; //signal
    for (var n=0;n<Rooms.length;n++) {
        categories[2][n]=[];
            for (var m=0;m<Signals.length;m++) {
                categories[2][n][m]=0;  // %of particles in room n with signal m
        }
    }

    console.log(Rooms);
    Rooms.forEach(function(roomName) {
        if (roomName != "Entry" && roomName != "Exit") {
            // Inside a room
            flowIdx.rooms[roomName] = flowImages.length ;
            flowImages.push("imgs/now/NormalFill_" + roomName + ".png");
            if (roomName != "Village") {
                //Out from Village to room
                flowIdx.to[roomName] = flowImages.length ;
                flowImages.push("imgs/now/NormalOut_" + roomName + ".png");
                //in from Village to room
                flowIdx.from[roomName] = flowImages.length ;
                flowImages.push("imgs/now/NormalIn_" + roomName + ".png");
            }
        }
    });
    process_graph = function(inputGraphBAD) { // TODO AJAX PROBLEM UNTIL TONI RESETS THE SERVER
        var inputGraph = inputGraphBAD; //.graph[125];
        // Start zeroing out everything, but perhaps we could take previous value if new one is zero???
        var flowArray = [];
        for (var n = 0; n < flowImages.length; n++) flowArray.push(0.0);
        var date = new Date(inputGraph.time_start);
        document.getElementById("hora").innerHTML = date.toLocaleDateString()+" "+date.toLocaleTimeString();
//        d3.select("#hora")[0][0].innerHTML= date.toLocaleDateString()+" "+date.toLocaleTimeString();
        var dict = getMACDict(new Date(inputGraph.time_start));
        var categoryGraph = { origin: {}, signal: {}, vendor: {} };
        Rooms.forEach(function(aname){
            categoryGraph.origin[aname]= {};
            Rooms.forEach(function(bname){
                categoryGraph.origin[aname][bname]= 0;
            });
            categoryGraph.signal[aname]= {};
            Signals.forEach(function(strength){
                categoryGraph.signal[aname][strength]= 0;
            });
        });
        ///Finally process stuff
        inputGraph.rooms.forEach(function(room) {
            flowArray[flowIdx.rooms[dict[room.name]]] += +room.devices;
            Signals.forEach(function(strength){
                categoryGraph.signal[dict[room.name]][strength] += room[strength];
            });

        });
        inputGraph.links.forEach(function(link) {
            var endRoom = dict[link.end_room],
                startRoom = dict[link.start_room];
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
        });
        Rooms.forEach(function(startRoomName) {
            console.log("Room " + startRoomName + " has occupancy " + flowArray[flowIdx.rooms[startRoomName]] + ", " + flowArray[flowIdx.to[startRoomName]] + " have gone in, and " + flowArray[flowIdx.from[startRoomName]] + " have gone out");
        });
        //Process categories for color scales
        for (var startRoom in categoryGraph.origin) {
            for (var endRoom in categoryGraph.origin[startRoom]) {
                categories[1][RoomIdx[endRoom]][RoomIdx[startRoom]] = categoryGraph.origin[endRoom][startRoom];
            }
            for (var strength in categoryGraph.signal[startRoom]){
                categories[2][RoomIdx[startRoom]][SignalsIdx[strength]] = categoryGraph.signal[startRoom][strength];
            }
        }
        //Normalize category values to accumulated probabilities
        for (var cats=1;cats<3;cats++) {
        for (var n=0;n<categories[cats].length;n++) {
            var tot = d3.sum(categories[cats][n]);
            if (tot != 0){
                categories[cats][n][0] = categories[cats][n][0]/tot;
                for (var m=1;m<categories[cats][n].length;m++) {
                    categories[cats][n][m] = categories[cats][n][m]/tot + categories[cats][n][m-1];
                }
            }
        }
        }
        return flowArray;
    };


//////////
    ////////////////
    var legendNumbers = [];
    var numberOfLegends = 6;
    startAnimating = function(f) {
        //flows = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
        f.aggregateSpeeds(flows);
        //Create color scales
        colorScales = {positions: roomPos, categories: categories, colorSets: [["#FFFFFF"],roomColors,signalColors]};
        var display = new MotionDisplay(canvas, bak_image, f, numParticles, colorScales);
        mapAnimator.add(display);
        mapAnimator.start(40);
        // Scale by numbers from data
        var maxV = f.maxLength;
        for (var i = 0; i < legendNumbers.length; i++) {
            if (i==0) {
                var c = document.getElementById('legend' + i);
                var g = c.getContext('2d');
                g.fillStyle='rgb(0,0,0)';
                g.fillRect(0, 0, c.width, c.height);
            }
            else{
                var c = document.getElementById('legend' + i);
                var scale = canvas.width / c.width;
                var legendField = VectorField.constant(
                    scale*maxV*legendNumbers[i]/maxFlow, 0, 0, 0, c.width, c.height,scale*maxV); ///XXX
                var legend = new MotionDisplay(c, null, legendField, 25);
                //legend.speedScale = 0.05;
                // normalize so colors correspond to wind map's maximum length!
                legendAnimator.add(legend);
            }
        }
        legendAnimator.start(40);
        d3.selectAll(".value")[0].forEach(function(d,i) {d.innerText = " "+legendNumbers[i]+" people"});
    };


    /////// Room legends

    var legendWidth=200,
        legendHeight=200;
    var LEGEND_V_MARGIN = 16;
    var LEGEND_H_MARGIN = 68;
    var LEGEND_COLOR_WIDTH = 12;
    var LEGEND_H_MARGIN_COLOR = LEGEND_H_MARGIN+LEGEND_COLOR_WIDTH;


 var jsonCirclesMap = [
   // { "titleColor": "#FFFFFF", "name": "Limbo", "id":"0"},
     { "titleColor": "#BF0CB9", "name": "Village", "id":"5"},
    { "titleColor": "#DB57D0", "name": "Dome", "id":"1"},
    { "titleColor": "#DDB0BF", "name": "Complex", "id":"2"},
    { "titleColor": "#B9DBA2", "name": "Sonar+D", "id":"7"},
     { "titleColor": "#7ED96D", "name": "Planta", "id":"4"},
     { "titleColor": "#09AE48", "name": "Hall", "id":"3"},
 ];

printRoomLegend = function(circles) {

        legendSvgContainer.selectAll("text")
            .data(jsonCirclesMap)
            .enter()
            .append("text")
                .attr("x", LEGEND_H_MARGIN_COLOR+8)
                .attr("y", function(d, i) {
                    return (i+1)*LEGEND_V_MARGIN+10;
                })
                //.attr("text-anchor", "left")
                .attr("fill", "#3e78f3")
                .attr("data-room", function(d){return d["id"]})
                //.attr("font-family", "Nexa Bold")
                .attr("class", "opacitySensible legend")
                //.attr("font-size", "14px")
                .text(function(d) { return d.name });

        legendSvgContainer.selectAll("rect")
            .data(jsonCirclesMap)
            .enter()
            .append("rect")
                .attr("x", LEGEND_H_MARGIN)
                .attr("y", function(d, i) {
                    return (i+1)*LEGEND_V_MARGIN;
                })
                .attr("width", LEGEND_COLOR_WIDTH)
                .attr("class", "opacitySensible legend")
                .attr("data-room", function(d){return d["id"]})
                .attr("height", LEGEND_COLOR_WIDTH)
                .style("fill", function(d) { return d.titleColor })
                .style("stroke", function(d) { return d.titleColor });
    }

removeColorLegend = function(){
    legendSvgContainer.selectAll("text").remove();
    legendSvgContainer.selectAll("rect").remove();
}

var legendDiv = d3.select("#color_legend");

var legendSvgContainer = legendDiv.append("svg")
    .attr("class", "legend-svg")
    .attr("width",legendWidth)
    .attr("height",legendHeight);
//    .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight);

//    .attr("preserveAspectRatio", "xMinYMin meet");

printRoomLegend(jsonCirclesMap);


    /////////



///* AJAX
    $.ajax("http://visualization-case.bsc.es/getGraphLastEntry.jsp?callback=?", {
// 15 minute graph     $.ajax("http://visualization-case.bsc.es/getGraph.jsp?type=15&callback=?", {
        dataType: "jsonp",
        crossDomain: true
    })
        .done(function(json) {
         console.log("Communication ok");
            var rawFlows = process_graph(json);
            flows = rawFlows.slice(0, flowImages.length);

        ///////// TESTING POPULATIONS
        /*
            console.log("initial flows: ")
            console.log(flows);
//AJAX  /*
/*
            var Z = 1.0;
            // Dome inside, in, out,
            flows = [4000, Z * 780,  Z * 620,
                    // Hall inside, in, out,
                    7500,  Z * 1500, Z * 210,
                    // Planta inside, in, out,
                    230,   Z * 15,   Z * 50,
                    // PlusD inside, in, out,
                    3500,  Z * 1500, Z * 2100,
                    // Complex inside, in, out,
                    1000,  Z * 1000, Z * 20,
                    // Village inside
                    10500
            ];
            console.log("Temp flows: ")
            console.log(flows);

           ///////// TESTING POPULATIONS   */
            maxFlow = d3max(flows);
            flows = flows.map(function(d) {
                return  d / maxFlow
            });
            legendNumbers = [];
            for (var k=0;k<numberOfLegends;k++) {
                legendNumbers.push(k*maxFlow/(numberOfLegends-1));
//                var lscale = Math.exp(k*Math.log(maxFlow)/(numberOfLegends-1));
//                legendNumbers.push(lscale);
            }
            console.log(maxFlow);
            console.log(flows);
            var jjj = VectorField.gridFromNormals({
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





}



function changeColorScale(num) {
    mapAnimator.listeners[0].setColorScale(num);
}


function showOnlyCommunication() {
    mapAnimator.listeners[0].showOnlyCommunication();
}


/*

    var vels = [];
        for (var n=0;n<flowImages.length;n++) vels.push(n==0? 0.1 : 1.0);

    var jjj = VectorField.gridFromNormals(
        {x0:400,y0:300,x1:1500,y1:800},
        flowImages,
        {width:819, height:837},
        function(f){
                f.aggregateSpeeds(vels); //intensityGraph);
                var color = [1,1,1];
                var display = new MotionDisplay(canvas, bak_image, f, numParticles, color);
                mapAnimator.add(display);
                mapAnimator.start(40);
        } );
*/



//    params = {radius:0, width:10,
//              center: new Vector(canvas.width/3, 0.2*canvas.height/2)};
//var field =  VectorField.read(windData, true);
//field = VectorField.circle(50,bounds,params);

/*
    fields = createCurves(bounds);
    console.log("HEcho");
    fields.forEach(function (field) {
        var color = [1,1,1]; //[0.5+0.5*Math.random(),0.5+0.5*Math.random() ,0.5+0.5*Math.random() ];
        //field.maxLength = 50*Math.random();
        var display = new MotionDisplay(canvas, bak_image, field, numParticles, color);
        mapAnimator.add(display);
    });
*/


/*
    for (var n=0;n<10;n++){
        var curs = [];
        for (var p=0;p<10;p++){ curs.push( new Vector(canvas.width*Math.random(),canvas.height*Math.random()) ); }
        var field = VectorField.curve(100,bounds,curs,params);
        var color = [0.5+0.5*Math.random(),0.5+0.5*Math.random() ,0.5+0.5*Math.random() ];
        var display = new MotionDisplay(canvas, bak_image, field, numParticles, color);
        mapAnimator.add(display);
    }
*/
/*
    c1 = [ new Vector(0,0), new Vector(200,400),new Vector(600,200), new Vector(800,300) ];
    field = VectorField.curve(100,bounds,c1,params);

    c2 = [ new Vector(200,500), new Vector(70,250),new Vector(450,400), new Vector(400,600) ];
    field2 = VectorField.curve(100,bounds,c2,params);


    //var display = new MotionDisplay(canvas, imageCanvas, field, numParticles, mapProjection);
    var display = new MotionDisplay(canvas, bak_image, field, numParticles, [1,1,1]);
    var display2 = new MotionDisplay(canvas, bak_image, field2, numParticles, [0.95,0.8,0.6]);

  // IE & FF Windows do weird stuff with very low alpha.
  if (isWinFF || isWinIE) {
        display.setAlpha(.05);
    }

    mapAnimator.add(display);
    mapAnimator.add(display2);
*/
//var mask = new MapMask(document.getElementById('mask'), 900, 600);
//mapAnimator.add(mask);

// var callout = document.getElementById('callout');

/*
  var legendAnimator = new Animator(null, isAnimating);

  // Scale for speed.
    // Numerator comes from size of map.
    // Denominator is knots vs. mph.
  var speedScaleFactor = 20 / 1.15;
    for (var i = 1; i <= legendSpeeds.length; i++) {
        var c = document.getElementById('legend' + i);
        var legendField = VectorField.constant(
            legendSpeeds[i - 1] * speedScaleFactor, 0, 0, 0, c.width, c.height);
        var legend = new MotionDisplay(c, null, legendField, 30);
        // normalize so colors correspond to wind map's maximum length!
        legend.maxLength = field.maxLength * speedScaleFactor;
        legendAnimator.add(legend);
    }
    legendAnimator.start(40);
    */



///////// TESTING POPULATIONS
/*

            Rooms.forEach(function(startRoomName) {
                console.log("Room " + startRoomName + " indices: Occupancy : " +
                            flowIdx.rooms[startRoomName] + ", inflow: " +
                            flowIdx.to[startRoomName] + ", outflow: " +
                            flowIdx.from[startRoomName]);


            console.log("initial flows: ")
            console.log(flows);

            var Z = 0;
            // Dome inside, in, out,
            flows = [4000, Z * 780,  Z * 620,
                    // Hall inside, in, out,
                    7500,  Z * 1500, Z * 210,
                    // Planta inside, in, out,
                    230,   Z * 15,   Z * 50,
                    // PlusD inside, in, out,
                    3500,  Z * 1500, Z * 2100,
                    // Complex inside, in, out,
                    1000,  Z * 1000, Z * 20,
                    // Village inside
                    10500
            ];
            console.log("Temp flows: ")
            console.log(flows);
           ///////// TESTING POPULATIONS   */
// Do some normalization?
//flows[16]=1000;





/*

Clipping code for FF




        function p2(x) {
            return Math.pow(x, 2);
        }

        function findEntryPoints(centralCircle, lateralCircle) { // Find the crossing points of two circles
            var x1 = centralCircle.cx,
                x2 = lateralCircle.cx;
            var y1 = centralCircle.cy,
                y2 = lateralCircle.cy;
            var r1 = centralCircle.r,
                r2 = lateralCircle.r;
            var first, second;
            var A = -(x1 - x2) / (y1 - y2);
            var B = (-(p2(r1) - p2(r2)) + (p2(x1) - p2(x2)) + (p2(y1) - p2(y2))) / (2 * (y1 - y2));
            var a = p2(A) + 1;
            var b = (2 * A * (B - y1) - 2 * x1);
            var c = p2(x1) + p2(B - y1) - p2(r1);

            var xp = (-b + Math.sqrt(p2(b) - 4 * a * c)) / (2 * a);
            var xm = (-b - Math.sqrt(p2(b) - 4 * a * c)) / (2 * a);
            var yp = xp * A + B;
            var ym = xm * A + B;
            // We detect which one goes first by the sign of the cross product
            var crossp = (xp - x1) * (y2 - y1) - (yp - y1) * (x2 - x1);
            if (crossp <= 0) {
                first = [xm, ym];
                second = [xp, yp];
            } else {
                first = [xp, yp];
                second = [xm, ym];
            }
            return [first, second];
        }

        contxt.beginPath();
        // Find the crossings of the first room
        var entryPoints = findEntryPoints(roomPos[0], roomPos[1]);
        var startingPoint = entryPoints[0];
        var center = new Vector(roomPos[0].cx, roomPos[0].cy);
        contxt.moveTo(entryPoints[0][0], entryPoints[0][1]);
        for (var i = 1; i < -1; i++) {
            //Find the midpoint of the circle
            var D = new Vector(roomPos[i].cx - roomPos[0].cx, roomPos[i].cy - roomPos[0].cy);
            var R = D.setLength(roomPos[i].r);
            var midPoint = center.plus(D.plus(R));
            // Draw until the midpoint and then until the other entrypoint
            contxt.arcTo(entryPoints[0][0], entryPoints[0][1], midPoint.x, midPoint.y, roomPos[i].r);
            contxt.arcTo(midPoint.x, midPoint.y, entryPoints[1][0], entryPoints[1][1], roomPos[i].r);
            // Now draw the arc connecting the rooms
            var iniPoint = entryPoints[1];
            if (i < 5) {
                entryPoints = findEntryPoints(roomPos[0], roomPos[i + 1]);
            } else {
                entryPoints = [startingPoint];
            } // We close the figure
            contxt.arcTo(iniPoint[0], iniPoint[1], entryPoints[0][0], entryPoints[0][1], roomPos[0].r);
        }
        contxt.clip();

        */
