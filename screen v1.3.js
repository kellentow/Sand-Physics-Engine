// Version 1.3
req.load("screen.js", 1.3)

// Change color function
var screen = {
  width: function (sc, size) {
    return document.getElementById(sc).clientWidth / size;
  },
  height: function (sc, size) {
    return document.getElementById(sc).clientHeight / size;
  },
  clear: function (sc) {
    sc = document.getElementById(sc)
    var context = sc.getContext('2d');
    context.clearRect(0, 0, sc.width, sc.height);
  },
  create: {
    screen: function (w, h, id) {
      var sc = document.createElement("canvas");
      sc.width = w;
      sc.height = h;
      sc.classList.add("screen");
      sc.id = id;

      // Append the screen to the body (you can modify this based on your needs)
      document.body.appendChild(sc);
    },
    line: function (x1, y1, x2, y2, sc, size) {
      var x = 0
      max = Math.max(x1,y1,x2,y2);
      for (x = 0; x < max; x++) {
        screen.pixel.create(x1 + (x2 - x1) * (x / max), y1 + (y2 - y1) * (x / max), size, sc)
      }
    },
    rectangle: function (x, y, width, height, screenId) {

      // Calculate 4 corners
      let x1 = x;
      let y1 = y;
      let x2 = x + width;
      let y2 = y;
      let x3 = x + width;
      let y3 = y + height;
      let x4 = x;
      let y4 = y + height;

      // Draw 4 lines to make a rectangle
      this.line(x1, y1, x2, y2, screenId);
      this.line(x2, y2, x3, y3, screenId);
      this.line(x3, y3, x4, y4, screenId);
      this.line(x4, y4, x1, y1, screenId);
    },
    elipsis: function (cx, cy, rx, ry, acc, screenId) {

      // Center position
      let centerX = cx;
      let centerY = cy;

      // X and Y radii
      let radiusX = rx;
      let radiusY = ry;

      // Loop to draw points around the ellipse
      for (let degree = 0; degree < 360; degree += acc) {

        // Calculate point on ellipse for this angle
        let x = centerX + radiusX * Math.cos(degree * Math.PI / 180);
        let y = centerY + radiusY * Math.sin(degree * Math.PI / 180);

        // Draw point
        screen.pixel.create(x, y, "black", screenId);
      }

    }

  },
  pixel: {
    create: function (x, y, color, id) {
      var x = Math.round(x)
      var y = Math.round(y)

      if (screen.pixels[x] === undefined) {
        screen.pixels[x] = [];
      }
      var sc = document.getElementById(id)
      var context = sc.getContext('2d');
      screen.pixels[x][y] = {}
      screen.pixels[x][y].color = color;
      context.fillStyle = screen.pixels[x][y].color;
      context.fillRect(x, y, 1, 1)
    }
  },
  pixels: []
};
