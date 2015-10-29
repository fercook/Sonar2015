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
    this.field0 = field;
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
 * Reads data from png files where RGB are used to annotate xyz strengths of vectors,
   aka a normals file. In this case B==0 always as we have two dimensional arrows

 */



VectorField.gridFromNormals = function(bounds, masks, gridSize, callback) {

    var field;
    var w = gridSize.width;
    var h = gridSize.height;

    function myGetImageData(img) {
        var ifield = [];
        for (var x = 0; x < w; x++) {
            ifield[x] = [];
            for (var y = 0; y < h; y++) {
                ifield[x][y] = 0;
            }
        }
        var fakecanvas = document.createElement('canvas');
        fakecanvas.width = img.width;
        fakecanvas.height = img.height;
        var context = fakecanvas.getContext('2d');
        context.drawImage(img, 0, 0 );
        var data = context.getImageData(0,0,img.width,img.height);
        var maxpixel = 0;
        for (var xy = 0; xy < h*w; xy+=4) {
            maxpixel = Math.max(maxpixel,data.data[xy]);
            maxpixel = Math.max(maxpixel,data.data[xy+1]);
        }
        var i = 0;
        var scale = 1.0/128 ;//(maxpixel);
        var zx = data.data[0];
        var zy = data.data[1];
        var sx,sy;
        // Freaking bug in the normal imgs
        if (img.src=="http://localhost/whatyoudid/imgs/now/NormalFill_PlusD.png" ||
            img.src=="http://localhost/whatyoudid/imgs/now/NormalFill_Planta.png") {
                sx=-1; sy=1;}
        else { sx=1; sy=-1;}
        //console.log(loading+img.src+":"+data.data[0]+","+data.data[1]);
        loading--;
        percent = (17.0-loading)/17;
        //console.log("x:"+data.data[w*4/2]+", y:"+data.data[h*4/2]);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var vx = sx*(data.data[i]-zx)*scale,
                        vy = sy*(data.data[i+1]-zy)*scale;
                    if (Math.abs(vx)<=1.0/128) vx=0;
                    if (Math.abs(vy)<=1.0/128) vy=0;
                ifield[x][y] = new Vector(vx,vy);
                i+=4;
            }
        }
        return ifield;
    }

    var imagesAllLoaded = function() {
      if (imagesOK==masks.length ) {
          // all images are fully loaded and ready to use
          // The first one holds the velocity patterns, it loads in the global field variable
          field = myGetImageData(imgs[0]);
          var result = new VectorField(field, bounds.x0, bounds.y0, bounds.x1, bounds.y1);
          for (var k=0;k<masks.length;k++) {
              result.fields.push(myGetImageData(imgs[k]));
          }
          callback(result);
        }
    }

    var imgs=[];
    var imagesOK=0;
    for (var i = 0; i < masks.length; i++) {
        var img = new Image();
        imgs.push(img);
        img.onload = function(){ imagesOK++; imagesAllLoaded(); };
        img.src = masks[i];
    }

    return true;
};


VectorField.prototype.aggregateSpeeds = function(magnitudes) {
    this.magnitudes = magnitudes;
    var m = d3.sum(magnitudes);
    if (m>0) {
        for (var x = 0; x < this.w; x++) {
            for (var y = 0; y < this.h; y++) {
                var L=new Vector(0,0);
                for (var n=0;n<magnitudes.length;n++) {
                    L = L.plus(this.fields[n][x][y].mult(magnitudes[n]));
                };
                this.field[x][y] = L;
                //this.field[x][y] = this.fields[6][x][y];
            }
        }
    } else {
        for (var x = 0; x < this.w; x++) {
            for (var y = 0; y < this.h; y++) {
                this.field[x][y]=new Vector(0,0);
            }
        }
        loading = 0;
        this.maxLength=0;
    }
    return;
}



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


VectorField.constant = function(dx, dy, x0, y0, x1, y1,maxlen) {
    var field;
    if (maxlen) {field = new VectorField([[]], x0, y0, x1, y1, maxlen); }
    else {field = new VectorField([[]], x0, y0, x1, y1,Math.sqrt(dx * dx + dy * dy));}
    field.h = y1-y0;
    field.w = x1-x0;
    field.getValue = function(u,v,test) {
        return new Vector(dx, dy);
    }
    return field;
}


// PREVIOUS ATTEMPTS DO NOT WORK SO WELL, we went with the normals idea
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

