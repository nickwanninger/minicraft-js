const blockColorLookup = {
  water: [52, 95, 218],
  sand: [217, 206, 166],
  stone: [117, 117, 117],
  grass: [76, 175, 80],
  leaves: [90, 143, 55]
};


class Block {
  constructor(x, y, h, type) {
    this.x = x;
    this.y = y;
    this.h = h
    this.type = type;
    // this.color = blockColorLookup[this.type];
    this.isWall = false;
    this.isWalkable = true;
    this.sprite = "null"
    this.spriteIndex = 0;
    this.connectsWithWater = false;
    this.connectsWithGrass = false;
    this.connectsWithStone = false;
    this.edgeOn = "grass"
    this.edge = "edge"

  }
  interact() {
    // default doesn't do anything when user interacts with block
    return null;
  }
  // getColor() {
  //   return blockColorLookup[this.type]
  // }

  render(ctx) {
    ctx.drawImage(textureLookup(this.sprite), this.x * 16, this.y * 16, 16, 16)
    if (this.renderEdge) {
      this.renderEdge(ctx)  
    }
    
  }
}







class WaterBlock extends Block {
  constructor(x, y, h) {
    super(x, y, h, "water");
    this.color = [52, 95, 218]
    this.noiseRange = 5;
    this.isWalkable = false;
    this.sprite = "water"
    this.connectsWithWater = true;
    this.connectsWithGrass = false;
    this.edgeData = {};
    this.edge = "edge";
    this.edgeOn = "grass"
  }
  getColor() {
    return this.color
  }

  renderEdge(ctx) {
    let leftBlock = level.blockAt(this.x - 1, this.y)
    let rightBlock = level.blockAt(this.x + 1, this.y)
    let upBlock = level.blockAt(this.x, this.y - 1)
    let downBlock = level.blockAt(this.x, this.y + 1)
    // either get edge data previously gotten, or get new data.
    let left = leftBlock && !leftBlock.connectsWithWater;
    let right = rightBlock && !rightBlock.connectsWithWater;
    let up = upBlock && !upBlock.connectsWithWater;
    let down = downBlock && !downBlock.connectsWithWater;
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
    let image = textureLookup(this.edge);
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









class SandBlock extends Block {
  constructor(x, y, h) {
    super(x, y, h, "sand");
    this.color = [217 + offset, 206 + offset, 166 + offset]
    this.sprite = "sand"
  }
  getColor() {
    return this.color
  }
}





class TreeBlock extends Block {
  constructor(x, y, h) {
    super(x, y, h, "tree");
    this.isWall = true;
    this.sprite = "tree"
    this.connectsWithWater = false;
    this.connectsWithGrass = true;
  }
  interact() {
    this.type = "grass"
    this.isWall = false;
    return this;
  }
}



function getEdgePartialCoords(r) {
  if (r == 8) {
    return {
      x: 8,
      y: 8
    }
  }
  if (r == 0) {
    return {
      x: 0,
      y: 0
    }
  }
  if (r == 1) {
    return {
      x: 8,
      y: 0
    }
  }
  if (r == 2) {
    return {
      x: 16,
      y: 0
    }
  }
  if (r == 3) {
    return {
      x: 16,
      y: 8
    }
  }
  if (r == 4) {
    return {
      x: 16,
      y: 16
    }
  }
  if (r == 5) {
    return {
      x: 8,
      y: 16
    }
  }
  if (r == 6) {
    return {
      x: 0,
      y: 16
    }
  }
  if (r == 7) {
    return {
      x: 0,
      y: 8
    }
  }
}
