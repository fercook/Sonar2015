/*GraphParameters = {
    "graphWidth": 4000,
    "svgHeight": 500,
    "graphHeight": 500,
    "nodeWidth": 0.4,
    "nodePadding": 50,
    "offset": "Top",
    "curvature": 0.5
}*/

GraphParameters = {
    "graphWidth": 1827,
    "svgHeight": 903,
    "graphHeight": 574,
    "nodeWidth": 0.4,
    "nodePadding": 50,
    "offset": "Centered",
    "offset": "Centered",
    "curvature": 0.5
}

var analysis;

//var color = d3.scale.ordinal()
//  .domain(["Limbo", "Dome", "Complex" , "Hall", "Planta", "Village" , "Sonar+D"])
//  .range(["#FF0000", "#009933" , "#0000FF", "#FF0000", "#009933" , "#0000FF", "#0000FF"]);

var color = d3.scale.ordinal()
  .domain([0, 1, 2, 3 , 4, 5, 6 , 7,8])
  .range(["#bbbbbb", "#DB57D0" , "#DDB0BF", "#09AE48", "#7ED96D" , "#BF0CB9", "#B9DBA2", "#000","#3366FF"]);

var jsonCirclesMap = [
    { "titleColor" : "#BBBBBB", "name": "Limbo", "id":"0"},
    { "titleColor": "#DB57D0", "name": "Dome", "id":"1"},
    { "titleColor": "#DDB0BF", "name": "Complex", "id":"2"},
    { "titleColor": "#09AE48", "name": "Hall", "id":"3"},
    { "titleColor": "#7ED96D", "name": "Planta", "id":"4"},
    { "titleColor": "#BF0CB9", "name": "Village", "id":"5"},
    { "titleColor": "#B9DBA2", "name": "Sonar+D", "id":"7"}];

queue()
    //TODO Read actual data format
    .defer(d3.json, "data/sankey_analysis.json") //"../DATA/prob_separated.json")
.await(ready);

function ready(error, data) {
    analysis = data; // TODO Process real data format
    draw();
}


function getDataFromServer() {
    $.ajax("http://visualization-case.bsc.es/getGraph.jsp?type=15&callback=?", {
        dataType: "jsonp",
        crossDomain: true
    })
        .done(function(json) {
          console.log("Communication ok");
          process_json(json);
          draw();
    });
}
//TIMER: UNCOMMENT FOR PRODUCTION
//setInterval(function(){ getDataFromServer(); }, 5*60*1000 );

var time_steps = (11+10+10)*4; //TODO: CALCULAR TIEMPOS TOTALES// time_step_group.top(Infinity).length;
var total_rooms = 8;
var nodeidx = function (time, room) {
    // Notation for room starts at 1 NOT ZERO
    return time * total_rooms + room - 1;
}
var linkidx = function (time, startroom, endroom) {
    // Goes from startroom at time to endroom at time+1
    // Notation for room starts at 1 NOT ZERO
    return time * total_rooms * total_rooms + (startroom - 1) * total_rooms + endroom - 1;
}
var timeidx = function(time) { // Given a date, compares to latest time in graph and returns the layer idx
    var hour = time.getHours();
    var day = time.getDate();
    var minutes = time.getMinutes();
    if (//day<18 || day>20 || hour<12 // No Sonar here
        //|| (day==18 && hour>=23)
        //|| (day==19 && hour>=22)
        //|| (day==20 && hour>=22)
         (day<16 || hour<10) ) // DEBUG REMOVE THIS CONDITION
    { return null; }
    var idx = 0;
    if (day==19) { idx += 11*4; }
    if (day==20) { idx += 11*4+10*4; }
    //idx += (hour-12); // DEBUG
    idx += (hour-10)*4; // DEBUG
    idx += Math.floor(minutes/15.0);
    return idx;
}

var getColor = function(d){
    if(d.room==1 || d.room==8){
        return d.color = colors(0);
    }else{
        return d.color = colors(d.room);
    }
}

