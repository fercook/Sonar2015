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

var analysis, nowidx;

var roomOrder = {
    "Entry": 1,
    "Village": 2,
    "Dome": 3,
    "Complex": 4,
    "PlusD": 5,
    "Planta": 6,
    "Hall": 7,
    "Exit": 8
};
var roomNames = ["Limbo", "Dome", "Hall", "Planta",
                     "PlusD", "Village", "Complex",
                     "Limbo"];

var color = d3.scale.ordinal()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8])
    .range(["#bbbbbb", "#bbbbbb", "#BF0CB9", "#DB57D0", "#DDB0BF", "#B9DBA2", "#7ED96D", "#09AE48", "#bbbbbb", "#3366FF"]);

var jsonCirclesMap = [
    {
        "titleColor": "#BBBBBB",
        "name": "Limbo",
        "id": "0"
    },
        {
        "titleColor": "#BF0CB9",
        "name": "Village",
        "id": "1"
    },
    {
        "titleColor": "#DB57D0",
        "name": "Dome",
        "id": "2"
    },
    {
        "titleColor": "#DDB0BF",
        "name": "Complex",
        "id": "3"
    },
    {
        "titleColor": "#B9DBA2",
        "name": "Sonar+D",
        "id": "4"
    },
    {
        "titleColor": "#7ED96D",
        "name": "Planta",
        "id": "5"
    },    
    {
        "titleColor": "#09AE48",
        "name": "Hall",
        "id": "6"
    }
];



function put_time(){
    
    var jj = //d3.selectAll("rect")//
              d3.select("#svg")  //rect
               // .enter()
                .append("svg:image")
                //.attr("xlink:href", "../imgs/time.png")
                .attr("xlink:href","http://www.2dcodeabode.com/wp-content/uploads/2010/07/129130-simple-red-square-icon-media-media2-arrow-down-300x300.png")
                .attr("src","http://www.2dcodeabode.com/wp-content/uploads/2010/07/129130-simple-red-square-icon-media-media2-arrow-down-300x300.png")
                //.attr("style","overflow:visible;")
                //.attr("x", "60")
                //.attr("y", "60")
                .attr("width", "250")
                .attr("height", "250");
    
}

function getDataFromServer() {
    $.ajax("http://visualization-case.bsc.es/getGraph.jsp?type=15&callback=?", {
        dataType: "jsonp",
        crossDomain: true
    })
        .done(function (json) {
            console.log("Communication ok");

            //d3.json("data/test_graph.json", function (error, json) { //AJAX
            // nowidx = new Date(); // AJAX
            //  nowidx = timeidx(new Date("2015-06-19 14:40:00")); // We stop looking at current time //DEBUG
            process_json(json);
            draw();
        });
}
//TIMER: UNCOMMENT FOR PRODUCTION DEBUG
//setInterval(function(){ getDataFromServer(); }, 5*60*1000 );

