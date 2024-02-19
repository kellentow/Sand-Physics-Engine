req.add("screen.js", 1.3);
var fps = {now:0, round:0, array:[]}
var last = new Date();
var sand = []
var brushS = 1
var occupied = []
var scr = {d:300,dm1:0}
scr.dm1 = scr.d-1
var mouse = {x:0,y:0,h:{id:null,class:null}}
var mods = {
    update:function(){},
    list:[]
}
var powders = {
    Sand:{
        convection: 0.002,
        color: "#D2B48C",
        temp: 30,
        kind: "powder"
    },
    MoltenGlass: {
        convection: 0.0005,
        color: "#996633",
        temp: 1700,
        kind: "liquid"
    },
    Glass: {
        convection: 0.0007,
        color: "#24424a",
        temp: 30,
        kind: "solid"
    },
}
var selected = Object.keys(powders)
var sel = 0

function updateloop() {
    occupied = []
    isParticleAt()

    mousehandler();
    keyhandler();

    update();
    draw();

    var thisLoop = new Date();
    fps.now = Math.round((1000 / (thisLoop - last))*10)/10
    fps.array.unshift(fps.now);
    for (let i = 0; i < fps.array.length; i++) {
        fps.round += fps.array[i];
    }
    fps.round = Math.round((fps.round / fps.array.length)*10)/10
    if (fps.array.length > 20) {
        fps.array.pop()
    }
    last = thisLoop;

    requestAnimationFrame(updateloop)
}

function isParticleAt(x, y) {
    if (x && y) {
        return occupied[x][y];
    }
    for (a = 0; a < scr.d; a++) {
        for (b = 0; b < scr.d; b++) {
            if (!occupied[a]) {
                occupied[a] = [];
            }
            occupied[a][b] = false;
        }
    }
    for (let i = 0; i < sand.length; i++) {
        let particle = sand[i];
        occupied[particle.x][particle.y] = true;
    }
}



function update() {
    for (var i = 0; i < sand.length; i++) {
        var px = sand[i].x + 0;
        var py = sand[i].y + 0;
        if (sand[i].type == "Sand") {
            if (!isParticleAt(sand[i].x, sand[i].y + 1)) {
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y + 1) && Math.random() > 0.5) {
                sand[i].x -= 1;
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y + 1)) {
                sand[i].x += 1;
                sand[i].y += 1;
            } if (sand[i].temp >= 1700) {sand[i].type = "MoltenGlass"}

        } else if (sand[i].type == "MoltenGlass") {
            if (!isParticleAt(sand[i].x, sand[i].y + 1)) {
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y + 1) && Math.random() <= 0.5) {
                sand[i].x -= 1;
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y + 1) && Math.random() <= 0.5) {
                sand[i].x += 1;
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y) && Math.random() <= 0.5) {
                sand[i].x -= 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y)) {
                sand[i].x += 1;
            }  if (sand[i].temp < 1700) {sand[i].type = "Glass"}
        } else if (sand[i].type == "Glass") {

        }
        if (sand[i].x < 1 ||sand[i].x >= scr.dm1 ||sand[i].y < 1 ||sand[i].y >= scr.dm1) {
            // Reset particle position if out of bounds
            sand[i].x = px;
            sand[i].y = py;
        }
        occupied[px][py] = false;
        occupied[sand[i].x][sand[i].y] = true;
    }
}


function draw() {
    screen.clear("sand");

    var sc = document.getElementById("sand")
    var context = sc.getContext('2d');
    context.fillStyle = "#000000";
    context.fillRect(0, 0, sc.width, sc.height);


    for (let i = 0; i < sand.length; i++) {
        let p = sand[i];
        screen.pixel.create(p.x, p.y, p.color, "sand");
    }

    //sidebar time
    screen.clear("sidebar")
    let canvas = document.getElementById('sidebar');
    let ctx = canvas.getContext('2d');

    ctx.font = '13px Trebuchet MS ';
    ctx.fillText('FPS: '+fps.round, 10, 15);
    ctx.fillText(sand.length+' particles', 10, 30);
    ctx.fillText(selected[sel], 10, 60);
    ctx.fillText('Brush size: '+brushS, 10, 76);
}

function init() {
    screen.create.screen(scr.d, scr.d, "sand");
    screen.create.screen(3/8*scr.d, scr.d, "sidebar");
    for (let i = 0; i < 180; i++) {
        for (let j = 0; j < 180; j++) {
            if (j>=90 && i>10 && i<170) {
                sand.push(new Particle(190-i, 190-j, "Sand"))
            } else if (j<90 && j>10 && i>10 && i<170) {
                sand.push(new Particle(190-i, 190-j, "MoltenGlass"))
            } else {
                sand.push(new Particle(190-i, 190-j, "Glass"))
            }
        }
    }
    var loadModsEvent = new Event('LoadMods');
    setTimeout(document.dispatchEvent(loadModsEvent), 1000)
    updateloop();
}

class Particle {
    constructor(x, y, type){
        this.temp = powders[type].temp
        this.color = powders[type].color
        this.convection = powders[type].convection
        this.kind = powders[type].kind
        this.type = type
        this.x = x
        this.y = y
        
    }
}

var keys = {};
document.addEventListener('keydown', function (e) {keys[e.code] = 1});
document.addEventListener('keyup', function (e) {keys[e.code] = 3});
document.addEventListener('mousemove', function (e) {
    mouse={x:e.layerX-10,y:e.layerY-80,h:e.target,b:e.buttons}
});
document.addEventListener('wheel', function (e) {
    if (e.deltaY < 0) {
        brushS += 1
    } else {
        brushS -= 1
    }
    if (brushS < 1) {
        brushS = 1
    }
});
function keyhandler() {
    console.log(keys)
    if (keys.Space == 1) {
        keys.Space = 2
        sel += 1
        if (sel >= selected.length) {
            sel = 0
        }
    }

}

function mousehandler() {
    if (mouse.h.id == "sand" && mouse.h.className == "screen") {
        if (mouse.b == 1) {
            var a = getPointsInRadius(brushS) 
            for (let i = 0; i < a.length; i++) {
                if (!occupied[a[i].x][a[i].y])
                sand.push(new Particle(a[i].x, a[i].y, selected[sel]))
            }
        }
        if (mouse.b == 2) {
            var a = getPointsInRadius(brushS) 
            for (let i = 0; i < a.length; i++) {
                deleteParticle(a[i].x, a[i].y)
            }
        }
        if (mouse.b != 0) {
            occupied = []
            isParticleAt()
        }
    }
}

function deleteParticle(x, y) {
    for (let i = 0; i < sand.length; i++) {
        if (sand[i].x == x && sand[i].y == y) {
            sand.splice(i, 1);
        }
    }
}

init()

// Function to calculate the distance between two points
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
  
// Function to get all points within a given radius around the mouse position
function getPointsInRadius(radius) {
    let points = [];
  
    // Determine the bounding box around the mouse position
    const minX = Math.max(0, Math.floor(mouse.x - radius));
    const maxX = Math.min(scr.d - 1, Math.ceil(mouse.x + radius));
    const minY = Math.max(0, Math.floor(mouse.y - radius));
    const maxY = Math.min(scr.d - 1, Math.ceil(mouse.y + radius));
  
    // Iterate through points within the bounding box
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        // Calculate the distance from the current point to the mouse position
        const distance = calculateDistance(mouse.x, mouse.y, x, y);
  
        // Check if the distance is within the specified radius
        if (distance <= radius) {
          // Add the point to the array
          points.push({ x, y });
        }
      }
    }
  
    return points;
  }
  