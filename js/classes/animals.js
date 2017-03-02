class Animal {
  constructor(x, y, color, moveDist) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.moveDist = moveDist || 1
    this.moveChance = 0.05
  }
  render() {
    if (camera.insideView(this.x, this.y)) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 1, 1)
    }

  }
  wander() {
    // 10% chance to wander
    if (Math.random() < this.moveChance) {
      let dx = Math.round(Math.random() * (this.moveDist * 2) - this.moveDist);
      let dy = Math.round(Math.random() * (this.moveDist * 2) - this.moveDist);
      let target = level.blockAt(this.x + dx, this.y +dy)
      if (target && target.isWalkable && target.isWall == false) {
        this.x += dx
        this.y += dy
      }
      
    }
  }
}

class Pig extends Animal {
  constructor(x, y) {
    super(x, y, "#f48fb1")
  }
}
class Cow extends Animal {
  constructor(x, y) {
    super(x, y, "#795548")
    this.moveChance = 0.01
  }
}
class Sheep extends Animal {
  constructor(x, y) {
    super(x, y, "#ffffff")
    this.moveChance = 0.08
  }
}