function createCurves(canvasBounds) {
    var RELATIVE_SIZE_OF_CIRCLES = 0.5;
    var DOOR_OPENING = 5 * Math.PI / 180; // degrees
    var salas = [
        {
            name: "Dome",
            centrex: 313,
            centrey: 381,
            radius: 228,
            doorx: 377,
            doory: 478
        },
        {
            name: "Village1",
            centrex: 453,
            centrey: 591,
            radius: 286,
            doorx: null,
            doory: null,
            from: {
                Dome: 2,
                Complex: 3,
                SonarplusD: 0,
                Planta: 1,
                Hall: 1,
                Village2: 1
            },
            to: {
                Dome: 1,
                Complex: 2,
                SonarplusD: 3,
                Planta: 3,
                Hall: 0,
                Village2: 3
            },
        },
        {
            name: "Village2",
            centrex: 624,
            centrey: 591,
            radius: 286,
            doorx: null,
            doory: null,
            from: {
                Dome: 2,
                Complex: 3,
                SonarplusD: 0,
                Planta: 1,
                Hall: 1,
                Village2: 3
            },
            to: {
                Dome: 1,
                Complex: 2,
                SonarplusD: 2,
                Planta: 3,
                Hall: 0,
                Village2: 1
            },

        }, {
            name: "Complex",
            centrex: 333,
            centrey: 814,
            radius: 228,
            doorx: 384,
            doory: 713
        }, {
            name: "SonarplusD",
            centrex: 668,
            centrey: 891,
            radius: 322,
            doorx: 628,
            doory: 740
        }, {
            name: "Planta",
            centrex: 855,
            centrey: 656,
            radius: 178,
            doorx: 771,
            doory: 626
        }, {
            name: "Hall",
            centrex: 808,
            centrey: 391,
            radius: 256,
            doorx: 722,
            doory: 486
        }];

    var fields = [];
    var log = [];
    for (var sin = 0; sin < salas.length; sin++) {
        var salain = salas[sin];
        var r = salain.radius/2,
            x = salain.centrex,
            y = salain.centrey,
            px = salain.doorx,
            py = salain.doory;
        var bounds = {
            x0: x - r,
            y0: y - r,
            x1: x + r,
            y1: y + r
        };
        var paramsCircle = {
            radius: 0.1*r * RELATIVE_SIZE_OF_CIRCLES,
            width: 0.5*r * RELATIVE_SIZE_OF_CIRCLES,
            center: new Vector(x, y)
        };
        var paramsLine = {
            radius: 0,
            width: 10,
            center: new Vector(x, y)
        };

        fields.push(VectorField.circle(100, canvasBounds, paramsCircle)); // Create this room circle
        log.push({ in : salain.name,
            out: salain.name
        });
        var cur;
        for (var sout = 0; sout < salas.length; sout++) {
            if (sin != sout && sin == 0) {
                var salaout = salas[sout];
                var r_o = salaout.radius/2,
                    x_o = salaout.centrex,
                    y_o = salaout.centrey,
                    px_o = salaout.doorx,
                    py_o = salaout.doory;
                if (salaout.doorx && salain.doorx) { //Normal rooms
                    var doorout = new Vector(px_o, py_o),
                        doorin = new Vector(px, py),
                        cin = new Vector(x, y),
                        cout = new Vector(x_o, y_o);
                    // trig stuff to compute the correct entries
                    var Rin = doorin.minus(cin);
                    var thetain = Rin.getAngle();
                    var Rout = doorout.minus(cout);
                    var thetaout = Rout.getAngle();
                    var alphain = thetain + Math.PI / 2 - Math.asin(1.0 / r);
                    var alphaout = thetaout - Math.PI / 2 + Math.asin(1.0 / r_o);
                    var entryin = cin.plus(Rin.rotate(DOOR_OPENING));
                    var entryout = cout.plus(Rout.rotate(-DOOR_OPENING));
                    // Finally write the path
                    var p1 = cout.plus(Vector.polar(r_o/2, alphaout));
                    var p2 = p1.plus(doorout).mult(0.5);
                    var p6 = cin.plus(Vector.polar(r/2, alphain));
                    var p5 = p6.plus(doorin).mult(0.5);
                    //cur = [p1, p2, entryout, entryin, p5, p6];
                    cur = [p1, entryout, entryin, p6];
                } else if (salaout.doorx && !salain.doorx) { //Entering the village
                    var doorout = new Vector(px_o, py_o),
                        cin = new Vector(x, y),
                        cout = new Vector(x_o, y_o);
                    // trig stuff to compute the correct entries                        
                    var entryin = cin.plus(Vector.polar(r/2, salain.from[salaout.name] * Math.PI / 2));
                    var Rout = doorout.minus(cout);
                    var thetaout = Rout.getAngle();
                    var alphaout = thetaout - Math.PI / 2 + Math.asin(1.0 / r_o);
                    var entryout = cout.plus(Rout.rotate(-DOOR_OPENING));
                    // Finally write the path
                    var p1 = cout.plus(Vector.polar(r_o/2, alphaout));
                    var p2 = p1.plus(doorout).mult(0.5);
                    //cur = [p1, p2, entryout, entryin];
                    cur = [p1, entryout, entryin];
                } else if (!salaout.doorx && salain.doorx) { //Leaving the village
                    var doorin = new Vector(px, py),
                        cin = new Vector(x, y),
                        cout = new Vector(x_o, y_o);
                    // trig stuff to compute the correct entries
                    var Rin = doorin.minus(cin);
                    var thetain = Rin.getAngle();
                    var alphain = thetain + Math.PI / 2 - Math.asin(1.0 / r);
                    var entryin = cin.plus(Rin.rotate(DOOR_OPENING));
                    var entryout = cout.plus(Vector.polar(r_o/2, salaout.to[salain.name] * Math.PI / 2));
                    // Finally write the path
                    var p4 = cin.plus(Vector.polar(r/2, alphain));
                    var p3 = p4.plus(doorin).mult(0.5);
                    //cur = [entryout, entryin, p3, p4];
                    cur = [entryout, entryin, p4];
                } else { //Moving through the village
                    var cin = new Vector(x, y),
                        cout = new Vector(x_o, y_o);
                    // trig stuff to compute the correct entries
                    var entryin = cin.plus(Vector.polar(r/2, salain.from[salaout.name] * Math.PI / 2));
                    var entryout = cout.plus(Vector.polar(r_o/2, salaout.to[salain.name] * Math.PI / 2));
                    var p2 = entryin.plus(entryout).mult(0.5);
                    cur = [entryout, p2, entryin];
                }
                fields.push(VectorField.curve(99, canvasBounds, cur, paramsLine));
                log.push({ in : salain.name,
                    out: salaout.name,
                    cur: cur
                });
            }
        }
        //return fields;
     

    }
    algo = log;
    console.log(log);
    return fields;
}