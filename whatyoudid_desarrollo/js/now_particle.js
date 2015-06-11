var Particle = function(u, v, age) {
    this.x = -1;
    this.y = -1;
    this.u = u;
    this.v = v;
    this.oldX = -1;
    this.oldY = -1;
    this.age = age;
    this.rnd = Math.random();
}
