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
var VectorField = function(field, x0, y0, x1, y1) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.field = field;
    this.w = field.length;
    this.h = field[0].length;
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


VectorField.gridFromCurves = function(bounds, curves, gridSize) {
    var field = [];
    var w = gridSize.width;
    var h = gridSize.height;
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


VectorField.prototype.inBounds = function(x, y) {
  return x >= this.x0 && x < this.x1 && y >= this.y0 && y < this.y1;
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


VectorField.prototype.getValue = function(x, y, opt_result) {
    var a = (this.w - 1 - 1e-6) * (x - this.x0) / (this.x1 - this.x0);
    var b = (this.h - 1 - 1e-6) * (y - this.y0) / (this.y1 - this.y0);
    var vx = this.bilinear('x', a, b);
    var vy = this.bilinear('y', a, b);
    if (opt_result) {
        opt_result.x = vx;
        opt_result.y = vy;
        return opt_result;
    }
    return new Vector(vx, vy);
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
    field.center = params.center; //new Vector( (x1-x0)/2, (y1-y0)/2);
    field.getValue = function(x,y) {
        var point = new Vector(x,y);
        //var intensity = Math.max(0, Math.abs((x-(x1-x0)/2))/maxspeed);
        var diff = point.minus(field.center);
        var r = (diff.length()-params.radius)/params.width;
        //var intensity = 1000000*Math.exp(-(r-100)*(r-100)/900);
        var intensity = field.maxLength*Math.exp(-r*r/2.0);
        if (intensity<1e-2) {intensity=0};
        //intensity = Math.max(0, Math.abs(intensity-150)/1);
        diff.setLength(intensity);
        return diff.perpendicular();
    }
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

