req.add("screen.js", 1.3);

const targetFPS = 30;
const targetFrameDuration = 1000 / targetFPS;
let lastFrameTime = performance.now();

var sands = []
var fps = { now: 0, round: 0, array: [] }
var last = new Date();
var sand = []
var brushS = 1
var occupied = []
var scr = { d: 300, dm1: 0 }
scr.dm1 = scr.d - 1
var mouse = { x: 0, y: 0, h: { id: null, class: null } }
var mods = {
    update: function () { },
    list: []
}
var powders = {
    Sand: {
        convection: 0.01,
        color: "#D2B48C",
        temp: 30,
        kind: "powder"
    },
    MoltenGlass: {
        convection: 0.03,
        color: "#996633",
        temp: 1700,
        kind: "liquid"
    },
    Glass: {
        convection: 0.005,
        color: "#24424a",
        temp: 30,
        kind: "solid"
    },
    Ice: {
        convection: 0.01,
        color: "#2e93db",
        temp: 0,
        kind: "solid"
    },
    Water: {
        convection: 0.01,
        color: "#0034cf",
        temp: 30,
        kind: "liquid"
    },
    WaterVapor: {
        convection: 0.01,
        color: "#4b4bf2",
        temp: 100,
        kind: "gas"
    },
    Graphite: {
        convection: 0.15,
        color: "#555555",
        temp: 30,
        kind: "solid"
    },
    MoltenGraphite: {
        convection: 0.1,
        color: "#AA7744",
        temp: 3600,
        kind: "liquid"
    },
}
var selected = Object.keys(powders)
selected.push("Heat")
selected.push("Cool")
var sel = 0

