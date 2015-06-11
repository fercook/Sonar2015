/**
 * Fernando Cucchietti 2015
 * Based on the original code of
 * Wind map code (c) 2012
 * Fernanda Viegas & Martin Wattenberg
 */


var mapAnimator;

function isAnimating() {
    return document.getElementById('animating').checked;
}

function format(x) {
    x = Math.round(x * 10) / 10;
    var a1 = ~~x;
    var a2 = (~~(x * 10)) % 10;
    return a1 + '.' + a2;
}

function init() {

    //var imageCanvas = document.getElementById('image-canvas');
    var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinFF = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinIE = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('MSIE') != -1;
    var isLinFF = navigator.platform.indexOf('Lin') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;

    loading = false;

    var canvas = document.getElementById('display');
    var contxt = canvas.getContext('2d');

    // Canvas image clip does not work
//        var clip_image = new Image();
//    clip_image.src = "imgs/now_clip.png";
//   contxt.drawImage(clip_image,0,0,canvas.width,canvas.height);
//    contxt.globalCompositeOperation="source-in";

    /*
    contxt.moveTo(25,25);
        contxt.arc(0,0,160,0,Math.PI*2,true);
    contxt.lineTo(200,200);
    contxt.lineTo(30,190);
            contxt.clip();
*/
    // Create a clipping path for freaking Firefox
    if (false || isMacFF || isWinFF) {
        function p2(x) { return Math.pow(x,2); }

        function findEntryPoints(centralCircle,lateralCircle) { // Find the crossing points of two circles
            var x1 = centralCircle.cx, x2 = lateralCircle.cx;
            var y1 = centralCircle.cy, y2 = lateralCircle.cy;
            var r1 = centralCircle.r, r2 = lateralCircle.r;
            var first,second;
            var A = - (x1-x2) / (y1-y2) ;
            var B = (- ( p2(r1)-p2(r2)) + ( p2(x1) - p2(x2)) + ( p2(y1) - p2(y2)) )/ (2*(y1-y2));
            var a = p2(A)+1;
            var b = (2*A*(B-y1)-2*x1);
            var c = p2(x1) + p2(B-y1) - p2(r1);

            var xp = (-b + Math.sqrt(p2(b)-4*a*c))/(2*a);
            var xm = (-b - Math.sqrt(p2(b)-4*a*c))/(2*a);
            var yp = xp * A + B;
            var ym = xm * A + B;
            // We detect which one goes first by the sign of the cross product
            var crossp = (xp-x1)*(y2-y1)-(yp-y1)*(x2-x1);
            if (crossp <=0 ) {
                first = [xm,ym];
                second = [xp,yp];
            } else {
                first = [xp,yp];
                second = [xm,ym];
            }
            return [first,second];
        }

          var roomPos = [
          {cx:387, cy:359, r:205,   id: "Village"},
          {cx:138, cy:145, r:127.5, id: "Dome"},
          {cx:642, cy:155, r:123.5, id: "Hall"},
          {cx:693, cy:436, r:113  , id: "Planta"},
          {cx:509, cy:679, r:140.5, id: "PlusD"},
          {cx:148, cy:576, r:119.5, id: "Complex"}
          ];

        contxt.beginPath();
        // Find the crossings of the first room
        var entryPoints = findEntryPoints(roomPos[0],roomPos[1]);
        var startingPoint = entryPoints[0];
        var center = new Vector(roomPos[0].cx,roomPos[0].cy);
        contxt.moveTo(entryPoints[0][0],entryPoints[0][1]);
        for (var i=1;i<-1;i++){
            //Find the midpoint of the circle
            var D = new Vector(roomPos[i].cx-roomPos[0].cx,roomPos[i].cy-roomPos[0].cy);
            var R = D.setLength(roomPos[i].r);
            var midPoint = center.plus(D.plus(R));
            // Draw until the midpoint and then until the other entrypoint
            contxt.arcTo(entryPoints[0][0],entryPoints[0][1],midPoint.x,midPoint.y,roomPos[i].r);
            contxt.arcTo(midPoint.x,midPoint.y,entryPoints[1][0],entryPoints[1][1],roomPos[i].r);
            // Now draw the arc connecting the rooms
            var iniPoint = entryPoints[1];
            if (i<5)  {entryPoints = findEntryPoints(roomPos[0],roomPos[i+1]);}
            else {entryPoints = [startingPoint];} // We close the figure
            contxt.arcTo(iniPoint[0],iniPoint[1],entryPoints[0][0],entryPoints[0][1],roomPos[0].r);
        }
        contxt.clip();
    }
/**/


    var bak_image = new Image();
    bak_image.src = "imgs/outlines_clipped.png";
    contxt.drawImage(bak_image,0,0,canvas.width,canvas.height);

    bounds = {x0:0, y0:0, x1:canvas.width, y1:canvas.height};

    params = {radius:0, width:10,
              center: new Vector(canvas.width/3, 0.2*canvas.height/2)};

    var numParticles = isMacFF || isWinIE ? 10000 : 10000; // slowwwww browsers

    //var field =  VectorField.read(windData, true);
    //field = VectorField.circle(50,bounds,params);
    mapAnimator = new Animator(null, isAnimating);


$.ajax("http://visualization-case.bsc.es/getJson.jsp?box_mac="+BOX_MAC+"&callback=?",
        {dataType:"jsonp", crossDomain: true})
        .done(function( data ) {
            ...blablabla...
            }
        });

    var jjj = VectorField.gridFromNormals(
        {x0:400,y0:300,x1:1500,y1:800},
        //["imgs/domeToHall_stroke.png"],
        ["imgs/normal_clipped.png"],
        //["../imgs/map_torbellinos.png"],
        {width:819, height:837},
        function(f){
                //f.aggregateSpeeds(intensityGraph);
                var color = [1,1,1];
                var display = new MotionDisplay(canvas, bak_image, f, numParticles, color);
                mapAnimator.add(display);
                mapAnimator.start(40);
        } );


}

    /*
    fields = createCurves(bounds);
    console.log("HEcho");
    fields.forEach(function (field) {
        var color = [1,1,1]; //[0.5+0.5*Math.random(),0.5+0.5*Math.random() ,0.5+0.5*Math.random() ];
        //field.maxLength = 50*Math.random();
        var display = new MotionDisplay(canvas, bak_image, field, numParticles, color);
        mapAnimator.add(display);
    });
*/


