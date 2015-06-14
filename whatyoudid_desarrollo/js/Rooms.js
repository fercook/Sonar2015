/*
roomstext = "room, time_start, time_end, MAC \
Dome   , 2015-06-11 14:09:59, 2015-06-12 14:14:59, 00:13:EF:CA:0C:53 \
Hall   , 2015-06-11 14:09:59, 2015-06-12 14:14:59, 00:13:EF:C7:10:5B \
Planta , 2015-06-11 14:09:59, 2015-06-12 14:14:59, 00:13:EF:C7:0E:EA \
PlusD  , 2015-06-11 14:09:59, 2015-06-12 14:14:59, 48:5D:60:D2:03:A2 \
Complex, 2015-06-11 14:09:59, 2015-06-12 14:14:59, de:de:de:de:de:14 \
Village, 2015-06-11 14:09:59, 2015-06-12 14:14:59, 00:13:EF:C0:09:FD \
Village, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:00 \
Village, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:01 \
Village, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:02 \
Village, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:06 \
Dome   , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:03 \ 
Dome   , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:05 \
PlusD  , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:04 \
PlusD  , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:12 \
PlusD  , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:09 \
Hall   , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:10 \
Hall   , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:07 \
Hall   , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:13 \   
Planta , 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:08 \
Complex, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:11 \
Complex, 2015-06-07 13:25:01, 2015-06-30 15:55:00, de:de:de:de:de:14 "

*/
/*function getdatafromfileSync(filename)  {
    // Read annotation file. Example : %timeinstant \t %value \n
    // Return an array of string
    var arraydata
    $.ajax({
      type: "GET",
      url: filename,
      dataType: "text",
      async: false,
      success: function(csv) {
          arraydata = d3.csv.parse(csv, function(row) {
            return {name: row.room, 
                    time_start: new Date(row.time_start), 
                    time_end: new Date(row.time_end), 
                    MAC: row.MAC } ;
            });
          //arraydata = $.csv.toArrays(csv,{separator:'\t'}); 
      }
      });
return arraydata
}        
var RoomRecords = getdatafromfileSync("data/roommacs.csv");
    //var RoomRecords =  d3.csv("data/roommacs.csv", function(row) {
    //return {name: row.room, time_start: new Date(row.time_start), time_end: new Date(row.time_end), MAC: row.MAC } ;
    //});



var RoomRecords = d3.csv.parse(roomstext, function(row) {
            return {name: row.room, 
                    time_start: new Date(row.time_start), 
                    time_end: new Date(row.time_end), 
                    MAC: row.MAC } ;
            });
*/

Rooms = ["Dome","Hall", "Planta","PlusD", "Complex","Village","Entry","Exit"];
RoomIdx = {};
Rooms.forEach(function(name,i){ 
    RoomIdx[name]= i; 
});

Signals = ["low","medium","high","very_high"];
SignalsIdx = {};
Signals.forEach(function(strength,i){ 
    SignalsIdx[strength]= i; 
});

/*
    "#DB57D0", "name": "Dome", "id":"1"},
    "#09AE48", "name": "Hall", "id":"3"},
    "#7ED96D", "name": "Planta", "id":"4"},
    "#B9DBA2", "name": "PlusD", "id":"7"}];        
    "#DDB0BF", "name": "Complex", "id":"2"},
    "#BF0CB9", "name": "Village", "id":"5"},
    "#FFFFFF", "name": "Limbo", "id":"0"},
*/  


var roomPos = [ {
    cx: 138,
    cy: 145,
    r: 127.5,
    id: "Dome"
}, {
    cx: 642,
    cy: 155,
    r: 123.5,
    id: "Hall"
}, {
    cx: 693,
    cy: 436,
    r: 113,
    id: "Planta"
}, {
    cx: 509,
    cy: 679,
    r: 140.5,
    id: "PlusD"
}, {
    cx: 148,
    cy: 576,
    r: 119.5,
    id: "Complex"
}, {
    cx: 387,
    cy: 359,
    r: 205,
    id: "Village"
}];
    
roomColors = [ "#DB57D0", "#09AE48", "#7ED96D", "#B9DBA2", "#DDB0BF", "#BF0CB9", "#FFFFFF",  "#FFFFFF"];

OSColors = ["#de840a","#b9b909","#0924b9"];

signalColors = ["hsl(60, 100%, 20%)","hsl(45, 100%, 27%)","hsl(30, 100%, 33%)","hsl(15, 100%, 40%)",];

MACS = [
        "00:13:EF:C0:09:FD",
        "00:13:EF:CA:0C:53",
        "00:13:EF:C7:10:5B",
        "00:13:EF:C7:0E:EA",
        "48:5D:60:D2:03:A2"
        ];

RoomRecords = [
/*,
          {name: "Village",time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C0:09:FD"},
          {name: "Dome",   time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:CA:0C:53"},
          {name: "Hall",   time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C7:10:5B"},
          {name: "Planta", time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"00:13:EF:C7:0E:EA"},
          {name: "PlusD",  time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"48:5D:60:D2:03:A2"},
          {name: "Complex",time_start: new Date("2015-06-11 14:09:59"), time_end: new Date("2015-06-12 14:14:59"), MAC:"de:de:de:de:de:14"}
];
*/

          {name: "Village",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:00"},
          {name: "Village",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:01"},
          {name: "Village",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:02"},
          {name: "Village",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:06"},
    
    
          {name: "Dome",   time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:03"}, 
          {name: "Dome",   time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:05"},

          {name: "PlusD",  time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:04"},
          {name: "PlusD",  time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:12"},
          {name: "PlusD",  time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:09"},

          {name: "Hall",  time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:10"},
          {name: "Hall",   time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:07"},
          {name: "Hall",   time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:13"},   
    
          {name: "Planta", time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:08"},

          {name: "Complex",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:11"},
          {name: "Complex",time_start: new Date("2015-06-07 13:25:01"), time_end: new Date("2015-06-30 15:55:00"), MAC:"de:de:de:de:de:14"}
];


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



