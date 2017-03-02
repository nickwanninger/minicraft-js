class Camera {
  constructor(center, renderHeight) {
    renderHeight = renderHeight << 4
    this.target = center;
    this.screen = {
      width: Math.floor(renderHeight * 16/12),
      height: renderHeight,
    }
    this.centerview()
  }
  centerview() {
    this.view = {
      left: this.target.x + 8 - this.screen.width / 2,
      top: this.target.y + 8- this.screen.height / 2,
      width: this.screen.width,
      height: this.screen.height
    }
  }
  tick() {
    this.view = {};
    this.centerview();
    // console.log(this.view)
    return this.view;
  }

  insideView(x, y) {
    let padding = 3 << 4
    x = x << 4
    y = y << 4
    return x >= camera.view.left - padding && x <= camera.view.left + camera.view.width + padding && y >= camera.view.top - padding && y <= camera.view.top + camera.view.height + padding;
  }
}
