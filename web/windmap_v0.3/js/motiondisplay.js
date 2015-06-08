
/**
 * Displays a geographic vector field using moving particles.
 * Positions in the field are drawn onscreen using the Alber
 * "Projection" file.
 */



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
var MotionDisplay = function(canvas, imageCanvas, field, numParticles, color_mult, opt_projection) {
    this.canvas = canvas;
  this.projection = opt_projection || IDProjection;
  this.field = field;
    this.numParticles = numParticles;
    this.first = true;
    this.maxLength = field.maxLength;
    this.speedScale = 0.2;
    this.renderState = 'normal';
    this.backgroundImage = imageCanvas;
    this.imageCanvas = imageCanvas;
    this.x0 = this.field.x0;
    this.x1 = this.field.x1;
    this.y0 = this.field.y0;
    this.y1 = this.field.y1;
    this.makeNewParticles(null, true);
    this.colors = [];
    this.rgb = '100, 0, 0';
    this.background = 'rgb(' + this.rgb + ')';
    this.backgroundAlpha = 'rgba(' + this.rgb + ', 0.02)';
    this.outsideColor = '#fff';
    for (var i = 0; i < 256; i++) {
        this.colors[i] = 'rgb(' + Math.floor(i*color_mult[0]) + ',' + Math.floor(i*color_mult[1]) + ',' + Math.floor(i*color_mult[2]) +')';
    }
    if (this.projection) {
      this.startOffsetX = this.projection.offsetX;
      this.startOffsetY = this.projection.offsetY;
      this.startScale = this.projection.scale;
  }
};


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
    var dx = animator ? animator.dx : 0;
    var dy = animator ? animator.dy : 0;
    var scale = animator ? animator.scale : 1;
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
            var p = new Particle(u, v, 1 + 40 * Math.random());
            p.x = pos.x; p.y = pos.y;
            return p;
        }
        var m = vel.length() / this.field.maxLength;
        // The random factor here is designed to ensure that
        // more particles are placed in slower areas; this makes the
        // overall distribution appear more even.
        if ((vel.x || vel.y) && (++safecount > 10 || Math.random() > m * .3)) { // HAD TO CHANGE THIS MAGIC NUMBER TO A LOWER THRESHOLD
            //if (++safecount > 10 || !(x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height)) {
            var p = new Particle(u, v, 1 + 40 * Math.random());
            p.x = pos.x; p.y = pos.y;
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
        g.drawImage(this.backgroundImage,0,0,w,h);
        g.globalAlpha=1.0;
        this.first = false;
    } else {
        g.globalAlpha=0.1;
    }
    g.drawImage(this.backgroundImage,0,0,w,h);
    g.globalAlpha=1.0;
    //this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
    this.moveThings(animator);
    this.draw(animator);
}


mierda=0;
MotionDisplay.prototype.moveThings = function(animator) {
    var speed = .01 * this.speedScale ; /// animator.scale;
    var a = new Vector(0,0),pos=new Vector(0,0);
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (p.age > 0 && this.field.inBounds(p.x, p.y)) {
          var vel = this.field.getValue(p.u, p.v,a,pos);
            p.u += speed * a.x;
            p.v += speed * a.y;
//          var pos = this.field.getPos(p.u, p.v);
            p.x = pos.x;
            p.y = pos.y;
            p.age--;
        } else {
            this.particles[i] = this.makeParticle(animator);
        }
    }
    mierda++;
    if (mierda>1000) {ghghga();}
};


MotionDisplay.prototype.draw = function(animator) {
    var g = this.canvas.getContext('2d');
    var w = this.canvas.width;
    var h = this.canvas.height;
    var dx = animator.dx;
    var dy = animator.dy;
    var scale = 1; //animator.scale;

    //g.fillRect(dx, dy, w * scale,h * scale);

//    g.drawImage(this.backgroundImage,0,0);
//    g.globalAlpha=1.0;
    var val = new Vector(0, 0);
    g.lineWidth = .75;
    for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (!this.field.inBounds(p.x, p.y)) {
            p.age = -2;
            continue;
        }
        if (p.oldX != -1) { // TODO Optimize away this if
            var wind = this.field.getValue(p.u, p.v);
            var s = wind.length() / this.maxLength;
            var c = 90 + Math.round(350 * s); // was 400
            if (c > 255) {
                c = 255;
            }
            g.strokeStyle = this.colors[c];
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(p.oldX, p.oldY);
            g.stroke();
      }
        p.oldX = p.x;
        p.oldY = p.y;
    }
};


/// Zooming and stuff, still don't need it

MotionDisplay.prototype.startMove = function(animator) {
    // Save screen.
    this.imageCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
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
    g.drawImage(this.imageCanvas, dx, dy, z * w, z * h);
};
