/**
 * Listens to mouse events on an element, tracks zooming and panning,
 * informs other components of what's going on.
 */
var Animator = function(element, opt_animFunc, opt_unzoomButton) {
     this.element = element;
    this.mouseIsDown = false;
    this.mouseX = -1;
    this.mouseY = -1;
    this.animating = true;
    this.state = 'animate';
    this.listeners = [];
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    this.zoomProgress = 0;
    this.scaleTarget = 1;
    this.scaleStart = 1;
    this.animFunc = opt_animFunc;
    this.unzoomButton = opt_unzoomButton;

    if (element) {
        var self = this;
      $(element).mousedown(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
        self.mouseY = e.pageY - this.offsetTop;
          self.mousedown();
      });
      $(element).mouseup(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
        self.mouseY = e.pageY - this.offsetTop;
          self.mouseup();
      });
      $(element).mousemove(function(e){
            self.mouseX = e.pageX - this.offsetLeft;
        self.mouseY = e.pageY - this.offsetTop;
          self.mousemove();
      });
  }
};


Animator.prototype.mousedown = function() {
    this.state = 'mouse-down';
    this.notify('startMove');
    this.landingX = this.mouseX;
    this.landingY = this.mouseY;
    this.dxStart = this.dx;
    this.dyStart = this.dy;
    this.scaleStart = this.scale;
    this.mouseIsDown = true;
};


Animator.prototype.mousemove = function() {
    if (!this.mouseIsDown) {
        this.notify('hover');
        return;
    }
    var ddx = this.mouseX - this.landingX;
    var ddy = this.mouseY - this.landingY;
    var slip = Math.abs(ddx) + Math.abs(ddy);
    if (slip > 2 || this.state == 'pan') {
        this.state = 'pan';
        this.dx += ddx;
        this.dy += ddy;
        this.landingX = this.mouseX;
        this.landingY = this.mouseY;
        this.notify('move');
    }
}

Animator.prototype.mouseup = function() {
    this.mouseIsDown = false;
    if (this.state == 'pan') {
        this.state = 'animate';
        this.notify('endMove');
        return;
    }
    this.zoomClick(this.mouseX, this.mouseY);
};


Animator.prototype.add = function(listener) {
     this.listeners.push(listener);
};


Animator.prototype.notify = function(message) {
    if (this.unzoomButton) {
        var diff = Math.abs(this.scale - 1) > .001 ||
                   Math.abs(this.dx) > .001 || Math.abs(this.dy > .001);
        this.unzoomButton.style.visibility = diff ? 'visible' : 'hidden';
    }
    if (this.animFunc && !this.animFunc()) {
        return;
    }
    for (var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        if (listener[message]) {
            listener[message].call(listener, this);
        }
    }
};


Animator.prototype.unzoom = function() {
    this.zoom(0, 0, 1);
};


Animator.prototype.zoomClick = function(x, y) {
    var z = 1.7;
    var scale = 1.7 * this.scale;
    var dx = x - z * (x - this.dx);
    var dy = y - z * (y - this.dy);
    this.zoom(dx, dy, scale);
};

Animator.prototype.zoom = function(dx, dy, scale) {
    this.state = 'zoom';
  this.zoomProgress = 0;
  this.scaleStart = this.scale;
    this.scaleTarget = scale;
    this.dxTarget = dx;
    this.dyTarget = dy;
    this.dxStart = this.dx;
    this.dyStart = this.dy;
    this.notify('startMove');
};

Animator.prototype.relativeZoom = function() {
    return this.scale / this.scaleStart;
};


Animator.prototype.relativeDx = function() {
    return this.dx - this.dxStart;
}

Animator.prototype.relativeDy = function() {
    return this.dy - this.dyStart;
}

Animator.prototype.start = function(opt_millis) {
    var millis = opt_millis || 20;
    var self = this;
    function go() {
        var start = new Date();
        self.loop();
        var time = new Date() - start;
        setTimeout(go, Math.max(10, millis - time));
    }
    go();
};


Animator.prototype.loop = function() {
    if (this.state == 'mouse-down' || this.state == 'pan') {
        return;
    }
    if (this.state == 'animate') {
      this.notify('animate');
        return;
  }
    if (this.state == 'zoom') {
      this.zoomProgress = Math.min(1, this.zoomProgress + .07);
      var u = (1 + Math.cos(Math.PI * this.zoomProgress)) / 2;
        function lerp(a, b) {
            return u * a + (1 - u) * b;
        }
      this.scale = lerp(this.scaleStart, this.scaleTarget);
        this.dx = lerp(this.dxStart, this.dxTarget);
        this.dy = lerp(this.dyStart, this.dyTarget);
      if (this.zoomProgress < 1) {
          this.notify('move');
      } else {
          this.state = 'animate';
          this.zoomCurrent = this.zoomTarget;
           this.notify('endMove');
      }
  }
};
