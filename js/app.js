// Quick genereate a random int between min and max
Math.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
// Pick randomly from the provided list and return it
Math.randomList = function (list) {
  return list[Math.randomInt(0, list.length)];
};


"use strict";

// store key codes and currently pressed ones
var keys = {};
keys[37] = "left";
keys[38] = "up";
keys[39] = "right";
keys[40] = "down";
var activeKeys = {}
// 37 - left
// 38 = up
// 39 = right
// 40 = down
function keyLookup(val) {
  return keys[val]
}

function loadSprite(url) {
  let i = new Image(); //document.querySelector('img#' + url)
  i.src = "assets/" + url + ".png"
  return i;
}

const sprites = {
  "null": loadSprite("null"),
  "grass": loadSprite("grass"),
  "water": loadSprite("water"),
  "sand": loadSprite("sand"),
  "leaves": loadSprite("leaves"),
  "edge": loadSprite("edge"),
  "grassEdge": loadSprite("grassEdge"),
  "player": loadSprite("player"),
  "tree": loadSprite("tree"),
  "stone": loadSprite("stone"),
}



function textureLookup(name) {
  return sprites[name]
}



const gameStartTime = Date.now() // startTime of the game
// Returns ms from the start of the game
function getTick() {
  return Date.now() - gameStartTime;
}


let type, noise, treeGenerationCount, seed, stoneGenerationCount;

const targetFPS = 60
var fps = 60;

var drawCanvas = document.getElementsByTagName('canvas')[0]; // get the element canvas from the document
var finalCtx = drawCanvas.getContext('2d', {
  antialias: false
});

var calcCanvas = document.createElement('canvas'); // get the element canvas from the document
var ctx = calcCanvas.getContext('2d');







document.body.onkeyup =
  document.body.onkeydown = function (e) {
    var kc = e.keyCode || e.which;
    activeKeys[kc] = e.type == 'keydown';
  };





var player;



let fs = 20 // feature size
const level = new Level(100, 100)
const map = level.generate(fs, true)
const DRAW_IMAGES = true;
const camera = new Camera(player, 7)





function renderMap(map, ctx, full) {
  ctx.fillStyle = "#000"
  // ctx.fillRect(0, 0, calcCanvas.width, calcCanvas.height)

  let pixelsRendered = 0;
  player.tick()
  let region = camera.tick();
  ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height)
  let buffer = 3
  // The left bounds of the render
  let left = Math.max(Math.floor(region.left/16) - buffer, 0);
  // The top bounds of the render
  let top = Math.max(Math.floor(region.top/16) - buffer, 0);
  // The right bounds of the render
  let right = Math.min(left + (region.width/16) + 32, map.length);
  // The bottom bounds of the render
  let bottom = Math.min(top + (region.height/16) + 32, map[0].length);

  for (var x = left; x <= right; x++) {
    for (var y = top; y <= bottom; y++) {
      let tile = map[x][y]
      tile.render(ctx)
      // tile.renderEdge(ctx)
    }
  }


  player.render(ctx)


  ctx.strokeStyle = "red"
  // ctx.strokeRect(camera.view.left + 1, camera.view.top + 1, camera.view.width - 2, camera.view.height - 2)
  ctx.stroke()

  // render entities\
  if (level.entities.length > 0) {
    level.entities.forEach(e => {
      // console.log(e)
      e.wander()
      e.render(ctx)
    });

  }

  // console.log(level.within(camera.view))


  drawCanvas.width = Math.min(window.innerWidth - 50, 1040)
  let ratio = drawCanvas.width / camera.view.width
  drawCanvas.height = camera.view.height * ratio

  finalCtx.fillStyle = "#000"
  finalCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height)
  finalCtx.fill()


  let blockPixelSize = drawCanvas.width / camera.screen.width

  // disable smoothing again after each resize
  finalCtx.imageSmoothingEnabled = false;
  finalCtx.webkitImageSmoothingEnabled = false;
  finalCtx.mozImageSmoothingEnabled = false;
  finalCtx.msImageSmoothingEnabled = false;
  finalCtx.oImageSmoothingEnabled = false;
  let dx = 0 // the destination x pos
  let dy = 0 // the destination y pos
  let dw = camera.view.width * ratio * 16 // the desination width
  let dh = camera.view.height * ratio * 16; // the desination height
  finalCtx.drawImage(calcCanvas, camera.view.left, camera.view.top, camera.view.width * 16, camera.view.height  * 16, dx, dy, dw, dh)

  finalCtx.fillStyle = player.color;

  // finalCtx.font = "16px sans-serif";
  // finalCtx.fillStyle = "#fff";
  // finalCtx.fillText(fps + "fps", 2, 16);
}



function rgbToHex(r, g, b) {
  return "#" + ((1 << 44) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}



function mapKey(code) {
  switch (code) {
    case 87:
      return "w"
    case 65:
      return "a"
    case 83:
      return "s"
    case 68:
      return "d"
  }
}
var lastLoop = new Date;

function draw() {
  var thisLoop = new Date;
  fps = Math.round(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  if (level.hasGenerated) {
    renderMap(map, ctx)
  }

  // setTimeout(() => {
  requestAnimationFrame(draw)
  // }, 1000 / targetFPS)


}
requestAnimationFrame(draw)