function process_json(json) {
    console.log(json);
    var roomOrder = {"Dome":2,"Hall":3 , "Planta":4 ,
                     "PlusD": 5, "Village": 6, "Complex": 7,
                     "Entry": 1,"Exit": 8};
    var roomNames = ["Limbo","Dome","Hall","Planta",
                     "PlusD", "Village", "Complex",
                     "Limbo"];
    // Create empty graph
    analysis = {};
    analysis.links = Array((time_steps-2) * total_rooms * total_rooms + (total_rooms - 1) * total_rooms + total_rooms - 1);
    analysis.nodes = Array(time_steps * total_rooms);
    // Prepare a couple of temporary useful vars
    for (var t = 0; t < time_steps; t++) {
        for (var s = 1; s <= total_rooms; s++) {
            analysis.nodes[nodeidx(t, s)] = {"layer": t, "row": s-1, "name": nodeidx(t, s), "room": s, fullName: roomNames[s-1]};}
    }
    for (var t = 0; t < time_steps-1; t++) {
        for (var s = 1; s <= total_rooms; s++) {
            for (var e = 1; e <= total_rooms; e++) {
                analysis.links[linkidx(t, s, e)] = {
                    "source": nodeidx(t, s),
                    "target": nodeidx(t + 1, e),
                    "value": 0
                };
            }
        }
    }
    // Filter out invalid dates (before Sonar, nights)
    // Adjust 15 minute intervals to our intervals
    var buckets = [];
    for (var n=0;n<time_steps;n++) buckets[n] = []; //DEBUG
    json.graph.forEach( function(message) {
        var time_start = new Date(message.time_start);
        tidx = timeidx(time_start);
        if (tidx!=null) {
            buckets[tidx].push(message);
        }
    });
    // Clean buckets
    for (var n=0, len=buckets.length; n<len; n++) {
        if (buckets[n].length == 0) {
            if (n<len-1 &&  buckets[n+1].length == 2) { // me robo uno
                var t0 = new Date (buckets[n+1][0].time_start) ;
                var t1 = new Date (buckets[n+1][1].time_start) ;
                if (t0 <= t1) {
                    buckets[n].push( buckets[n+1].shift() );
                } else {
                    buckets[n].push(buckets[n+1].pop());
                }
            } else if ( n>0 && buckets[n-1].length == 1 ) {
                buckets[n] = buckets[n-1]; // me copio el anterior
            }
        }
        else if (buckets[n].length==2) {
            if ( n<len-1 && buckets[n+1].length==0 ) {
                ///// elejir el mas tarde y pasarlo
                var t0 = new Date (buckets[n][0].time_start) ;
                var t1 = new Date (buckets[n][1].time_start) ;
                if (t0 <= t1) {
                    buckets[n+1].push( buckets[n].pop());
                } else {
                    buckets[n+1].push(buckets[n].shift());
                }
            } else {
                ///// Elijo el mas tarde y elimino
                var t0 = new Date (buckets[n][0].time_start) ;
                var t1 = new Date (buckets[n][1].time_start) ;
                if (t0 <= t1) {
                    buckets[n].pop();
                } else {
                    buckets[n].shift();
                }
            }
        }
    }
    // Convertir times to layers
    // Convert MACs to room names to rows

    for (var t=0;t<time_steps;t++) {
        if (buckets[t].length) {
            var dict = getMACDict(new Date(buckets[t][0].time_start));
            for (var ridx=0; ridx<buckets[t].rooms; ridx++) {
                var room = buckets[t].rooms[ridx];
                analysis.nodes[nodeidx(t,  roomOrder[dict[room.name]])].value += room.devices;
            }
            for (var lidx=0; lidx<buckets[t].links; lidx++) {
                var link = buckets[t].links[lidx];
                var s =  roomOrder[dict[link.start_room]];
                var e =  roomOrder[dict[link.end_room]];
                analysis.links[linkidx(t, s, e)].value += link.value;
            }
        }
    }


// Testear que pasa si desaparecen rooms
    // Put everything in little boxes and ship

/*
    for (var t = 0; t < time_steps-1; t++) {


        records_by_time.filterExact(t);
        var ids = records_by_id.group()

        ids.top(Infinity).forEach(function (id) {
            records_by_id.filterExact(id.key);
            var start_idx = minindex(records_by_id.top(Infinity), function (d) {
                return d.time;
            });
            var enter_idx = maxindex(records_by_id.top(Infinity), function (d) {
                return d.time;
            });
            if (start_idx>=0 && enter_idx>=0) {
                var start_room = records_by_id.top(Infinity)[start_idx].room;
                var end_room = records_by_id.top(Infinity)[enter_idx].room;
                analysis.links[linkidx(t, start_room+1, end_room+1)]["value"] += 1;
            }
        });
        records_by_id.filterAll();
    }


    for (var t = 1; t < time_steps; t++) {
        for (var end_room = 2; end_room < total_rooms ; end_room++) {
            var total_enter = 0;
            for (var start_room = 2; start_room < total_rooms ; start_room++) {
                total_enter += analysis.links[linkidx(t-1, start_room, end_room)]["value"];
            }
            if (total_enter > 0 ) {
                analysis.links[linkidx(t-1, 1, end_room)]["value"]+=total_enter;
            }
        }
    }
    for (var t = 0; t < time_steps-2; t++) {
        for (var start_room = 2; start_room < total_rooms ; start_room++) {
            var total_enter = 0;
            for (var end_room = 2; end_room < total_rooms ; end_room++) {
                total_enter += analysis.links[linkidx(t+1, start_room, end_room)]["value"];
            }
            if (total_enter > 0 ) {
                analysis.links[linkidx(t+1, start_room, total_rooms)]["value"]+=total_enter;
            }
        }
    }
    records_by_time.filterAll();
    var t2 = performance.now();
*/


}