/*
    for (var n=0;n<10;n++){
        var curs = [];
        for (var p=0;p<10;p++){ curs.push( new Vector(canvas.width*Math.random(),canvas.height*Math.random()) ); }
        var field = VectorField.curve(100,bounds,curs,params);
        var color = [0.5+0.5*Math.random(),0.5+0.5*Math.random() ,0.5+0.5*Math.random() ];
        var display = new MotionDisplay(canvas, bak_image, field, numParticles, color);
        mapAnimator.add(display);
    }
*/
/*
    c1 = [ new Vector(0,0), new Vector(200,400),new Vector(600,200), new Vector(800,300) ];
    field = VectorField.curve(100,bounds,c1,params);

    c2 = [ new Vector(200,500), new Vector(70,250),new Vector(450,400), new Vector(400,600) ];
    field2 = VectorField.curve(100,bounds,c2,params);


    //var display = new MotionDisplay(canvas, imageCanvas, field, numParticles, mapProjection);
    var display = new MotionDisplay(canvas, bak_image, field, numParticles, [1,1,1]);
    var display2 = new MotionDisplay(canvas, bak_image, field2, numParticles, [0.95,0.8,0.6]);

  // IE & FF Windows do weird stuff with very low alpha.
  if (isWinFF || isWinIE) {
        display.setAlpha(.05);
    }

    mapAnimator.add(display);
    mapAnimator.add(display2);
*/
    //var mask = new MapMask(document.getElementById('mask'), 900, 600);
    //mapAnimator.add(mask);

   // var callout = document.getElementById('callout');

/*
  var legendAnimator = new Animator(null, isAnimating);

  // Scale for speed.
    // Numerator comes from size of map.
    // Denominator is knots vs. mph.
  var speedScaleFactor = 20 / 1.15;
    for (var i = 1; i <= legendSpeeds.length; i++) {
        var c = document.getElementById('legend' + i);
        var legendField = VectorField.constant(
            legendSpeeds[i - 1] * speedScaleFactor, 0, 0, 0, c.width, c.height);
        var legend = new MotionDisplay(c, null, legendField, 30);
        // normalize so colors correspond to wind map's maximum length!
        legend.maxLength = field.maxLength * speedScaleFactor;
        legendAnimator.add(legend);
    }
    legendAnimator.start(40);
    */

