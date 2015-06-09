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

    var bak_image = new Image();
    bak_image.src = "imgs/map_now.jpg";
    
    //var imageCanvas = document.getElementById('image-canvas');
    var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinFF = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinIE = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('MSIE') != -1;

    loading = false;

    var canvas = document.getElementById('display');
    var contxt = canvas.getContext('2d');
    contxt.drawImage(bak_image,0,0,canvas.width,canvas.height);
    
    bounds = {x0:0, y0:0, x1:canvas.width, y1:canvas.height};

    params = {radius:0, width:10,
              center: new Vector(canvas.width/3, 0.2*canvas.height/2)};

    var numParticles = isMacFF || isWinIE ? 500 : 500; // slowwwww browsers

    //var field =  VectorField.read(windData, true);
    //field = VectorField.circle(50,bounds,params);
    mapAnimator = new Animator(null, isAnimating);
    console.log("Prepare curves");
    
    var caca = new Vector(1242,494);
    var jjj = VectorField.gridFromImages(
        {x0:0,y0:0,x1:1920,y1:1200}, 
        ["imgs/domeToHall_stroke.png"], 
        {width:1920, height:1200}, 
        caca, -1, function(f){
                var color = [1,1,1];
                var display = new MotionDisplay(canvas, bak_image, f, numParticles, color);
                mapAnimator.add(display);
                mapAnimator.start(40);
        } );

    
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


}