var time_steps = (11 + 10 + 10) * 4; //TODO: CALCULAR TIEMPOS TOTALES// time_step_group.top(Infinity).length;
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
var timeidx = function (time) { // Given a date, compares to latest time in graph and returns the layer idx
    var hour = time.getHours();
    var day = time.getDate();
    var minutes = time.getMinutes();
    if (day < 18 || day > 20 || hour < 12 // No Sonar here
        || (day == 18 && hour >= 23) || (day == 19 && hour >= 22) || (day == 20 && hour >= 22)) {
        return null;
    }
    var idx = 0;
    if (day == 19) {
        idx += 11 * 4;
    }
    if (day == 20) {
        idx += 11 * 4 + 10 * 4;
    }
    idx += (hour - 12) * 4;
    idx += Math.floor(minutes / 15.0);
    return idx;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var timeFromIdx = function (idx) { // Given a date, compares to latest time in graph and returns the layer idx
    var day, hour, minutes;
    if (idx > 11 * 4 + 10 * 4) {
        day = 20;
        idx -= 11 * 4 + 10 * 4;
    } else if (idx >= 11 * 4) {
        day = 19;
        idx -= 11 * 4;
    } else {
        day = 18;
    }
    hour = 12 + Math.floor(idx / 4);
    minutes = (idx % 4) * 15;
    return {
        day: day,
        time: pad(hour, 2) + ":" + pad(minutes, 2)
    };
}


var getColor = function (d) {
    if (d.room == 1 || d.room == 8) {
        return d.color = colors(0);
    } else {
        return d.color = colors(d.room);
    }
}

function process_json(json) {
    console.log(json);

    // Create empty graph
    analysis = {};
    analysis.links = Array((time_steps - 2) * total_rooms * total_rooms + (total_rooms - 1) * total_rooms + total_rooms - 1);
    analysis.nodes = Array(time_steps * total_rooms);
    // Prepare a couple of temporary useful vars
    for (var t = 0; t < time_steps; t++) {
        for (var s = 1; s <= total_rooms; s++) {
            analysis.nodes[nodeidx(t, s)] = {
                "layer": t,
                "row": s - 1,
                "name": nodeidx(t, s),
                "room": s,
                "fullName": roomNames[s - 1],
                "value": 0
            };
        }
    }
    for (var t = 0; t < time_steps - 1; t++) {
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
    for (var n = 0; n < time_steps; n++) buckets[n] = [];
    json.graph.forEach(function (message) {
        var time_start = new Date(message.time_start);
        tidx = timeidx(time_start);
        if (tidx != null) {
            buckets[tidx].push(message);
        }
    });
    // Clean buckets
    for (var n = 0, len = buckets.length; n < len && n < nowidx; n++) {
        if (buckets[n].length == 0) {
            if (n < len - 1 && buckets[n + 1].length == 2) { // me robo uno
                var t0 = new Date(buckets[n + 1][0].time_start);
                var t1 = new Date(buckets[n + 1][1].time_start);
                if (t0 <= t1) {
                    buckets[n].push(buckets[n + 1].shift());
                } else {
                    buckets[n].push(buckets[n + 1].pop());
                }
            } else if (n > 0 && buckets[n - 1].length == 1) {
                buckets[n] = buckets[n - 1]; // me copio el anterior
            }
        } else if (buckets[n].length == 2) {
            if (n < len - 1 && buckets[n + 1].length == 0) {
                ///// elejir el mas tarde y pasarlo
                var t0 = new Date(buckets[n][0].time_start);
                var t1 = new Date(buckets[n][1].time_start);
                if (t0 <= t1) {
                    buckets[n + 1].push(buckets[n].pop());
                } else {
                    buckets[n + 1].push(buckets[n].shift());
                }
            } else {
                ///// Elijo el mas tarde y elimino
                var t0 = new Date(buckets[n][0].time_start);
                var t1 = new Date(buckets[n][1].time_start);
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

    for (var t = 0; t < time_steps; t++) {
        if (buckets[t].length) {
            var dict = getMACDict(new Date(buckets[t][0].time_start));
            for (var ridx = 0; ridx < buckets[t][0].rooms.length; ridx++) {
                var room = buckets[t][0].rooms[ridx];
                if (dict[room.name]) {
                    var v = analysis.nodes[nodeidx(t, roomOrder[dict[room.name]])].value;
                    analysis.nodes[nodeidx(t, roomOrder[dict[room.name]])].value += room.devices;
                } else {
                    console.log("Sensor MAC Address not recognized! " + room.name);
                }
            }
            for (var lidx = 0; lidx < buckets[t][0].links.length; lidx++) {
                var link = buckets[t][0].links[lidx];
                var s = roomOrder[dict[link.start_room]];
                var e = roomOrder[dict[link.end_room]];
                if (s != null && e != null && linkidx(t, s, e) != null && link != null && link.value != null && analysis.links[linkidx(t, s, e)] != null && analysis.links[linkidx(t, s, e)].value != null) {
                    analysis.links[linkidx(t, s, e)].value += link.value;
                }
            }
        }
    }


}



function draw() {


    d3.selectAll("svg").remove();

    var width = $("#svg_main").width(),
        m_width = GraphParameters.graphWidth,
        m_height = GraphParameters.graphHeight,
        height = GraphParameters.svgHeight,
        nodePadding = GraphParameters.nodePadding,
        nodeWidth = GraphParameters.nodeWidth,
        curvature = GraphParameters.curvature,
        offset = GraphParameters.offset;

    svg = d3.select("#svg_main").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("id","lcf")
        .attr("viewBox", "0 0 " + GraphParameters.graphWidth + " " + height)
        .attr("width", GraphParameters.graphWidth)
        .attr("height", height);
    //        .on("mousewheel", function(e,i){console.log(e);console.log(i);});

    svg.append("rect")
        .attr("class", "sea")
        .attr("width", GraphParameters.graphWidth)
        .attr("height", height)
        .style("fill", "black")
        .style("opacity", 0); //    .on("click", click);

    svg.call(d3.behavior.zoom().scaleExtent([1, 12]).on("zoom", zoom)).append("g");
    maing = svg.append("g").call(d3.behavior.zoom().scaleExtent([1, 12]).on("zoom", zoom)).append("g"); // attr("id","maingroup");

    function zoom() {
        //console.log(d3.event.translate);
        var s = Math.min(Math.max(0.33, d3.event.scale), 3)
        var dx = Math.min(Math.max(d3.event.translate[0], -s * GraphParameters.graphWidth), s * GraphParameters.graphWidth);
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

    drawComponents(analysis);


    leyenda();


    var i = 0;
    //$('.tooltip').tooltipster();

<<<<<<< HEAD
    function tooltip(artist_name, img, url) {
        i = i + 1;
        $(document).ready(function () {
            $('.tooltip').tooltipster({
                theme: 'tooltipster-light',
                interactive: true,
                debug: false
            });
            var contenido = $('<a href="' + url + '"><img src="' + img + '" style="width:' + "30%" + '" align="left"/></a><a href="' + url + '"><strong><p>' + artist_name + '</p></strong></a><br/><a href="recommend.html" id="kkk">Similar artists</a>');
            /*
        var contenido = $('<a href="' + url + '"><img src="' + img + '" style="width:' + "30%" + '" align="left"/></a><a href="' + url + '"><strong><p>' + artist_name + '</p></strong></a><br/><a href="recommend.html" id="kkk">Similar artists</a>');
        */
            $('.tooltip').tooltipster('content', contenido);

        });
=======

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
               
            });
       
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
      });
        
 });
         var contenido = $('<a href="+http://sonar.es/en"><img src="imgs/artist/general.png" style="width:'+"30%" +'" align="left"/></a><strong><p>Out of Sonar 2015</strong></p><br/>');
>>>>>>> 89c161c36bf54f750f2e9b612e41774c5d15c05a

    }

<<<<<<< HEAD
    function tooltipContent(artist_name, img, url) {
        var contenido = '<a href="' + url + '"><img src="' + img + '" style="width:' + "30%" + '" align="left"/></a><a href="' + url + '"><strong><p>' + artist_name + '</p></strong></a><br/><a href="recommend.html" id="kkk">Similar artists</a>';
        return contenido;
    }
=======
        //var contenido = $('<a href="'+url+'"><img src="'+img+'" style="width:'+"30%" +'" align="left"/></a><strong><p>'+ artist_name +'</strong></p><br/><a href="recommend.html" id="kkk">Similar artists'+i+'</a>');
}
                    
