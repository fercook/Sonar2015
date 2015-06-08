/**
 * Fernando Cucchietti 2015
 * Based on the original code of
 * Wind map code (c) 2012
 * Fernanda Viegas & Martin Wattenberg
 */




// please don't hate on this code too much.
// it's late and i'm tired.
/*
var MotionDetails = function(div, callout, field, projection, animator) {
    $(callout).fadeOut();
    var moveTime = +new Date();
    var calloutOK = false;
    var currentlyShowing = false;
    var calloutX = 0;
    var calloutY = 0;
    var calloutHTML = '';
    var lastX = 0;
    var lastY = 0;

    function format(x) {
        x = Math.round(x * 10) / 10;
        var a1 = ~~x;
        var a2 = (~~(x * 10)) % 10;
        return a1 + '.' + a2;
  }

  function minutes(x) {
        x = Math.round(x * 60) / 60;
        var degrees = ~~x;
        var m = ~~((x - degrees) * 60);
        return degrees + '&deg;&nbsp;' + (m == 0 ? '00' : m < 10 ? '0' + m : '' + m) + "'";
    }

    $(div).mouseleave(function() {
        moveTime = +new Date();
        calloutOK = false;
    });

    var pos = $(div).position();

    $(div).mousemove(function(e) {

        // TODO: REMOVE MAGIC CONSTANTS
        var x = e.pageX - this.offsetLeft - 60;
      var y = e.pageY - this.offsetTop - 10;
        if (x == lastX && y == lastY) {
            return;
        }
        lastX = x;
        lastY = y;
        moveTime = +new Date();
        var scale = animator.scale;
        var dx = animator.dx;
        var dy = animator.dy;
        var mx = (x - dx) / scale;
        var my = (y - dy) / scale;
        var location = projection.invert(mx, my);
        var lat = location.y;
        var lon = location.x;
        var speed = 0;
        if (field.inBounds(lon, lat)) {
          speed = field.getValue(lon, lat).length() / 1.15;
      }
        calloutOK = !!speed;
        calloutHTML = '<div style="padding-bottom:5px"><b>' +
                      format(speed)  + ' mph</b> wind speed<br></div>' +
                      minutes(lat) + ' N, ' +
                      minutes(-lon) + ' W<br>' +
                                    'click to zoom';

        calloutY = (pos.top + y) + 'px';
        calloutX = (pos.left + x + 20) + 'px';
    });

    setInterval(function() {
        var timeSinceMove = +new Date() - moveTime;
        if (timeSinceMove > 200 && calloutOK) {
            if (!currentlyShowing) {
            callout.innerHTML = calloutHTML;
                callout.style.left = calloutX;
                callout.style.top = calloutY;
                callout.style.visibility = 'visible';
                $(callout).fadeTo(400, 1);
                currentlyShowing = true;
            }
        } else if (currentlyShowing) {
          $(callout).fadeOut('fast');
            currentlyShowing = false;
        }
    }, 50);
};
*/


var mapAnimator;
var legendSpeeds = [1, 3, 5, 10, 15, 30];
var legendSpeeds = [1, 3, 5, 10, 15, 30];

var MapMask = function(image, width, height) {
    this.image = image;
    this.width = width;
    this.height = height;
};

MapMask.prototype.endMove = function(animator) {
    this.move(animator);
}

MapMask.prototype.move = function(animator) {
    var s = this.image.style;
    s.width = ~~(animator.scale * this.width) + 'px';
    s.height = ~~(animator.scale * this.height) + 'px';
    s.left = animator.dx + 'px';
    s.top = animator.dy + 'px';
};

function isAnimating() {
    return document.getElementById('animating').checked;
}


function doUnzoom() {
    mapAnimator.unzoom();
}

function format(x) {
    x = Math.round(x * 10) / 10;
    var a1 = ~~x;
    var a2 = (~~(x * 10)) % 10;
    return a1 + '.' + a2;
}

function init() {
    loading = false;

    var canvas = document.getElementById('display');

    //var field =  VectorField.read(windData, true);
    bounds = {x0:0, y0:0, x1:canvas.width, y1:canvas.height};
    centers=[new Vector(canvas.width/2, canvas.height/2)];
    params = {radius:0, width:20, 
              center: new Vector(canvas.width/3, 0.2*canvas.height/2)};
    //field = VectorField.circle(50,bounds,params);
    c1 = [ new Vector(0,0), new Vector(200,400),new Vector(600,200), new Vector(800,300) ];
    field = VectorField.curve(50,bounds,c1,params);
    //var imageCanvas = document.getElementById('image-canvas');
    var isMacFF = navigator.platform.indexOf('Mac') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinFF = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('Firefox') != -1;
    var isWinIE = navigator.platform.indexOf('Win') != -1 &&
                  navigator.userAgent.indexOf('MSIE') != -1;
    var numParticles = isMacFF || isWinIE ? 3500 : 3500; // slowwwww browsers
    //var display = new MotionDisplay(canvas, imageCanvas, field, numParticles, mapProjection);
    var display = new MotionDisplay(canvas, null, field, numParticles);

  // IE & FF Windows do weird stuff with very low alpha.
  if (isWinFF || isWinIE) {
        display.setAlpha(.05);
    }

    mapAnimator = new Animator(null, isAnimating);
    mapAnimator.add(display);

    //var mask = new MapMask(document.getElementById('mask'), 900, 600);
    //mapAnimator.add(mask);

    var callout = document.getElementById('callout');

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
    mapAnimator.start(40);

}
