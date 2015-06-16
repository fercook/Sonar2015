var DAYS = ["2015-06-03", "2015-06-04", "2015-06-05"];
var DAY_INIT_TIME = "07:00:00";
var DAY_FINAL_TIME = "24:00:00";
var DAY_MINUTES_DURATION = 720;

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
            ready(null, result)
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

//paintAleatoryMac("Village");

//getMacInfo(MAC_ADRESS);