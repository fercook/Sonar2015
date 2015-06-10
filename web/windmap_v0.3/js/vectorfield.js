/**
 * Identity projection.
 */
var IDProjection = {
    project: function(x, y, opt_v) {
        var v = opt_v || new Vector();
        v.x = x;
        v.y = y;
      return v;
  },
    invert: function(x, y, opt_v) {
        var v = opt_v || new Vector();
        v.x = x;
        v.y = y;
      return v;
  }
};

/**
 * Represents a vector field based on an array of data,
 * with specified grid coordinates, using bilinear interpolation
 * for values that don't lie on grid points.
 */

/**
 *
 * @param field 2D array of Vectors
 *
 * next params are corners of region.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
var VectorField = function(field, x0, y0, x1, y1,maxLen) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.field = field;
    this.fields = [];
    this.w = field.length;
    this.h = field[0].length;
    if (maxLen) {
        this.maxLength = maxLen;
    }
    else {
        this.maxLength = 0;
        var mx = 0;
        var my = 0;
        for (var i = 0; i < this.w; i++) {
          for (var j = 0; j < this.h; j++) {
                if (field[i][j].length() > this.maxLength) {
                    mx = i;
                    my = j;
                }
                this.maxLength = Math.max(this.maxLength, field[i][j].length());
            }
        }
        mx = (mx / this.w) * (x1 - x0) + x0;
        my = (my / this.h) * (y1 - y0) + y0;
    }
};

/**
 * Reads data from raw object in form:
 * {
 *   x0: -126.292942,
 *   y0: 23.525552,
 *   x1: -66.922962,
 *   y1: 49.397231,
 *   gridWidth: 501.0,
 *   gridHeight: 219.0,
 *   field: [
 *     0,0,
 *     0,0,
 *     ... (list of vectors)
 *   ]
 * }
 *
 * If the correctForSphere flag is set, we correct for the
 * distortions introduced by an equirectangular projection.
 */
VectorField.read = function(data, correctForSphere) {
    var field = [];
    var w = data.gridWidth;
    var h = data.gridHeight;
    var n = 2 * w * h;
    var i = 0;
    // OK, "total" and "weight"
    // are kludges that you should totally ignore,
    // unless you are interested in the average
    // vector length on vector field over lat/lon domain.
    var total = 0;
    var weight = 0;
    for (var x = 0; x < w; x++) {
        field[x] = [];
        for (var y = 0; y < h; y++) {
            var vx = data.field[i++];
            var vy = data.field[i++];
            var v = new Vector(vx, vy);
            // Uncomment to test a constant field:
            // v = new Vector(10, 0);
            if (correctForSphere) {
                var ux = x / (w - 1);
                var uy = y / (h - 1);
                var lon = data.x0 * (1 - ux) + data.x1 * ux;
                var lat = data.y0 * (1 - uy) + data.y1 * uy;
                var m = Math.PI * lat / 180;
                var length = v.length();
                if (length) {
                total += length * m;
                weight += m;
            }
                v.x /= Math.cos(m);
                v.setLength(length);
            }
            field[x][y] = v;
        }
    }
    var result = new VectorField(field, data.x0, data.y0, data.x1, data.y1);
  //window.console.log('total = ' + total);
    //window.console.log('weight = ' + weight);
  if (total && weight) {

      result.averageLength = total / weight;
    }
    return result;
};


VectorField.gridFromMask = function(bounds, masks, gridSize, center, sign, callback) {

    var field = [];
    var w = gridSize.width;
    var h = gridSize.height;
    var n = 2 * w * h;

    for (var x = 0; x < w; x++) {
        field[x] = [];
        for (var y = 0; y < h; y++) {
            field[x][y] = new Vector(0, 0);
        }
    }

    for (var k=0;k<masks.length;k++) {
        var image = new Image();
        image.src = masks[k];
        image.onload = function() {
            var fakecanvas = document.createElement('canvas');
            fakecanvas.width = image.width;
            fakecanvas.height = image.height;
            var context = fakecanvas.getContext('2d');
            context.drawImage(image, 0, 0 );
            var data = context.getImageData(0,0,image.width,image.height);
            var i = 0;
            console.log("x:"+data.data[w*4/2]+", y:"+data.data[h*4/2]);
            for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                    var v = new Vector(sign*(x-center.x), sign*(y-center.y));
                    //if(data.data[i+=4]*1.0/(255*masks.length)>0.8 && y>1000) { console.log("Exito "+i+", x:"+x+", y:"+y+", v:"+(data.data[i+=4]*1.0/(255*masks.length)));}
                    v.setLength(data.data[i+=4]*1.0/(255*masks.length)); // We get 4 bytes but we only look at R color...
                    //var vx = data.data[i++];
                    //var vy = data.data[i++];
                    //var v = new Vector(vx, vy);
                    field[x][y] = field[x][y].plus(v);
                }
            }
            var result = new VectorField(field, bounds.x0, bounds.y0, bounds.x1, bounds.y1,1.0);
            callback(result);
        }
    }
    return true;
};