function draw() {


    d3.selectAll("svg").remove();

    var width = $("#svg").width(),
        m_width = GraphParameters.graphWidth,
        m_height = GraphParameters.graphHeight,
        height = GraphParameters.svgHeight,
        nodePadding = GraphParameters.nodePadding,
        nodeWidth = GraphParameters.nodeWidth,
        curvature = GraphParameters.curvature,
        offset = GraphParameters.offset;

    svg = d3.select("#svg").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + GraphParameters.graphWidth + " " + height)
        .attr("width", GraphParameters.graphWidth)
        .attr("height", height);
//        .on("mousewheel", function(e,i){console.log(e);console.log(i);});

    svg.append("rect")
        .attr("class", "sea")
        .attr("width", GraphParameters.graphWidth)
        .attr("height", height)
        .style("fill", 0,0,0,0)
        .style("opacity",0);//    .on("click", click);

    maing = svg.append("g").call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom)).append("g");// attr("id","maingroup");

    function zoom() {
        //console.log(d3.event.translate);
        var s = Math.min(Math.max(0.33,d3.event.scale),3)
        var dx = Math.min(Math.max(d3.event.translate[0],-s*GraphParameters.graphWidth),s*GraphParameters.graphWidth);
        maing.attr("transform", "translate(" + dx + ",0)scale(" + s + ",1)");
    }

    sankey = sankeyStream()
        .nodeWidth(nodeWidth)
        .curvature(curvature)
        .nodePadding(nodePadding)
        .size([GraphParameters.graphWidth, m_height])
        .offset(offset);

    path = sankey.link();

    colors = color; //d3.scale.ordinal(); //category10
    //console.log("cccolors"+d3.scale.ordinal());  //category10

    sankey
        .nodes(analysis.nodes)
        .links(analysis.links)
        .layout();

    mainplot = drawComponents(analysis);


    leyenda();

    //tooltip();




    // create the svg
    //rootSvg = d3.select("#tree-body").append("svg:svg");
    /*
    creating your svg image here


// create the zoom listener
var zoomListener = d3.behavior.zoom()
.scaleExtent([0.33, 1])
.on("zoom", zoomHandler);

// function for handling zoom event
function zoomHandler() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
    // apply the zoom behavior to the svg image
    zoomListener(svg);

       */

}


var i=0;

function tooltip(artist_name,img,url){
    i=i+1;
    $(document).ready(function() {
            //$('.tooltip').tooltipster();
            $('.tooltip').tooltipster({
                theme: 'tooltipster-light',
                interactive: true
                //content: $('<a href="'+url+'"><img src="'+img+'" style="width:'+"30%" +'" align="left"/></a><strong><p>'+ artist_name +'</strong></p><br/><a href="recommend.html" id="kkk">Similar artists</a> ')
                //content: $('<div class="tooltip"><img src="'+img+'" class="tooltip" style="width:25%" title="kdjlakjdalksjdlakjdlajda asd asdasd" /><a href="#"> <p>kjdalsdjadaldadald </p></a></div>')


});
        //var contenido = $('<a href="'+url+'"><img src="'+img+'" style="width:'+"30%" +'" align="left"/></a><strong><p>'+ artist_name +'</strong></p><br/><a href="recommend.html" id="kkk">Similar artists'+i+'</a>');
        var contenido = $('<a href="'+url+'"><img src="'+img+'" style="width:'+"30%" +'" align="left"/></a><a href="'+url+'"><strong><p>'+ artist_name +'</p></strong></a><br/><a href="recommend.html" id="kkk">Similar artists</a>');

            $('.tooltip').tooltipster('content',contenido);
        });

}


function tooltip_general(){

     $(document).ready(function() {
            //$('.tooltip').tooltipster();
            $('.tooltip').tooltipster({
                theme: 'tooltipster-light',
                interactive: true
                //content: $('<a href="'+url+'"><img src="'+img+'" style="width:'+"30%" +'" align="left"/></a><strong><p>'+ artist_name +'</strong></p><br/><a href="recommend.html" id="kkk">Similar artists</a> ')
                //content: $('<div class="tooltip"><img src="'+img+'" class="tooltip" style="width:25%" title="kdjlakjdalksjdlakjdlajda asd asdasd" /><a href="#"> <p>kjdalsdjadaldadald </p></a></div>')


});
        var contenido = $('<a href="+http://sonar.es/en"><img src="imgs/artist/general.png" style="width:'+"30%" +'" align="left"/></a><strong><p>Out of Sonar 2015</strong></p><br/>');

            $('.tooltip').tooltipster('content',contenido);
        });
}




