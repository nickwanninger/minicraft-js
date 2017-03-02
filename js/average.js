var i;
var len;
var multiplicator = 20;
var count;
var rgba;

function getAverageRGBA(image_data, resolution) {
  multiplicator = parseInt(resolution, 10) > 1 ? parseInt(resolution, 10) : 10;
  len = image_data.data.length;
  count = 0;
  rgba = [0, 0, 0, 0];

  for (i = 0; i < len; i += multiplicator * 4) {
    rgba[0] = rgba[0] + image_data.data[i];
    rgba[1] = rgba[1] + image_data.data[i + 1];
    rgba[2] = rgba[2] + image_data.data[i + 2];
    rgba[3] = rgba[3] + image_data.data[i + 3];

    count++;
  }

  rgba[0] = ~~(rgba[0] / count);
  rgba[1] = ~~(rgba[1] / count);
  rgba[2] = ~~(rgba[2] / count);
  rgba[3] = ~~(rgba[3] / count);

  return rgba;
}



Math.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
// Pick randomly from the provided list and return it
Math.randomList = function (list) {
  return list[Math.randomInt(0, list.length)];
};