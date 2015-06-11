Rooms = ["Dome","Hall", "Planta","PlusD", "Complex","Village","Entry","Exit"];

MACS = [
        "00:13:EF:C0:09:FD",
        "00:13:EF:CA:0C:53",
        "00:13:EF:C7:10:5B",
        "00:13:EF:C7:0E:EA",
        "48:5D:60:D2:03:A2"
        ];

RoomRecords = [
          {name: "Village",time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C0:09:FD"},
          {name: "Dome",   time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:CA:0C:53"},
          {name: "Hall",   time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C7:10:5B"},
          {name: "Planta", time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C7:0E:EA"},
          {name: "PlusD",  time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"48:5D:60:D2:03:A2"},
          {name: "Complex",time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"de:de:de:de:de:14"}
];
/*,
          {name: "Complex",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:13"},
          {name: "Complex",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:14"},

          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:00"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:01"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:02"},
          {name: "Dome",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:03"}, ////////
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:04"}, ///////
          {name: "Dome",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:05"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:06"}, //////
          {name: "Hall",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:07"},
          {name: "Planta", startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:08"},
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:09"},
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:10"},
          {name: "Complex",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:11"}, ///////
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:12"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:13"}, //////
          {name: "Complex",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:14"}
];
*/

var getRoomByMAC = function(mac,date) {
    var room = [];
    RoomRecords.forEach(function(d) {
        if (date) {
            if (d.MAC==mac && date >= d.time_start && date <= d.time_end) room.push(d.name);
        }
        else {
            if (d.MAC==mac) room.push(d.name);
        }
    });
    return room;
};


var getMACByRoom = function(name,date) {
    var mac = [];
    RoomRecords.forEach(function(d) {
        if (date) {
            if (d.name==room && date >= d.time_start && date <= d.time_end) mac.push(d.MAC);
        }
        else {
            if (d.name==name) mac.push(d.MAC);
        }
    });
    return mac;
};

var getMACDict = function(date) {
    var dict = {"entry": "Entry", "exit": "Exit"};
    RoomRecords.forEach(function(d) {
        if (date >= d.time_start && date <= d.time_end) dict[d.MAC]=d.name;
    });
    return dict;
};

var getRoomDict = function(date) {
    var dict = {};
    RoomRecords.forEach(function(d) {
        if (date >= d.time_start && date <= d.time_end) dict[d.name]=d.MAC;
    });
    return dict;
};
