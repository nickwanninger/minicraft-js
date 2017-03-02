let sealevel = 0.3;
let stoneLevel = 0.7 + sealevel;
let grassLevel = 0.3 + sealevel;
let sandLevel = 0.14 + sealevel;
let waterLevel = 0.1 + sealevel;

let animalChance = 0.0009;
let treeChance = 0.1; // chance of a grass block being replaced by a tree
let stoneChance = 0.01; // chance of a grass block being replaced by a tree

const levelHeight = 64;
class Level {
  constructor(w, h, seed) {
    this.w = w;
    this.h = h;
    this.seed = "bob" //seed || Math.random();
    this.entities = [];
    this.map = []
    this.hasGenerated = false;
  }
  loopMap(cb) {
    if (this.map) {
      for (var x = 0; x < this.map.length; x++) {
        for (var y = 0; y < this.map[x].length; y++) {
          cb(this.map[x][y])
        }
      }
    }
  }
  blockAt(x, y) {
    x = Math.floor(x)
    y = Math.floor(y)
    // console.log(x,y)
    if (this.map[x]) {
      if (this.map[x][y]) {
        return this.map[x][y]
      }
    }
    return null;

  }
  // Returns the level object with the items within a camera.view object.
  within(view) {
    let buffer = 3 // padding on each side of the frame to still pass data to
    let left = view.left - buffer;
    let top = view.top - buffer;
    let right = view.left + view.width + buffer
    let bottom = view.top + view.height + buffer
    let returnData = {
      map: [],
      entities: [],
      view: view,
    }
    for (let x = Math.max(left, 0); x < Math.min(right, this.map.length); x++) {
      returnData.map[x - Math.max(left, 0)] = [];
      for (let y = Math.max(top, 0); y < Math.min(bottom, this.map[x].length); y++) {
        returnData.map[x - Math.max(left, 0)][y - Math.max(top, 0)] = this.map[x][y]
      }
    }


    return returnData



  }
  generate(featureSize, generate_entities) {
    console.log("running generation")


    featureSize = featureSize || 600
    console.time("Generated")

    calcCanvas.width = this.w * 16;
    calcCanvas.height = this.h * 16;
    
    calcCanvas.imageSmoothingEnabled = false;
    calcCanvas.webkitImageSmoothingEnabled = false;
    calcCanvas.mozImageSmoothingEnabled = false;
    calcCanvas.msImageSmoothingEnabled = false;
    calcCanvas.oImageSmoothingEnabled = false;

    this.map = [] // reset the this.map
    this.entities = []; // reset entities


    // seed = Math.random() * 5000
    const pn = new Perlin(this.seed);
    const pn2 = new Perlin(this.seed + "second seed");
    // const pn3 = new Perlin(this.seed + "third seed");


    // loop through the x and y of the calcCanvas
    for (var x = 0; x < calcCanvas.width; x++) {
      this.map[x] = []
      for (var y = 0; y < calcCanvas.height; y++) {

        noise = Math.abs(pn.noise(x / 1 / featureSize, y / 1 / featureSize, 0)); // get perlin noise for current location
        noise = (noise + Math.abs(pn2.noise(x / 1 / featureSize, y / 1 / featureSize, 0))) / 2
        // noise = (noise - Math.abs(pn3.noise(x / 1 / featureSize, y / 1 / featureSize, 0))/5)

        // calculate the color for the generated noise
        // Goes from top down
        if (noise < stoneLevel || noise > stoneLevel) {
          this.map[x][y] = new StoneBlock(x, y, noise * levelHeight)
        };
        if (noise < grassLevel) {
          this.map[x][y] = new GrassBlock(x, y, noise * levelHeight)
        };
        // if (noise < sandLevel) {
        //   this.map[x][y] = new SandBlock(x, y, noise * levelHeight)
        // };
        if (noise < waterLevel) {
          noise = waterLevel
          this.map[x][y] = new WaterBlock(x, y, noise * levelHeight)
        };
      }
    }
    treeGenerationCount = 0; // number of trees that have been generated so far.
    stoneGenerationCount = 0; // number of trees that have been generated so far.
    if (generate_entities) {
      this.loopMap(tile => {
        if (tile && tile.type == "grass") {

          // if (Math.random() < animalChance) {
          //   this.entities.push(Math.randomList([new Pig(tile.x, tile.y), new Cow(tile.x, tile.y), new Sheep(tile.x, tile.y)]))
          // }
          let willGenTree = Math.random() < (tile.h / (levelHeight) - 0.25);
          if (willGenTree) {
            if (tile.x > 1 && tile.y > 1 && tile.x < calcCanvas.width - 1 && tile.y < calcCanvas.height - 1) {
              treeGenerationCount++ // inc tree count to allow while loop to finish
              // build the tree
              this.map[tile.x][tile.y] = new TreeBlock(tile.x, tile.y, tile.h + 2)
            }

          }
        }
      })
      let playerX = Math.floor(Math.random() * calcCanvas.width)
      let playerY = Math.floor(Math.random() * calcCanvas.height)
      player = new Player(playerX, playerY)
      console.timeEnd("Generated")
    }
    // create the trees and pigs
    this.hasGenerated = true;
    return this.map
  }
}


// generate will return an object that looks like this:
/*
{
  w: Number,
  h: Number,
  entities: Array,
  map: Array,
}
*/
