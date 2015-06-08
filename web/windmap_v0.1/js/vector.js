 /**
 * Simple representation of 2D vector.
 */

var Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

Vector.polar = function(r, theta) {
    console.log(r);
    console.log(theta);
    return new Vector(r * Math.cos(theta), r * Math.sin(theta));
};


Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};


Vector.prototype.copy = function(){
  return new Vector(this.x, this.y);
};


Vector.prototype.setLength = function(length) {
    var current = this.length();
    if (current) {
        var scale = length / current;
        this.x *= scale;
        this.y *= scale;
    }
    return this;
};


Vector.prototype.setAngle = function(theta) {
  var r = length();
  this.x = r * Math.cos(theta);
  this.y = r * Math.sin(theta);
  return this;
};


Vector.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};

Vector.prototype.rotate = function(delta){
    var c = Math.cos(delta), s=Math.sin(delta);
    return new Vector(c*this.x-s*this.y, c*this.y+s*this.x);
};

Vector.prototype.d = function(v) {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
};


Vector.prototype.perpendicular = function(r) {
  var theta = this.getAngle();
  if (r) {var radius = r;}
  else  {var radius = this.length();}
  return new Vector(-radius*Math.sin(theta), radius*Math.cos(theta));
};

Vector.prototype.x = function(){
    return this.x;
}

Vector.prototype.y = function(){
    return this.y;
}

Vector.prototype.plus = function(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
}

Vector.prototype.minus = function(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
}

Vector.prototype.mult = function(number) {
    return new Vector(this.x *number, this.y *number);
}