function updateloop() {
    const currentTime = performance.now();
    const elapsed = currentTime - lastFrameTime;

    occupied = []
    isParticleAt()
    mousehandler();
    keyhandler();
    update();
    draw();

    // fps calc
    var thisLoop = new Date();
    fps.now = Math.round((1000 / (thisLoop - last)) * 10) / 10
    fps.array.unshift(fps.now);
    for (let i = 0; i < fps.array.length; i++) {
        fps.round += fps.array[i];
    }
    fps.round = Math.round((fps.round / fps.array.length) * 10) / 10
    if (fps.array.length > 20) {
        fps.array.pop()
    }
    last = thisLoop;

    // update for 60fps
    lastFrameTime = currentTime;
    const timeToNextFrame = Math.max(0, targetFrameDuration - elapsed);
    setTimeout(() => { requestAnimationFrame(updateloop); }, timeToNextFrame);
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

function particleTransform(index, type) {
    sand[index].type = type;
    sand[index].color = powders[type].color;
    sand[index].kind = powders[type].kind;
}

function getParticleAt(x, y) {
    if (!sands || !sands[x] || !sands[x][y]) {
        sands = []
        for (let i = 0; i < sand.length; i++) {
            let particle = sand[i];
            if (!sands[particle.x]) {
                sands[particle.x] = [];
            }
            sands[particle.x][particle.y] = { particle: particle, index: i };
        }
    }
    if (sands[x]) {
        if (sands[x][y]) {
            return sands[x][y];
        }
    }
    return { particle: "null", index: -1 };
}

function update() {
    for (var i = 0; i < sand.length; i++) {
        var px = sand[i].x + 0;
        var py = sand[i].y + 0;

        //update particle position
        if (sand[i].type == "Sand") {
            if (!isParticleAt(sand[i].x, sand[i].y + 1)) {
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y + 1) && Math.random() > 0.5) {
                sand[i].x -= 1;
                sand[i].y += 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y + 1)) {
                sand[i].x += 1;
                sand[i].y += 1;
            }
            if (sand[i].temp >= 1700) {
                particleTransform(i, "MoltenGlass")

            }

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
            }
            if (sand[i].temp < 1500) {
                particleTransform(i, "Glass")

            }
            var part1 = getParticleAt(sand[i].x, sand[i].y - 1)
            if (part1.particle.kind == "powder") {
                sand[part1.index].y = sand[i].y;
                sand[i].y -= 1;
            }
        } else if (sand[i].type == "Glass") {
            if (sand[i].temp >= 1500) {
                particleTransform(i, "MoltenGlass")

            }
        } else if (sand[i].type == "Water") {
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
            }
            if (sand[i].temp >= 100) {
                particleTransform(i, "WaterVapor")

            }
            if (sand[i].temp <= 0) {
                particleTransform(i, "Ice")

            }
            var part1 = getParticleAt(sand[i].x, sand[i].y - 1)
            if (part1.particle.kind == "powder") {
                sand[part1.index].y = sand[i].y;
                sand[i].y -= 1;
            }
        } else if (sand[i].type == "WaterVapor") {
            if (!isParticleAt(sand[i].x, sand[i].y - 1)) {
                sand[i].y -= 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y - 1) && Math.random() <= 0.5) {
                sand[i].x -= 1;
                sand[i].y -= 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y - 1) && Math.random() <= 0.5) {
                sand[i].x += 1;
                sand[i].y -= 1;
            } else if (!isParticleAt(sand[i].x - 1, sand[i].y) && Math.random() <= 0.5) {
                sand[i].x -= 1;
            } else if (!isParticleAt(sand[i].x + 1, sand[i].y)) {
                sand[i].x += 1;
            }
            if (sand[i].temp < 100) {
                particleTransform(i, "Water")

            }
            var part1 = getParticleAt(sand[i].x, sand[i].y - 1)
            if (part1.particle.kind == "powder" || part1.particle.kind == "liquid") {
                sand[part1.index].y = sand[i].y;
                sand[i].y -= 1;
            }
        } else if (sand[i].type == "Ice") {
            if (sand[i].temp > 0) {
                particleTransform(i, "Water")
            }
        } else if (sand[i].type == "Graphite") {
            if (sand[i].temp >= 3600) {
                particleTransform(i, "MoltenGraphite")
            }
        } else if (sand[i].type == "MoltenGraphite") {
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
            }
            if (sand[i].temp < 3600) {
                particleTransform(i, "Graphite")

            }
        }
        if (sand[i].x < 1 || sand[i].x >= scr.dm1 || sand[i].y < 1 || sand[i].y >= scr.dm1) {
            // Reset particle position if out of bounds
            sand[i].x = px;
            sand[i].y = py;
        }

        var p1 = getParticleAt(sand[i].x, sand[i].y - 1)
        var p2 = getParticleAt(sand[i].x + 1, sand[i].y)
        var p3 = getParticleAt(sand[i].x, sand[i].y + 1)
        var p4 = getParticleAt(sand[i].x - 1, sand[i].y)

        if (p1.index != -1) {
            if (p1.particle.temp > sand[i].temp) {
                var tempchange1 = p1.particle.temp * ((p1.particle.convection + sand[i].convection) / 2)
                sand[i].temp += tempchange1
                sand[p1.index].temp -= tempchange1
            } else if (p1.particle.temp < sand[i].temp) {
                var tempchange1 = sand[i].temp * ((p1.particle.convection + sand[i].convection) / 2)
                sand[p1.index].temp += tempchange1
                sand[i].temp -= tempchange1
            }
        }

        if (p2.index != -1) {
            if (p2.particle.temp > sand[i].temp) {
                var tempchange2 = p2.particle.temp * ((p2.particle.convection + sand[i].convection) / 2)
                sand[i].temp += tempchange2
                sand[p2.index].temp -= tempchange2
            } else if (p1.particle.temp < sand[i].temp) {
                var tempchange2 = sand[i].temp * ((p2.particle.convection + sand[i].convection) / 2)
                sand[p2.index].temp += tempchange2
                sand[i].temp -= tempchange2
            }
        }

        if (p3.index != -1) {
            if (p3.particle.temp > sand[i].temp) {
                var tempchange3 = p3.particle.temp * ((p3.particle.convection + sand[i].convection) / 2)
                sand[i].temp += tempchange3
                sand[p3.index].temp -= tempchange3
            } else if (p3.particle.temp < sand[i].temp) {
                var tempchange3 = sand[i].temp * ((p3.particle.convection + sand[i].convection) / 2)
                sand[p3.index].temp += tempchange3
                sand[i].temp -= tempchange3
            }
        }

        if (p4.index != -1) {
            if (p4.particle.temp > sand[i].temp) {
                var tempchange4 = p4.particle.temp * ((p4.particle.convection + sand[i].convection) / 2)
                sand[i].temp += tempchange4
                sand[p4.index].temp -= tempchange4
            } else if (p4.particle.temp < sand[i].temp) {
                var tempchange4 = sand[i].temp * ((p4.particle.convection + sand[i].convection) / 2)
                sand[p4.index].temp += tempchange4
                sand[i].temp -= tempchange4
            }
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
    ctx.fillText('FPS: ' + fps.round, 10, 15);
    ctx.fillText(sand.length + ' particles', 10, 30);
    ctx.fillText(selected[sel], 10, 60);
    ctx.fillText('Brush size: ' + brushS, 10, 75);
    var p = getParticleAt(mouse.x, mouse.y)
    if (p.index !== -1) {
        ctx.fillText('Particle info: ', 10, 105);
        ctx.fillText('Type: ' + p.particle.type, 10, 120);
        ctx.fillText('Temp: ' + p.particle.temp, 10, 135);
        ctx.fillText('Position: ' + p.particle.x + "," + p.particle.y, 10, 150);
        ctx.fillText('#' + p.index, 10, 165);
    }
}

