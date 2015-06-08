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
