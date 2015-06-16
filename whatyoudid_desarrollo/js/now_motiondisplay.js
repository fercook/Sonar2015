/* Color manipulation
 *
 */

function generateScale(color_mult) {
    var scale = [];
    var s=1.0/255;
//    console.log(color_mult);
    for (var i = 0; i < 256; i++) {
        //this.colors[i] = 'rgba(' + Math.floor(i) + ',' + Math.floor(i) + ',' + Math.floor(i) + ',' + Math.floor(255-i) +')';
        //this.colors[ik][i] = 'rgb(' + Math.floor(i) + ',' + Math.floor(i) + ',' + Math.floor(i)  +')';
        //scale[i] = 'rgba('+ Math.floor(i*color_mult[0]*s) + ',' + Math.floor(i*color_mult[1]*s) + ',' + Math.floor(i*color_mult[2]*s) + ',' + (i) +')';
        scale[i] = 'rgb('+ Math.floor(i*color_mult.r*s) + ',' + Math.floor(i*color_mult.g*s) + ',' + Math.floor(i*color_mult.b*s) +')';
    };
    return scale;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale The scale factor for the projection.
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {number} longMin
 * @param {number} latMin
 * @param {VectorField} field
 * @param {number} numParticles
 */
var MotionDisplay = function(canvas, imageCanvas, field, numParticles, colorScales, opt_projection) {
    this.canvas = canvas;
    this.projection = opt_projection || IDProjection;
    this.field = field;
    this.numParticles = numParticles;
    this.first = true;
    this.maxLength = field.maxLength;
    this.speedScale = 2;
    this.renderState = 'normal';
    this.backgroundImage = imageCanvas;
    this.x0 = this.field.x0;
    this.x1 = this.field.x1;
    this.y0 = this.field.y0;
    this.y1 = this.field.y1;
    this.rgb = '0, 0, 0';
    this.background = 'rgb(' + this.rgb + ')';
    this.alpha = 0.05;
    this.backgroundAlpha = 'rgba(' + this.rgb + ','+this.alpha+')';
    this.outsideColor = '#fff';
    this.currentColorScale = 0;
    this.colors = [];
    this.colors[0] = generateScale(d3.rgb("#FFFFFF")); // Default scale
    if (colorScales) {
        //colorScales = {positions: roomPos, categories: categories, colors: roomColors};
        this.colorScales = colorScales;
//            this.colors[ik]=generateScale( hextoRGB(color) );
    } else {
        this.colorScales = null;
        this.setColorScale = function(num) {
            return true;
        }
    }
    this.makeNewParticles(null, true);
};

MotionDisplay.prototype.setColorScale = function(scaleidx) {
    if (this.colorScales) {
        if (scaleidx<this.colorScales.colorSets.length){
            this.colors = [];
            for (var cidx=0; cidx < this.colorScales.colorSets[scaleidx].length;cidx++) {
                var color = d3.rgb( this.colorScales.colorSets[scaleidx][cidx] );
                this.colors[cidx] = generateScale(color);
            }
            this.currentColorScale = scaleidx;
            for (var i = 0; i < this.particles.length; i++) {
                //reassign all particles to new scales
                var p = this.particles[i];
                if (scaleidx>0) { p.scale = this.findScale(p.x,p.y);}
                else { p.scale = 0; }
            }

        }
    }
}

MotionDisplay.prototype.showOnlyCommunication = function() {
    if (this.field.oldMagnitudes) {
        this.field.magnitudes = this.field.oldMagnitudes;
        this.field.aggregateSpeeds(this.field.magnitudes);
        this.field.oldMagnitudes=null;
    }
    else {
        this.field.oldMagnitudes=this.field.magnitudes;
        this.field.magnitudes = this.field.magnitudes.map(function(num,i){return i%3==0? 0:num;});
        this.field.aggregateSpeeds(this.field.magnitudes);
    } 
}


MotionDisplay.prototype.findScale = function(x,y) {
     // First we must find room information
    var circle = -1;
    for (var ridx=0;ridx<this.colorScales.positions.length && circle<0;ridx++){ // First we must find what circle we are in
        var dx = x-this.colorScales.positions[ridx].cx;
        var dy = y-this.colorScales.positions[ridx].cy;
        var r = this.colorScales.positions[ridx].r;
        if ( dx*dx+dy*dy <= r*r ) { circle = ridx; }
    }
    if (circle >= 0) {
        var cat = Math.random(); // Now we randomly select a category inside this circle
        if (cat <= this.colorScales.categories[this.currentColorScale][circle][0]) {
        } else {
            for (var catidx=1; catidx<this.colorScales.categories[this.currentColorScale][circle].length; catidx++) {
                if (cat>=this.colorScales.categories[this.currentColorScale][circle][catidx-1]
                &&  cat<=this.colorScales.categories[this.currentColorScale][circle][catidx] )
                        { return catidx;}
            }
        }
    }
    return -1;
}


MotionDisplay.prototype.setAlpha = function(alpha) {
    this.backgroundAlpha = 'rgba(' + this.rgb + ', ' + alpha + ')';
};

MotionDisplay.prototype.makeNewParticles = function(animator) {
    this.particles = [];
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.push(this.makeParticle(animator));
    }
};