function init() {
    screen.create.screen(scr.d, scr.d, "sand");
    screen.create.screen(3 / 8 * scr.d, scr.d, "sidebar");
    for (let i = 0; i < 80; i++) {
        for (let j = 0; j < 80; j++) {
            if (j >= 40 && i > 5 && i < 75) {
                sand.push(new Particle(90 - i, 90 - j, "Sand"))
            } else if (j < 40 && j > 5 && i > 5 && i < 75) {
                sand.push(new Particle(90 - i, 90 - j, "MoltenGlass"))
            } else {
                sand.push(new Particle(90 - i, 90 - j, "Glass"))
            }
        }
    }
    var loadModsEvent = new Event('LoadMods');
    setTimeout(document.dispatchEvent(loadModsEvent), 1000)

    var a = document.getElementById("sand")
    a.style.position = "absolute"
    a.style.top = "150px"
    a.style.left = "10px"

    var b = document.getElementById("sidebar")
    b.style.position = "absolute"
    b.style.top = "150px"
    b.style.left = "310px"

    updateloop();
}

class Particle {
    constructor(x, y, type) {
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
document.addEventListener('keydown', function (e) { keys[e.code] = 1 });
document.addEventListener('keyup', function (e) { keys[e.code] = 3 });
document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX - 10
    mouse.y = e.clientY - 150
    mouse.h = e.target
});

//mouse stuff
document.addEventListener('mousedown', function (e) { mouse.b = e.buttons });
document.addEventListener('mouseup', function (e) { mouse.b = e.buttons });
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
    if (keys.Space == 1) {
        keys.Space = 2
        sel += 1
        if (sel >= selected.length) {
            sel = 0
        }
    }

}

function mousehandler() {
    console.log
    if (mouse.h.id == "sand" && mouse.h.className == "screen") {
        if (mouse.b == 1) {
            var a = getPointsInRadius(brushS)
            for (let i = 0; i < a.length; i++) {

                if (selected[sel] != "Heat" && selected[sel] != "Cool") {
                    if (!occupied[a[i].x][a[i].y]) {
                        sand.push(new Particle(a[i].x, a[i].y, selected[sel]))
                    }
                } else if (selected[sel] == "Heat") {
                    if (getParticleAt(a[i].x,a[i].y).index != -1) {
                        sand[getParticleAt(a[i].x,a[i].y).index].temp += 5
                    }
                } else if (selected[sel] == "Cool") {
                    if (getParticleAt(a[i].x,a[i].y).index != -1) {
                        sand[getParticleAt(a[i].x,a[i].y).index].temp -= 5
                    }
                }

            }
        }
        if (mouse.b == 2) {
            var a = getPointsInRadius(brushS)
            for (let i = 0; i < a.length; i++) {
                deleteParticle(a[i].x, a[i].y)
            }
        }
        if (!mouse.b == 0) {
            occupied = []
            isParticleAt()
        }
    }
}

function deleteParticle(x1, y1) {
    var a = getParticleAt(x1, y1).index
    if (a != -1) {
        sand.splice(a, 1);
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
