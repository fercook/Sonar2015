maxindex = function (array, f) {
    var i = -1,
        n = array.length,
        a, b, j = -1;
    if (arguments.length === 1) {
        while (++i < n)
            if ((b = array[i]) != null && b >= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = array[i]) != null && b > a) {
                a = b;
                j = i;
            }
    } else {
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b > a) {
                a = b;
                j = i;
            }
    }
    return j;
}

minindex = function (array, f) {
    var i = -1,
        n = array.length,
        a, b, j = -1;
    if (arguments.length === 1) {
        while (++i < n)
            if ((b = array[i]) != null && b <= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = array[i]) != null && b < a) {
                a = b;
                j = i;
            }
    } else {
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b <= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b < a) {
                a = b;
                j = i;
            }
    }
    return j;
}


var width = $("#svg").width(),
    m_width = 4000,
    height = 800;

var svg = d3.select("#svg").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + m_width + " " + height)
    .attr("width", m_width)
    .attr("height", height );

svg.append("rect")
    .attr("class", "sea")
    .attr("width", m_width)
    .attr("height", height)
    .style("fill", "white");
//    .on("click", click);

var maing = svg.append("g");

var sankey = sankeyStream()
    .nodeWidth(0.4)
    .curvature(0.3)
    .nodePadding(50)
    .size([m_width, 500])
    .offset("Centered");

var path = sankey.link();

queue()
    .defer(d3.json, "prob_separated.json")
    .await(ready);

function ready(error, fulllog) {

    var t0 = performance.now();
    var records = crossfilter(fulllog);
    allrecords = records.groupAll();
    records_by_time = records.dimension(function (d) {
        return Math.floor(d.time / (2*15.0)); // Why is this 2*minutes???
    });
    records_by_room = records.dimension(function (d) {
        return d.room;
    });
    records_by_id = records.dimension(function (d) {
        return d.id;
    });
    time_step_group = records_by_time.group();
    time_steps = time_step_group.top(Infinity).length;

    total_rooms = 6;
    analysis = {};
    analysis.links = Array((time_steps-2) * total_rooms * total_rooms + (total_rooms - 1) * total_rooms + total_rooms - 1);
    analysis.nodes = Array(time_steps * total_rooms);
    // Prepare a couple of temporary useful vars
    nodeidx = function (time, room) {
        return time * total_rooms + room - 1;
    }
    linkidx = function (time, startroom, endroom) {
        // Goes from startroom at time to endroom at time+1
        return time * total_rooms * total_rooms + (startroom - 1) * total_rooms + endroom - 1;
    }
    for (var t = 0; t < time_steps; t++) {
        for (var s = 1; s <= total_rooms; s++) {
            analysis.nodes[nodeidx(t, s)] = {"layer": t, "row": s-1, "name": nodeidx(t, s), "room": s};}
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
    var t1 = performance.now();
    for (var t = 0; t < time_steps-1; t++) {
        console.log(t + " of " + time_steps);
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
            var start_room = records_by_id.top(Infinity)[start_idx].room;
            var enter_room = records_by_id.top(Infinity)[enter_idx].room;
            analysis.links[linkidx(t, start_room, enter_room)]["value"] += 1;
        });
        records_by_id.filterAll();
    }
    records_by_time.filterAll();
    var t2 = performance.now();
    draw();
    t3=performance.now();
    console.log("Total took " + (t3 - t0) + " milliseconds.");
    console.log("Processing took  " + (t2 - t1) + " milliseconds.");
    console.log("Initial Preparation took " + (t2 - t1) + " milliseconds.");
    console.log("Rendering took " + (t3 - t2) + " milliseconds.");


}

colors = d3.scale.category10();

function draw() {
     sankey
        .nodes(analysis.nodes)
        .links(analysis.links)
        .layout();

     link = svg.append("g").selectAll(".link")
        .data(analysis.links).enter();
    
      link.append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
        })
        .style("stroke", function (d) {
          if (d.source.room == 4 || d.target.room == 4) {return colors(d.source.room);}
          else {return "#000"}
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });
    /*    link.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });
        */

    node = svg.append("g").selectAll(".node")
        .data(analysis.nodes)
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
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = colors(d.room);})
        .on("mouseover",function(d){
            var links = svg.selectAll(".link");
            
        })
        .on("mouseout",function(d){
            var links = svg.selectAll(".link");
        });

             //function (d) {
            //return d3.rgb(d.color).darker(2); })
//        .append("title")
//        .text(function (d) {
//            return d.name + "\n" + format(d.value);
//        });
    ;
   
}

/*    getHour = function(d){ return Math.floor(d*30/3600); } */

//    times = records_by_time.group(function(d) { return Math.floor(d.time*30/(60)) });
//    records_by_hour = records.dimension(function(d) { return d.time*30/3600; } );
//    hours = records_by_hour.group();
//records_by_id = records.dimension(function(d) { return d.id; } );
//    rooms = records_by_room.group();
//    records_by_power = records.dimension(function(d) { return d.power; } );
//    powers = records_by_room.group( function(d) { return Math.floor(d.power/10); });
/*   Old parsing
timedata=[];
    var lasttime = -1;
    fulllog.forEach(function(d) {
        if (d.time > lasttime) {
            timedata.push([]);
            lasttime += 1;
        }
        var parsed = { room: d.room, power:d.power, id:d.id};
        timedata[lasttime].push(parsed);
    });
  
    total_rooms = rooms.top(Infinity).length;
    total_times = times.top(Infinity).length;
    ids_by_hour = Array(total_rooms);
  */



/*


    "time": 0,
    "room": 1,
    "power": 30.396655916738247,
    "id": "ccdb2663-eaab-11e4-8afe-685b35ad5a90"
}
*/