MotionDisplay.prototype.makeParticle = function(animator) {
    var safecount = 0;

    for (;;) {
        var a = Math.random();
        var b = Math.random();
        var u = a;
        var v = b;
        var vel = this.field.getValue(u, v);
        var pos = this.field.getPos(u, v);
        var x = pos.x, y = pos.y;
        if (this.field.maxLength == 0) { // safeguard??
            var p = new Particle(u, v, 1 + 100 * Math.random());
            p.x = p.oldX = pos.x; p.y = p.oldY = pos.y;
            return p;
        }
        var m = vel.length() / this.field.maxLength;
        // The random factor here is designed to ensure that
        // more particles are placed in slower areas; this makes the
        // overall distribution appear more even. // DONT KNOW IF THIS WORKS REALLY WELL...
        if ((vel.x || vel.y) && (++safecount > 10 || Math.random() > m * .3)) { // HAD TO CHANGE THIS MAGIC NUMBER TO A LOWER THRESHOLD
            //if (++safecount > 10 || !(x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height)) {
            var p = new Particle(u, v, 1 + 100 * Math.random());
            p.x = p.oldX = pos.x; p.y = p.oldY = pos.y;
            p.scale = -1;
            if (this.currentColorScale != 0) {
                p.scale = this.findScale(p.x,p.y);
            } else { p.scale = 0;}
            return p;
      //}
        }
    }
};


MotionDisplay.prototype.animate = function(animator) {
    var g = this.canvas.getContext('2d');
    var w = this.canvas.width;
    var h = this.canvas.height;
    //g.globalCompositeOperation = "xor";
    if (this.first) {
        if (this.backgroundImage)  {
            g.drawImage(this.backgroundImage,0,0,w,h);
            g.globalAlpha=1.0;
        }
        else {
            g.fillStyle = this.background;
            g.fillRect(0,0,w,h);
        }
        this.first = false;
    } else {
        if (this.backgroundImage)  {
//            g.fillStyle = this.backgroundAlpha;
//            g.fillRect(0,0,w,h);
            g.globalAlpha=this.alpha;
            g.drawImage(this.backgroundImage,0,0,w,h);
            g.globalAlpha=1.0;
        }
        else {
            g.fillStyle = this.backgroundAlpha;
            g.fillRect(0,0,w,h);
        }
    }
    this.moveThings(animator);
    this.draw(animator);
    this.filter("overlay");
}


//mierda=0;
MotionDisplay.prototype.moveThings = function(animator) {
    var speed = .005 * this.speedScale ; /// animator.scale;
    var vel = new Vector(0,0),pos=new Vector(0,0);
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (p.age > 0 && this.field.inBounds(p.u, p.v)) {
          var a = this.field.getValue(p.u, p.v);
            p.u += speed * a.x;
            p.v += speed * a.y;
          var pos = this.field.getPos(p.u, p.v);
            p.x = pos.x;
            p.y = pos.y;
            p.age--;
        } else {
            this.particles[i] = this.makeParticle(animator);
        }
    }
    //mierda++;
    //if (mierda>1000) {ghghga();}
};