function leyenda(){

    var legendWidth=400,
    legendHeight=100;
    var LEGEND_V_MARGIN = 8;
    var LEGEND_H_MARGIN_COLOR = 40;
    var LEGEND_H_MARGIN = 35;

 var jsonCirclesMap = [
    { "titleColor" : "#575958", "name": "Limbo", "id":"0"},
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
                .attr("font-family", "Nexa")
                .attr("class", "opacitySensible legend")
                .attr("font-size", ".25em")
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



}

function drawComponents(graph){

    var link = maing.append("g").selectAll(".link")
        .data(graph.links).enter();
//    console.log("Links");
//    console.log(graph.links);
    link.append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(0, d.dy);
        })
        .style("stroke", function (d) {
//            if (d.source.room == 4 || d.target.room == 4) {
                //return colors(d.source.room);
                return colors(d.source.room);

//            } else {
//                return "#000"
//            }
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });
    /*    link.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });
        */

    var node = maing.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    /*        .call(d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("dragstart", function () {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));*/

    node.append("rect")
        .attr("height", function (d) {
         if(d.layer>25){ /// TODO Arreglar para pillar tiempo actual
            return 2;
         }else{
            return d.dy;
         }
        })
        .attr("width", sankey.nodeWidth())
        .attr("class","tooltipster-default-preview tooltip")
        //.attr("title","sss")
        .attr("target","_blank")
        .style("fill", function (d) {

        if(d.layer>25){ /// TODO Arreglar para pillar tiempo actual
             return d.color = colors(8);
        }else{
           if(d.room==1 || d.room==8){
               return d.color = colors(0);
           }else{
             return d.color = colors(d.room);
           }
        }

            //return d.color = d3.scale.ordinal(d.room);
        })
        .style("opacity", function (d) {
           if(d.room==1 || d.room==8 ){   /* Salas marcadas como limbo*/
               return "0.3";
           }else if(d.layer>25){
               return "1";
           }
            //return d.color = d3.scale.ordinal(d.room);
        })
        .on("mouseover", function (d) {
            highlight = drawHighlight(d);
                view_artist_data(d,this);
        })
        .on("mouseout", function (d) {
            d3.selectAll(".highlightLink").remove();
        });

}


function drawHighlight(highlightNode){
    graph = {}
    graph.links = highlightNode.sourceLinks.concat(highlightNode.targetLinks);
//        .filter(function(d){return d.value > 0 && d.sy>0 && d.ty >0 ;});
//    console.log("highlight:");
//    console.log(graph.links);
    //graph.nodes = [highlightNode];

        //console.log(graph.links.filter(function(d){return d.value > 0;}));
    var link = maing.append("g").selectAll(".highlightLink")
        .data(graph.links).enter();

    link.append("path")
        .attr("class", "highlightLink")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(0, d.dy);
        })
        .style("fill", "none")
        .style("stroke", function (d) {
                return colors(d.source.room);
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });
/*
    var node = svg.append("g").selectAll(".highlightNode")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "highlightNode")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = colors(d.room);
        });
*/
    return link;
}


sponsors = { "SonarVillage by ESTRELLA DAMM": "Village",
            "SonarDome by Red BULL Music Academy": "Dome",
            "SonarHall": "Hall",
            "Hall+D": "Sonar+D",
            "SonarComplex": "Complex"
           }


function view_artist_data(userselection, rect, room) {
    d3.csv("data/artists_by_room.csv", function(data) { // TODO Pasar a memoria
        var filteredData = data.filter(function(d,i) {
            if (d["DIA"] == 18 && sponsors[d["SALA"]]=="Village" && d["HORA"] == "16:15")    //userselection["day"] userselection["room"]
            {  return d;}
        });
        console.log(userselection);
        console.log(filteredData[0].ACTIVIDAD);
        console.log(filteredData[0].FOTO1);
        if(userselection["room"]==1 || userselection["room"]==8){
            tooltip_general();
        }else{
            tooltip(filteredData[0].ACTIVIDAD, filteredData[0].FOTO1,  filteredData[0].URL);
        }
    });
}




/*window.onmousewheel(

document.attachEvent("on"+mousewheelevt, function(e){alert('Mouse wheel movement detected!')})

    GraphParameters.graphWidth += algo;
    draw();
);*/
