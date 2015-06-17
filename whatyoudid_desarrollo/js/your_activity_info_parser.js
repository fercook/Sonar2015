var DAYS = ["2015-06-03", "2015-06-04", "2015-06-05"];
var DAY_INIT_TIME = "07:00:00";
var DAY_FINAL_TIME = "24:00:00";
var DAY_MINUTES_DURATION = 720;
var INITIAL_DAY = 18

var getDateRange = function (day, dateInit, dateFin) {
    eventFin = new XDate(dateFin.replace(' ', 'T'));
    eventInit = new XDate(dateInit.replace(' ', 'T'));
    dayInit = new XDate(day+'T'+DAY_INIT_TIME);
    dayFin = new XDate(day+'T'+DAY_FINAL_TIME);
    if(dayFin.diffMinutes(eventInit) > 0 || dayInit.diffMinutes(eventFin) < 0) return null;
    var minDate = [eventFin, dayFin].reduce(function (a, b) { return a.diffMinutes(b) > 0 ? a : b; }); 
    var maxDate = [eventInit, dayInit].reduce(function (a, b) { return a.diffMinutes(b) < 0 ? a : b; });
    return [maxDate, minDate]
};

paintMacActivity = function(mac_adress) {
    $.ajax("http://visualization-case.bsc.es/getActivityJson.jsp?request_type=mac&device_mac="+mac_adress+"&callback=?",
        {dataType:"jsonp", crossDomain: true})
        .done(function( data ) {
            var result = []
            var initialMinute = DAY_INIT_TIME.split(':')[0]*60+DAY_INIT_TIME.split(':')[1]
            for(var i = 0; i < data.result.length; ++i) {
                var dailyResult = []
                for(var j=0; j < DAYS.length; ++j) {
                    dateRange = getDateRange(DAYS[j], data.result[i].s, data.result[i].f);
                    if(dateRange) {
                        rooms = getRoomsByMac(data.result[i].b, dateRange[0], dateRange[1]);
                        //TODO: A lot of suppositions which can fail. Take care.
                        for(var k = 0; k < rooms.length; ++k) {
                            var initHour = rooms[k].timeStart.getMinutes()*60+rooms[k].timeStart.getSeconds();
                            var finalHour = rooms[k].timeEnd.getMinutes()*60+rooms[k].timeEnd.getSeconds();
                            initHour += j*DAY_MINUTES_DURATION;
                            finalHour += j*DAY_MINUTES_DURATION;
                            if(dailyResult.length > 0 && dailyResult[dailyResult.length-1].room == rooms[k].name) 
                                dailyResult[dailyResult.length-1].finalTime = finalHour;
                            else
                                dailyResult[dailyResult.length] = {"initTime": initHour, "finalTime": finalHour, "room": rooms[k].name}
                        }
                    }
                }
                result.concat(dailyResult);
            }
            ready(null, result, mac_adress)
        }
    );
};

paintAleatoryMac = function(room) {
    var mac = getMACByRoomXDate(room, new XDate(true))
    $.ajax("http://visualization-case.bsc.es/getActivityJson.jsp?request_type=random&box_mac=" + mac[0],
        {dataType:"jsonp", crossDomain: true})
        .done(function( data ) {
            paintMacActivity(data.device_mac);
        }
    );
}

eventCsvParser = function(steps) {
    d3.csv("data/artists_by_room.csv", function(data) {
        artistList = []
        for(var i = 0; i < jsonCirclesMap.length; ++i) {
            artistList[artistList.length] = [];
        }
        for(var i = 0; i < steps.length ; ++i) {
            if(steps[i].room != LIMBO) {
                var day = Math.floor(steps[i].initTime/720)+INITIAL_DAY;
                var temporalInitTime = -1;
                var events = [];
                for(var j = 0; j < data.length; ++j) {
                    var d = data[j];
                    if (d["DIA"] == day && d["SALA"] == jsonCirclesMap[steps[i].room].eventsName) {
                        if(temporalInitTime == -1) {
                            var hour = d["HORA"].split(':')
                            temporalInitTime = (d["DIA"]-INITIAL_DAY)*720 + (hour[0]-12)*60 + parseInt(hour[1]);
                        }
                        if (temporalInitTime < steps[i].finalTime) {
                            if(!data[j+1] || data[j+1]["ACTIVIDAD"] != d["ACTIVIDAD"] || data[j+1]["DAY"] != d["DAY"] || data[j+1]["SALA"] != d["SALA"]) {
                                var hourNext = d["HORA"].split(':');
                                var minuteNext = (d["DIA"]-INITIAL_DAY)*720 + (hourNext[0]-12)*60 + parseInt(hourNext[1]);
                                
                                if (minuteNext > steps[i].initTime)
                                    events.push({"eventName": d["ACTIVIDAD"], "initTime": temporalInitTime, "finalTime": minuteNext, "url": d["URL"], "pic": d["FOTO1"]});
                                temporalInitTime = -1;
                            }
                        }
                    }
                    else if(d["DIA"] > day) break;
                }

                var eventList = []
                for(var j = 0; j < events.length; ++j) {
                    var duration = Math.min(events[j].finalTime, steps[i].finalTime) - Math.max(events[j].initTime, steps[i].initTime);
                    var percent = duration*100/(events[j].finalTime-events[j].initTime);
                    //_addToArtistList(artistList[steps[i].room], events[j].eventName, events[j].id, events[j].room, percent)
                    events[j]["percent"] = percent;
                    eventList[eventList.length] = events[j];
                }
                //eventList.sort(sort_by('percent', true, parseInt));
                _printCircleArtist(eventList, steps[i].room, steps[i].generatedId);
            }
        }
    });
}