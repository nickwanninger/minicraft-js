class StoneBlock extends Block {
  constructor(x, y, h) {
    super(x, y, h, "stone");
    this.isWall = true;
    this.connectsWithWater = false;
    this.connectsWithGrass = false;
    this.connectsWithStone = true;
  }
  render(ctx) {
    let leftBlock = level.blockAt(this.x - 1, this.y)
    let rightBlock = level.blockAt(this.x + 1, this.y)
    let upBlock = level.blockAt(this.x, this.y - 1)
    let downBlock = level.blockAt(this.x, this.y + 1)
    // either get edge data previously gotten, or get new data.
    let left = leftBlock && !leftBlock.connectsWithStone;
    let right = rightBlock && !rightBlock.connectsWithStone;
    let up = upBlock && !upBlock.connectsWithStone;
    let down = downBlock && !downBlock.connectsWithStone;
    // Populate the edge data for next time.

    // Default to the edge rendering nothing (8)

    let topLeft = 8
    let topRight = 8
    let bottomLeft = 8
    let bottomRight = 8

    // top left
    if (up) topLeft = 1
    if (left) topLeft = 7
    if (left && up) topLeft = 0

    // top Right
    if (up) topRight = 1
    if (right) topRight = 3
    if (right && up) topRight = 2

    // bottom left
    if (down) bottomLeft = 5
    if (left) bottomLeft = 7
    if (left && down) bottomLeft = 6

    // bottom right
    if (down) bottomRight = 5
    if (right) bottomRight = 3
    if (right && down) bottomRight = 4

    // 0 | 1
    // -----
    // 2 | 3
    this.renderEdgePartial(0, topLeft, ctx)
    this.renderEdgePartial(1, topRight, ctx)
    this.renderEdgePartial(2, bottomLeft, ctx)
    this.renderEdgePartial(3, bottomRight, ctx)
  }
  renderEdgePartial(quadrant, portion, ctx) {
    let image = textureLookup("stone");
    if (!image) return;
    let size = 8; // size of each quadrant
    let xo = 0; // x pos of the quadrant (quad 0 value)
    let yo = 0; // y pos of the quadrant (quad 0 value)
    if (quadrant == 1) xo = size;
    if (quadrant == 2) yo = size;
    if (quadrant == 3) {
      xo = size;
      yo = size
    }
    let coords = getEdgePartialCoords(portion)
    let sx = coords.x; // image x offset
    let sy = coords.y; // image y offset
    ctx.drawImage(image, sx, sy, size, size, (this.x << 4) + xo, (this.y << 4) + yo, size, size)
  }
}