VectorField.gridFromNormals = function(bounds, masks, gridSize, callback) {

    var field = [];
    var w = gridSize.width;
    var h = gridSize.height;
    var n = 2 * w * h;

    for (var x = 0; x < w; x++) {
        field[x] = [];
        for (var y = 0; y < h; y++) {
            field[x][y] = new Vector(0, 0);
        }
    }

    for (var k=0;k<masks.length;k++) {
        var image = new Image();
        image.src = masks[k];
        image.onload = function() {
            var fakecanvas = document.createElement('canvas');
            fakecanvas.width = image.width;
            fakecanvas.height = image.height;
            var context = fakecanvas.getContext('2d');
            context.drawImage(image, 0, 0 );
            var data = context.getImageData(0,0,image.width,image.height);
            var i = 0;
            var vel_intensity = 5.0;
            //console.log("x:"+data.data[w*4/2]+", y:"+data.data[h*4/2]);
            for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        var v = new Vector(-vel_intensity*(data.data[i]-128)*1.0/(128*masks.length),vel_intensity*(data.data[i+1]-128)*1.0/(128*masks.length));
                        i+=4;
                    field[x][y] = field[x][y].plus(v);
                }
            }
            var result = new VectorField(field, bounds.x0, bounds.y0, bounds.x1, bounds.y1, 1.0);
            callback(result);
        }
    }
    return true;
};


VectorField.prototype.inBounds = function(u, v) {
  //return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1;
    return u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0;
};


VectorField.prototype.bilinear = function(coord, a, b) {
  var na = Math.floor(a);
  var nb = Math.floor(b);
  var ma = Math.ceil(a);
  var mb = Math.ceil(b);
  var fa = a - na;
  var fb = b - nb;

  return this.field[na][nb][coord] * (1 - fa) * (1 - fb) +
           this.field[ma][nb][coord] * fa * (1 - fb) +
           this.field[na][mb][coord] * (1 - fa) * fb +
           this.field[ma][mb][coord] * fa * fb;
};

// var vel = this.field.getValue(p.u, p.v,a,pos);
VectorField.prototype.getValue = function(u, v, opt_result) {
    var x=u*(this.w-1), y=v*(this.h-1);
    var a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0);
    var b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0);
    var vx = this.bilinear('x', x,y);
    var vy = this.bilinear('y', x,y);
    if (opt_result) {
        opt_result.x = vx;
        opt_result.y = vy;
        return opt_result;
    }
    return new Vector(vx, vy);
};

VectorField.prototype.getPos = function(u, v) {
    return new Vector(u*(this.w-1),v*(this.h-1));
};

VectorField.prototype.getVeloc = function(u, v) {
    return this.getValue(u,v);
};


VectorField.prototype.vectValue = function(vector) {
    return this.getValue(vector.x, vector.y);
};


VectorField.constant = function(dx, dy, x0, y0, x1, y1) {
    var field = new VectorField([[]], x0, y0, x1, y1);
    field.maxLength = Math.sqrt(dx * dx + dy * dy);
    field.getValue = function() {
        return new Vector(dx, dy);
    }
    return field;
}

VectorField.circle = function(maxspeed,bounds,params) {
    var x0=bounds.x0, y0=bounds.y0, x1=bounds.x1, y1=bounds.y1;
    var field = new VectorField([[]], x0, y0, x1, y1);
    field.maxLength = maxspeed;
    field.center = params.center;
    //console.log(params);
    //
    field.getValue = function(u,v, vel) { // returns value of field in real space x-y, vel is velocity in u,v space, pos is x,y
        var r = 2*(u-0.5);
        var intensity = maxspeed*Math.exp(-20*r*r/2.0);
        //var r = 2*Math.PI*(u-0.5);
        //var intensity = Math.cos(r)*Math.cos(r);
        if (intensity<1e-2) {intensity=0};
        if (vel) { vel.x = 0; vel.y = intensity;} // No change in radius u, only angular speed in v

        var xyvel = params.center.plus(Vector.polar(params.innerRadius, params.sense*v*2*Math.PI));
        xyvel.setLength(intensity);
        return xyvel.perpendicular();
    }
    //
    field.getPos = function(u,v) {
        var pos = {x: (params.center.x + (params.innerRadius+2*(u-0.5)*params.width)*Math.cos(params.sense*v*2*Math.PI)),
                   y: (params.center.y + (params.innerRadius+2*(u-0.5)*params.width)*Math.sin(params.sense*v*2*Math.PI))
                 };
        // var pos = params.center.plus(Vector.polar(params.innerRadius+2*(u-0.5)*params.width,params.sense*v*2*Math.PI));
        return pos;
    }
    //
    field.getVeloc = function(u,v) {
        var r = 2*Math.PI*(v-0.5)/params.width;
        //var intensity = maxspeed*Math.exp(-r*r/2.0);
        var intensity = Math.cos(r);
        return new Vector(0,intensity*intensity);
        alert("Code not working");
    }
    //
    return field;
}

VectorField.curve = function(maxspeed,bounds,points,params) {
    var x0=bounds.x0, y0=bounds.y0, x1=bounds.x1, y1=bounds.y1;
    var field = new VectorField([[]], x0, y0, x1, y1);
    field.maxLength = maxspeed;
    field.curve = new Curve(points);
    field.getValue = function(x,y) {
        //return new Vector(10,10);
        var point = new Vector(x,y);
        //var intensity = Math.max(0, Math.abs((x-(x1-x0)/2))/maxspeed);
        var min = field.curve.minDist(point);
        var diff = min.deriv;
        var t = min.t;
        var r = (min.min-params.radius)/params.width;
        var intensity = field.maxLength*Math.exp(-r*r/2.0);
        if (intensity<0.1*field.maxLength) {intensity=0};
        diff.setLength(intensity);
        return diff;
    }
    return field;
}

