Rooms = {};

RoomRecords = [
          {name: "Village",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:00"},
          {name: "Village",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:01"},
          {name: "Village",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:02"},
          {name: "Village",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:03"},
          {name: "Village",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:04"},
          {name: "Dome",   startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:05"},
          {name: "Dome",   startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:06"},
          {name: "Hall",   startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:07"},
          {name: "Planta", startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:08"},
          {name: "PlusD",  startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:09"},
          {name: "PlusD",  startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:10"},
          {name: "PlusD",  startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:11"},
          {name: "PlusD",  startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:12"},
          {name: "Complex",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:13"},
          {name: "Complex",startDate: new Date("2015-06-07 09:30:00"), endDate: new Date("2015-06-07 13:25:00"), MAC:"de:de:de:de:de:14"},

          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:00"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:01"},
          {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:02"},
            {name: "Dome",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:03"},
            {name: "PlusD",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:04"},
          {name: "Dome",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:05"},
            {name: "Village",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:06"},
          {name: "Hall",   startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:07"},
          {name: "Planta", startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:08"},
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:09"},
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:10"},
            {name: "Complex",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:11"},
          {name: "PlusD",  startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:12"},
            {name: "Village",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:13"},
          {name: "Complex",startDate: new Date("2015-06-07 13:25:01"), endDate: new Date("2015-06-07 15:55:00"), MAC:"de:de:de:de:de:14"}
];

var getRoomByMAC = function(mac,date) {
    var room = [];
    RoomRecords.forEach(function(d) {
        if (date) {
            if (d.MAC==mac && date >= d.startDate && date <= d.endDate) room.push(d.name);
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
            if (d.name==room && date >= d.startDate && date <= d.endDate) mac.push(d.MAC);
        }
        else {
            if (d.name==name) mac.push(d.MAC);
        }
    });
    return mac;
};


var getMACDict = function(date) {
    var dict = {};
    RoomRecords.forEach(function(d) {
        if (date >= d.startDate && date <= d.endDate) dict[d.MAC]=d.name;
    });
    return dict;
};

var getRoomDict = function(date) {
    var dict = {};
    RoomRecords.forEach(function(d) {
        if (date >= d.startDate && date <= d.endDate) dict[d.name]=d.MAC;
    });
    return dict;
};