MotionDisplay.prototype.draw = function(animator) {
    var g = this.canvas.getContext('2d');
    var w = this.canvas.width;
    var h = this.canvas.height;
    //g.fillRect(dx, dy, w * scale,h * scale);

//    g.drawImage(this.backgroundImage,0,0);
//    g.globalAlpha=1.0;
    var val = new Vector(0, 0);
    g.lineWidth = .75;
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (!this.field.inBounds(p.u, p.v)) {
            p.age = -2;
            continue;
        }
        if (p.oldX != -1) { // TODO Optimize away this if
            var wind = this.field.getValue(p.u, p.v);
            var s = wind.length() / this.field.maxLength;
            var c = 90 + Math.round(350 * s); // was 400  Math.round(255*s*1.4-10);
            if (c > 255) {
                c = 255;
            }
            if (c < 0) c=0;
            if (p.scale>=0) {
                g.strokeStyle = this.colors[p.scale][c];
                g.beginPath();
                g.moveTo(p.x, p.y);
                g.lineTo(p.oldX, p.oldY);
                g.stroke();
            }
      }
        p.oldX = p.x;
        p.oldY = p.y;
    }
};


/// Filtering

MotionDisplay.prototype.filter = function(filterName){
     var g = this.canvas.getContext('2d');
     var w = this.canvas.width;
     var h = this.canvas.height;

     var data = g.getImageData(0,0,w,h);
    
     for (var xy = 0; xy < h*w; xy++) {
         var d = data.data[xy]/255.0;
         if (d>=0.5) {
             data.data[xy] = Math.floor(255*(1.0-2.0*(1-d)*(1-d)));
//             (1 - (1-2*(d/128.0-0.5)) * (1-d/128.0))
         } else {
             data.data[xy] = Math.floor(255*2*d*d);
         }
     }
}


/// Zooming and stuff, still don't need it

MotionDisplay.prototype.startMove = function(animator) {
    // Save screen.
//    this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
};


MotionDisplay.prototype.endMove  = function(animator) {
    if (animator.scale < 1.1) {
        this.x0 = this.field.x0;
        this.x1 = this.field.x1;
        this.y0 = this.field.y0;
        this.y1 = this.field.y1;
    } else {
        // get new bounds for making new particles.
        var p = this.projection;
        var self = this;
        function invert(x, y) {
            x = (x - animator.dx) / animator.scale;
            y = (y - animator.dy) / animator.scale;
            return self.projection.invert(x, y);
        }
        var loc = invert(0, 0);
        var x0 = loc.x;
        var x1 = loc.x;
        var y0 = loc.y;
        var y1 = loc.y;
        function expand(x, y) {
            var v = invert(x, y);
            x0 = Math.min(v.x, x0);
            x1 = Math.max(v.x, x1);
            y0 = Math.min(v.y, y0);
            y1 = Math.max(v.y, y1);
        }
        // This calculation with "top" is designed to fix a bug
        // where we were missing particles at the top of the
        // screen with north winds. This is a short-term fix,
        // it's dependent on the particular projection and
        // region, and we should figure out a more general
        // solution soon.
        var top = -.2 * this.canvas.height;
        expand(top, this.canvas.height);
        expand(this.canvas.width, top);
        expand(this.canvas.width, this.canvas.height);
        this.x0 = Math.max(this.field.x0, x0);
        this.x1 = Math.min(this.field.x1, x1);
        this.y0 = Math.max(this.field.y0, y0);
        this.y1 = Math.min(this.field.y1, y1);
    }
    tick = 0;
    this.makeNewParticles(animator);
};

MotionDisplay.prototype.move = function(animator) {
    var w = this.canvas.width;
    var h = this.canvas.height;
    var g = this.canvas.getContext('2d');

    g.fillStyle = this.outsideColor;
    var dx = animator.dx;
    var dy = animator.dy;
    var scale = animator.scale;

    g.fillRect(0, 0, w, h);
    g.fillStyle = this.background;
    g.fillRect(dx, dy, w * scale, h * scale);
    var z = animator.relativeZoom();
    var dx = animator.dx - z * animator.dxStart;
    var dy = animator.dy - z * animator.dyStart;
    //g.drawImage(this.imageCanvas, dx, dy, z * w, z * h);
};
