
/**
 * Bezier curves.
 */

var Bezier = function(P0,P1,P2) { //Vector inputs
    this.P0 = P0;
    this.P1 = P1;
    this.P2 = P2;
}

Bezier.prototype.pos = function(t) {
    var v0 = this.P0.mult(1.0-2.0*t*t*t);
    var v1 = this.P1.mult(2.0*t-2.0*t*t);
    var v2 = this.P2.mult(t*t);
    return v0.plus(v1.plus(v2));
}

/**
 * Cardinal spline curves
 *
 */
var Curve = function(points,tension,segments) {
    var expanded_points = [];
    points.forEach(function(p){
        expanded_points.push(p.x);
        expanded_points.push(p.y);
    });
    curvePoints = getCurvePoints (expanded_points, tension, segments);
    this.points = [];
    for (var idx=0;idx<curvePoints.length/2;idx++){
        this.points.push(new Vector(curvePoints[2*idx],curvePoints[2*idx+1]));
    }
    this.length = this.points.length;
}

Curve.prototype.pos = function(t) {
    var idx = Math.floor(t*(this.length-2)); // Does this work?
    var p1_x = this.points[idx].x;
    var p1_y = this.points[idx].y;
    var p2_x = this.points[idx+1].x;
    var p2_y = this.points[idx+1].y;
    return new Vector( (1-t)*p1_x+p2_x, (1-t)*p1_y+p2_y);
}

Curve.prototype.minDist = function(refPoint) {
    var min=1e6;
    var idx=-1;
    this.points.forEach(function(p,i){
        // For now, we do this crappy estimation
        if (p.minus(refPoint).length()<min){
            idx=i;
            min=p.minus(refPoint).length(); 
        }
    });
    if (idx==0) { 
        var diff = this.points[1].minus(this.points[0]); 
    }
    else if (idx==this.points.length-1) { 
        var diff = this.points[this.points.length-1].minus(this.points[this.points.length-2]); 
    }
    else {
        var diff = this.points[idx+1].minus(this.points[idx-1]); 
    }
    return { min:min, deriv: diff, t: (idx/this.length)};
    
    // Later on we compute exact minDistance
    var compares = [];
    var N = this.length-1;
    if (idx==0) { compares.push([ this.points[0], this.points[1] ]); }
    else if (idx == N) { compares.push([this.points[N-1], this.points[N] ]); }
    else { compares.push( [ this.points[idx-1], this.points[idx] ] );
           compares.push( [ this.points[idx], this.points[idx+1] ] );
         }
    return 0;
}