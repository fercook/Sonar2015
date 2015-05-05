queue()
    .defer(d3.json, "../DATA/prob_separated.json")
    .await(ready);

function ready(error, jsonfile) {

    var t0 = performance.now();
    var records = crossfilter(fulllog);
    allrecords = records.groupAll();
    records_by_time = records.dimension(function (d) {
        return Math.floor(d.time / (2*15.0)); // Why is this 2*minutes???
    });
//   records_by_room = records.dimension(function (d) {
//        return d.room;
//    });
    records_by_id = records.dimension(function (d) {
        return d.id;
    });
    time_step_group = records_by_time.group();
    time_steps = time_step_group.top(Infinity).length;

    total_rooms = 8;
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
}