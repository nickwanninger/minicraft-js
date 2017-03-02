class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.size = 1
    this.color = "#f44336"
    this.initTime = Date.now()
    // this.moveSpeed = 0.05;
    this.moveSpeed = 1;

    this.blockOffset = {
      x: 0,
      y: 0,
    }
    this.dir = 0 // 0 = up, 1 = right, 2 = down, 3 = left;
    this.inventory = {};
    this.animationTime = 0;
  }
  getBlockInDir() {
    if (this.dir == 0) { // up
      return level.blockAt(Math.floor(this.x + 0.5), Math.floor(this.y + 0.5 - 1))
    }
    if (this.dir == 1) {
      return level.blockAt(Math.floor(this.x + 0.5 + 1), Math.floor(this.y + 0.5))
    }
    if (this.dir == 2) {
      return level.blockAt(Math.floor(this.x + 0.5), Math.floor(this.y + 0.5 + 1))
    }
    if (this.dir == 3) {
      return level.blockAt(Math.floor(this.x + 0.5 - 1), Math.floor(this.y + 0.5))
    }
  }
  render(ctx) {
    ctx.drawImage(textureLookup("player"), 16 * this.animationTime, this.dir * 16, 16, 16, this.x, this.y, 16, 16)
  }
  getCollision() {
    return {
      l: true,
      u: true,
      r: true,
      d: true,
    };
  }
  tick() {

    let speedMul = 1;

    // if (level.blockAt(Math.floor(this.x + 0.5), Math.floor(this.y + 0.5)).type == "water") {
    //   speedMul = 0.5
    // }

    let collision = this.getCollision();

    // this.moveSpeed = Math.round(this.moveSpeed);
    if (activeKeys[37] && this.x > (1 << 4)) { // left arrow
      if (collision.l) this.x -= this.moveSpeed * speedMul;
      this.dir = 3
    }
    if (activeKeys[39] && this.x < (level.map.length - 2 << 4)) { // right arrow
      if (collision.r) this.x += this.moveSpeed * speedMul;
      this.dir = 1
    }

    if (activeKeys[38] && (this.y > 1 << 4)) { // up arrow
      if (collision.u) this.y -= this.moveSpeed * speedMul;
      this.dir = 0
    }

    if (activeKeys[40] && this.y < (level.map[0].length - 2 << 4)) { // down arrow
      if (collision.d) this.y += this.moveSpeed * speedMul;
      this.dir = 2
    }

    // Progress animation if any key.
    if (activeKeys[37] || activeKeys[38] || activeKeys[39] || activeKeys[40]) {
      this.animationTime = Math.floor(Math.sin((Date.now() - this.initTime) / 50) + 1)
    }

    if (activeKeys[32]) { // spacebar interact
      this.getBlockInDir().interact()
    }

    this.x = sig(this.x, 2)
    this.y = sig(this.y, 2)

    if (camera.insideView(this.x, this.y)) {
      // console.log(level.blockAt(this.x, this.y))
      ctx.fillStyle = this.color;
      // ctx.fillRect(this.x, this.y, this.size, this.size)
      this.blockOffset.x = sig(this.x - Math.floor(this.x), 3)
      this.blockOffset.y = sig(this.y - Math.floor(this.y), 3)
    }
  }
}

function sig(v, n) {
  return Number((v).toFixed(n))
}