>>>>>>> 89c161c36bf54f750f2e9b612e41774c5d15c05a


    function leyenda() {

        var legendWidth = 400,
            legendHeight = 100;
        var LEGEND_V_MARGIN = 8;
        var LEGEND_H_MARGIN_COLOR = 40;
        var LEGEND_H_MARGIN = 35;

        var jsonCirclesMap = [
            {
                "titleColor": "#575958",
                "name": "Limbo",
                "id": "0"
        },
            {
                "titleColor": "#DB57D0",
                "name": "Dome",
                "id": "1"
        },
            {
                "titleColor": "#DDB0BF",
                "name": "Complex",
                "id": "2"
        },
            {
                "titleColor": "#09AE48",
                "name": "Hall",
                "id": "3"
        },
            {
                "titleColor": "#7ED96D",
                "name": "Planta",
                "id": "4"
        },
            {
                "titleColor": "#BF0CB9",
                "name": "Village",
                "id": "5"
        },
            {
                "titleColor": "#B9DBA2",
                "name": "Sonar+D",
                "id": "7"
        }];




        printRoomLegend = function (circles) {

            legendSvgContainer.selectAll("text")
                .data(jsonCirclesMap)
                .enter()
                .append("text")
                .attr("x", function (d, i) {
                    return (i + 1) * LEGEND_H_MARGIN;
                })
                .attr("y", LEGEND_V_MARGIN)
                .attr("text-anchor", "end")
                .attr("fill", "#3e78f3")
                .attr("data-room", function (d) {
                    return d["id"]
                })
                .attr("font-family", "Nexa")
                .attr("class", "opacitySensible legend")
                .attr("font-size", ".25em")
                .text(function (d) {
                    return d.name
                });
            legendSvgContainer.selectAll("rect")
                .data(jsonCirclesMap)
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return (i + 1) * LEGEND_H_MARGIN + 4;
                })
                .attr("y", LEGEND_V_MARGIN - 4)
                .attr("width", 4)
                .attr("class", "opacitySensible legend")
                .attr("data-room", function (d) {
                    return d["id"]
                })
                .attr("height", 4)
                .style("fill", function (d) {
                    return d.titleColor
                })
                .style("stroke", function (d) {
                    return d.titleColor
                });
        }

        var legendDiv = d3.select("#legend");

        var legendSvgContainer = legendDiv.append("svg")
            .attr("class", "legend-svg")
            .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight)
            .attr("preserveAspectRatio", "xMinYMin meet");

        printRoomLegend(jsonCirclesMap);

    }

    function drawComponents(graph) {

        var link = maing.append("g").selectAll(".link")
            .data(graph.links).enter();
        //    console.log("Links");
        //    console.log(graph.links);
        link.append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function (d) {
                if (d.layer > nowidx) return 0;
                return Math.max(0, d.dy / 1.5);
            })
            .style("stroke", function (d) {
                //            if (d.source.room == 4 || d.target.room == 4) {
                //return colors(d.source.room);
                if (d.layer > nowidx) return "#000";
                return colors(d.source.room);

                //            } else {
                //                return "#000"
                //            }
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            })
            .style("opacity", function (d) {
                if (d.room == 1 || d.room == 8) return 0.01;
                return 0.1;
            });


        var node = maing.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });


        var sponsors = {
            "SonarVillage by ESTRELLA DAMM": "Village",
            "SonarDome by Red BULL Music Academy": "Dome",
            "SonarHall": "Hall",
            "Hall+D": "PlusD",
            "SonarComplex": "Complex"
        }


        d3.csv("data/artists_by_room.csv", function (data) {
            artist_data = data;
            console.log("Artist data read");

            function get_artist_data(layer, room) {
                var date = timeFromIdx(layer);
                var filteredData = artist_data.filter(function (d, i) {
                    return (d["DIA"] == date.day &&
                        roomOrder[sponsors[d["SALA"]]] == room &&
                        d["HORA"] == date.time);
                });
                if (room == 1 || room == 8) {
                    return tooltipContent("Out of Sonar 2015", "imgs/artist/general.png", "http://sonar.es/en");
                } else {
                    if (filteredData[0]) {
                        return tooltipContent(filteredData[0].ACTIVIDAD, filteredData[0].FOTO1, filteredData[0].URL);
                    }
                }
            }

            function view_artist_data(userselection, rect, room) {
                //    d3.csv("data/artists_by_room.csv", function(data) { // TODO Pasar a memoria
                var date = timeFromIdx(userselection["layer"]);
                var filteredData = artist_data.filter(function (d, i) {
                    return (d["DIA"] == date.day &&
                        roomOrder[sponsors[d["SALA"]]] == userselection.room && //sponsors[d["SALA"]] == userselection["fullName"] &&
                        d["HORA"] == date.time);
                });
                console.log(userselection);
                console.log("filter");
                console.log(filteredData);
                if (userselection["room"] == 1 || userselection["room"] == 8) {
                    tooltip("Out of Sonar 2015", "imgs/artist/general.png", "http://sonar.es/en");
                } else {
                    if (filteredData[0]) {
                        tooltip(filteredData[0].ACTIVIDAD, filteredData[0].FOTO1, filteredData[0].URL);
                    }
                }
            }

<<<<<<< HEAD
            node.append("rect")
                .attr("height", function (d) {
                    if (d.layer > nowidx) { /// TODO Arreglar para pillar tiempo actual
                        return 2;
                    } else {
                        return d.dy;
                    }
                })
                .attr("width", sankey.nodeWidth())
                .attr("class", "tooltip")
                .attr("title", function (d) {
                    return get_artist_data(d.room, d.layer);
                })
                .attr("target", "_blank")
                .style("fill", function (d) {

                    if (d.layer > nowidx) { /// TODO Arreglar para pillar tiempo actual
                        return d.color = colors(8);
                    } else {
                        if (d.room == 1 || d.room == 8) {
                            return d.color = colors(0);
                        } else {
                            return d.color = colors(d.room);
                        }
                    }

                    //return d.color = d3.scale.ordinal(d.room);
                })
                .style("opacity", function (d) {
                    if (d.room == 1 || d.room == 8) { /* Salas marcadas como limbo*/
                        return "0.3";
                    } else if (d.layer > nowidx) {
                        return "1";
                    }
                    //return d.color = d3.scale.ordinal(d.room);
                })
                .on("mouseover", function (d) {
                    highlight = drawHighlight(d);
                    view_artist_data(d, this);
                })
                .on("mouseout", function (d) {
                    d3.selectAll(".highlightLink").remove();
                });
=======
            //return d.color = d3.scale.ordinal(d.room);
        })
        .style("opacity", function (d) {
            if (d.room == 1 || d.room == 8) { /* Salas marcadas como limbo*/
                return "0.3";
            } else if (d.layer > nowidx) {
                return "1";
            }
            //return d.color = d3.scale.ordinal(d.room);
        })
        .on("mouseover", function (d) {
            highlight = drawHighlight(d);
            view_artist_data(d, this);
        })
        .on("mouseout", function (d) {
            d3.selectAll(".highlightLink").remove();
        });
    
    
    put_time();



    });
>>>>>>> 89c161c36bf54f750f2e9b612e41774c5d15c05a

        });

    }


    function drawHighlight(highlightNode) {
        graph = {}
        graph.links = highlightNode.sourceLinks.concat(highlightNode.targetLinks);
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
            })
            .style("opacity", function (d) {
                if (d.room == 1 || d.room == 8) return 0.05;
                return 0.4;
            });

        return link;
    }


    //// MAIN
}
    getDataFromServer();
 
