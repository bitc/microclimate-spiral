var leds = [];
for (var i = 0; i < 500; ++i) {
    leds.push([0, 0, 0]);
}

var coils = [];
// inner-to-outer coils measurements:
// coils.push(12);
// coils.push(49);
// coils.push(110);
// coils.push(196);
// coils.push(307);
// coils.push(442);

// outer-to-inner coils measurements:
coils.push(19);
coils.push(161);
coils.push(278);
coils.push(370);
coils.push(438);
coils.push(480);


for (var i = 0; i < coils.length; ++i) {
    leds[coils[i]][0] = 0;
    leds[coils[i]][1] = 255;
    leds[coils[i]][2] = 255;
}


var NUM_LEDS = 400;

var counter = 8;
function loop() {
   counter++;
    if (counter == 512) {
        counter = 0;
    }

    for (var i = 0; i < leds.length; ++i) {
        leds[i][0] = 0;
        leds[i][1] = 0;
        leds[i][2] = 0;
    }
/*

    // for (var i = 0; i < coils.length; ++i) {
    //     leds[coils[i]][0] = 0;
    //     leds[coils[i]][1] = 255;
    //     leds[coils[i]][2] = 0;
    // }

    // leds[counter][0] = 255;
    // leds[counter][1] = 255;
    // leds[counter][2] = 255;

    for (var i = 0; i < coils.length - 1; ++i) {
        var t = coils[i+1] - coils[i];
        var p = Math.floor((t * counter) / 256) + coils[i];
        leds[p][0] = 255;
        leds[p][1] = 0;
        leds[p][2] = 255;
    }

    for (var i = 0; i < coils.length - 1; ++i) {
        var t = coils[i+1] - coils[i];
        var p = Math.floor((t * ((counter + 85) % 256)) / 256) + coils[i];
        leds[p][0] = 0;
        leds[p][1] = 255;
        leds[p][2] = 255;
    }

    var TRAIL = 32;
*/
    for (var i = 0; i < coils.length - 1; ++i) {
        for (var j = coils[i]; j < coils[i+1]; ++j) {
            var t = coils[i+1] - coils[i];
            var p1 = Math.floor((t * counter) / 512) + coils[i];
            var p2 = Math.floor((t * ((counter + 64) % 512)) / 512) + coils[i];
            var p3 = Math.floor((t * ((counter + 128) % 512)) / 512) + coils[i];
            var p4 = Math.floor((t * ((counter + 192) % 512)) / 512) + coils[i];
            var p5 = Math.floor((t * ((counter + 256) % 512)) / 512) + coils[i];
            var p6 = Math.floor((t * ((counter + 320) % 512)) / 512) + coils[i];
            var p7 = Math.floor((t * ((counter + 384) % 512)) / 512) + coils[i];
            var p8 = Math.floor((t * ((counter + 448) % 512)) / 512) + coils[i];

            if (j == p1 || j == p2 || j == p3 || j == p4 || j == p5 || j == p6 || j == p7 || j == p8) {
                leds[j][0] = 255;
                leds[j][1] = 255;
                leds[j][2] = 0;
            // } else if () {
            } else {
                leds[j][0] = 32;
                leds[j][1] = 32;
                leds[j][2] = 32;
            }
        }
    }

/*
    let ci = 0;
    for (let i = coils[0]; i <= coils[coils.length - 1]; ++i) {
        if (i === coils[ci + 1]) {
            ci++;
        }
        let end = coils[ci + 1];
        let start = coils[ci];
        let t = end - start;
        let alpha = Math.floor(((i - start) * 256) / t);
        let d = (counter + 256 - alpha) % 256;
        if (d <= 48) {
            leds[i][0] = 0;
            leds[i][1] = (48 - d) * 5;
            leds[i][2] = 0;
        }
    }
    */
}

var cycle = 0;
function loop_water() {
    var SPACING = 18;
    var speed = 3;
    for (var i = 0; i < NUM_LEDS; ++i) {
        var phase = Math.floor(cycle / speed);
        if (i % SPACING == phase % SPACING) {
            leds[i][0] = 0;
            leds[i][1] = 0;
            leds[i][2] = 255;
        } else if (i % SPACING + 1 == phase % SPACING) {
            leds[i][0] = 0;
            leds[i][1] = 0;
            leds[i][2] = 150;
        } else if (i % SPACING + 2 == phase % SPACING) {
            leds[i][0] = 120;
            leds[i][1] = 0;
            leds[i][2] = 120;
        } else {
            leds[i][0] = 0;
            leds[i][1] = 0;
            leds[i][2] = 0;
        }
    }

    cycle++;
}

function main() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    var wheelRadius = 2.5;
    var pipeDiameter = 0.15;
    var spiralCoils = 6.38;

    var peopleImg = document.getElementById("people-img");

    var recommendedSpiralCoilsNode = document.createTextNode('');
    var pipeLengthNode = document.createTextNode('');
    var pipeVolumeNode = document.createTextNode('');

    var update = function () {
        // Calculate the points of the spiral:
        var points = calcSpiralPoints(wheelRadius, spiralCoils);
        console.log(points.length);

        // Calculate the results:
        recommendedSpiralCoilsNode.nodeValue = (wheelRadius / pipeDiameter).toFixed(3);

        var pipeLength = calcLength(points);
        pipeLengthNode.nodeValue = pipeLength.toFixed(2);

        // Cylinder volume formula:
        // V = pi * r^2 * h
        // Result is in cubic meters
        var pipeVolume = Math.PI * ((pipeDiameter / 2) * (pipeDiameter / 2)) * pipeLength;

        // 1 cubic meter = 1000 liters
        var pipeVolumeLiters = pipeVolume * 1000;
        pipeVolumeNode.nodeValue = pipeVolumeLiters.toFixed(2);

        // Visualization:

        var scaleFactor = canvas.width * 0.45 / wheelRadius;

        // Draw the pipe:
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // drawPipe(ctx, [canvas.width / 2, canvas.height / 2], points, pipeDiameter, scaleFactor);

        drawPoints(ctx, [canvas.width / 2, canvas.height / 2], points, leds, scaleFactor);

        // Red wheel radius line
        ctx.strokeStyle = "rgb(255, 0, 0)";
        ctx.beginPath();
        ctx.moveTo((-wheelRadius * 1.08) * scaleFactor + canvas.width / 2, 0 * scaleFactor + canvas.height / 2);
        ctx.lineTo((-wheelRadius * 1.08) * scaleFactor + canvas.width / 2, (wheelRadius) * scaleFactor + canvas.height / 2);
        ctx.stroke();

        // Adjust people pos + scaling
        var peopleImgNaturalHeight = 1.77; // Average height of male human
        peopleImg.style.top = "" + ((wheelRadius - peopleImgNaturalHeight) * scaleFactor + canvas.height / 2) + "px";
        peopleImg.style.height = "" + (scaleFactor * peopleImgNaturalHeight) + "px";

        var frameTick = function() {
            loop();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPoints(ctx, [canvas.width / 2, canvas.height / 2], points, leds, scaleFactor);
            requestAnimationFrame(frameTick);
        };
        requestAnimationFrame(frameTick);
    };

    // Create our control panel:

    var elem = document.getElementById("control-panel");
    addInput(elem, "Wheel Radius (meters)", wheelRadius, 0.1, 10, function (val) {
        wheelRadius = val;
        update();
    });

    addInput(elem, "Pipe Diameter (meters)", pipeDiameter, 0.01, 1, function (val) {
        pipeDiameter = val;
        update();
    });
    addInput(elem, "Spiral Coils", spiralCoils, 0.1, 50, function (val) {
        spiralCoils = val;
        update();
    });

    addResult(elem, "Max Spiral Coils", recommendedSpiralCoilsNode);
    addResult(elem, "Pipe Length (meters)", pipeLengthNode);
    addResult(elem, "Pipe volume (liters)", pipeVolumeNode);

    // Trigger an update for the initial (default) values:
    update();
}

function addInput(contElem, label, initialValue, min, max, callback) {
    var elem = document.createElement("div");
    elem.className = "control-row";

    var labelElem = document.createElement("span");
    labelElem.className = "control-label";
    labelElem.appendChild(document.createTextNode(label + ":"));
    elem.appendChild(labelElem);

    var textInput = document.createElement("input");
    textInput.className = "control-input";
    textInput.type = "number";
    textInput.min = min;
    textInput.max = max;
    textInput.value = initialValue;
    textInput.addEventListener('input', function (e) {
        var val = parseFloat(textInput.value);
        if (!isNaN(val)) {
            rangeInput.value = val;
            callback(val);
        }
    });
    elem.appendChild(textInput);

    elem.appendChild(document.createElement("br"));

    var rangeInput = document.createElement("input");
    rangeInput.className = "control-range";
    rangeInput.type = "range";
    rangeInput.min = min;
    rangeInput.max = max;
    rangeInput.step = 0.001;
    rangeInput.value = initialValue;
    rangeInput.addEventListener('input', function (e) {
        var val = parseFloat(rangeInput.value);
        if (!isNaN(val)) {
            textInput.value = val;
            callback(val);
        }
    });
    elem.appendChild(rangeInput);

    contElem.appendChild(elem);
}

function addResult(contElem, label, resultTextNode) {
    var elem = document.createElement("div");
    elem.className = "control-row";

    var labelElem = document.createElement("span");
    labelElem.appendChild(document.createTextNode(label + ": "));
    elem.appendChild(labelElem);
    var resultCont = document.createElement("b");
    resultCont.appendChild(resultTextNode);
    elem.appendChild(resultCont);

    contElem.appendChild(elem);
}

function calcSpiralPoints(radius, coils) {
    // Algorithm from:
    // <http://stackoverflow.com/questions/13894715/draw-equidistant-points-on-a-spiral/13901170#13901170>

    var result = [];

    // value of theta corresponding to end of last coil
    var thetaMax = coils * 2 * Math.PI;

    // How far to step away from center for each side.
    var awayStep = radius / thetaMax;

    // distance between points to plot
    var chord = 0.1;

    result.push([0, 0]);

    // For every side, step around and away from center.
    // start at the angle corresponding to a distance of chord
    // away from centre.
    var theta;
    for (theta = chord / awayStep; theta <= thetaMax;) {
        //
        // How far away from center
        var away = awayStep * theta;
        //
        // How far around the center.
        var around = theta + Math.PI / 2;
        //
        // Convert 'around' and 'away' to X and Y.
        var x = 0 + Math.cos(around) * away;
        var y = 0 + Math.sin(around) * away;
        //
        // Now that you know it, do it.
        result.push([x, y]);

        // to a first approximation, the points are on a circle
        // so the angle between them is chord/radius
        theta += chord / away;
    }
    return result;
}

function testPoints() {
    return [
        [-1, 0],
        [0.5, 0],
        [1, 0.1],
        [1.5, 0.1],
        [1.9, 0.4],
        [1, 1.5]
    ];
}

function calcLength(points) {
    var totalLength = 0;
    var length = points.length;
    var i;
    for (i = 1; i < length; ++i) {
        var p0 = points[i - 1];
        var p1 = points[i];

        var delta = [p1[0] - p0[0], p1[1] - p0[1]];
        var deltaLen = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);

        totalLength += deltaLen;
    }

    return totalLength;
}

/**
 * @param ctx canvas 2d context
 * @param offset pair of x, y values for adjusting the origin
 * @param array of x, y pairs
 * @param scaleFactor number
 * @return void
 */
function drawPipe(ctx, offset, points, pipeDiameter, scaleFactor) {
    // drawPipePoints(ctx, offset, points, scaleFactor);
    drawPipeInnerLine(ctx, offset, points, scaleFactor);
    drawPipeRibs(ctx, offset, points, pipeDiameter, scaleFactor);
    drawPipeContour(ctx, offset, points, pipeDiameter, scaleFactor);
}

function drawPoints(ctx, offset, points, pixels, scaleFactor) {
    drawPipePoints(ctx, offset, points, pixels, scaleFactor);
}

function drawPipePoints(ctx, offset, points, pixels, scaleFactor) {
    var length = points.length;
    var i;
    for (i = 0; i < length; ++i) {
        var p = points[i];

        var x = p[0] * scaleFactor + offset[0];
        var y = p[1] * scaleFactor + offset[1];

        ctx.fillStyle = "rgb(" + pixels[pixels.length-1-i][0] + "," + pixels[pixels.length-1-i][1] + "," + pixels[pixels.length-1-i][2] + ")";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawPipeInnerLine(ctx, offset, points, scaleFactor) {
    ctx.strokeStyle = "rgb(230, 230, 230)";

    ctx.beginPath();

    var p0 = points[0];

    var x = p0[0] * scaleFactor + offset[0];
    var y = p0[1] * scaleFactor + offset[1];
    ctx.moveTo(x, y);

    var length = points.length;
    var i;

    for (i = 1; i < length; ++i) {
        var p = points[i];

        var x = p[0] * scaleFactor + offset[0];
        var y = p[1] * scaleFactor + offset[1];

        ctx.lineTo(x, y);
    }

    ctx.stroke();
}

function drawPipeRibs(ctx, offset, points, pipeDiameter, scaleFactor) {
    ctx.strokeStyle = "rgb(100, 150, 200)";

    var pipeRadius = pipeDiameter / 2;

    var length = points.length;
    var i;

    ctx.beginPath();
    for (i = 1; i < length; ++i) {
        var p0 = points[i - 1];
        var p1 = points[i];

        var c = [(p1[0] + p0[0]) / 2, (p1[1] + p0[1]) / 2];

        var delta = [p1[0] - p0[0], p1[1] - p0[1]];
        var deltaLen = Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1]);

        var ribDir = [-delta[1] / deltaLen * pipeRadius, delta[0] / deltaLen * pipeRadius];
        var r0 = [c[0] + ribDir[0], c[1] + ribDir[1]];
        var r1 = [c[0] - ribDir[0], c[1] - ribDir[1]];

        var x0 = r0[0] * scaleFactor + offset[0];
        var y0 = r0[1] * scaleFactor + offset[1];
        var x1 = r1[0] * scaleFactor + offset[0];
        var y1 = r1[1] * scaleFactor + offset[1];

        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
    }
    ctx.stroke();
}

function drawPipeContour(ctx, offset, points, pipeDiameter, scaleFactor) {
    ctx.strokeStyle = "rgb(0, 0, 0)";

    var pipeRadius = pipeDiameter / 2;

    var length = points.length;
    var i;

    ctx.beginPath();
    for (i = 2; i < length; ++i) {
        var p0 = points[i - 2];
        var p1 = points[i - 1];
        var p2 = points[i]

        // First rib:
        var s0_c = [(p1[0] + p0[0]) / 2, (p1[1] + p0[1]) / 2];

        var s0_delta = [p1[0] - p0[0], p1[1] - p0[1]];
        var s0_deltaLen = Math.sqrt(s0_delta[0] * s0_delta[0] + s0_delta[1] * s0_delta[1]);

        var s0_ribDir = [-s0_delta[1] / s0_deltaLen * pipeRadius, s0_delta[0] / s0_deltaLen * pipeRadius];
        var s0_r0 = [s0_c[0] + s0_ribDir[0], s0_c[1] + s0_ribDir[1]];
        var s0_r1 = [s0_c[0] - s0_ribDir[0], s0_c[1] - s0_ribDir[1]];

        // Second rib:
        var s1_c = [(p2[0] + p1[0]) / 2, (p2[1] + p1[1]) / 2];

        var s1_delta = [p2[0] - p1[0], p2[1] - p1[1]];
        var s1_deltaLen = Math.sqrt(s1_delta[0] * s1_delta[0] + s1_delta[1] * s1_delta[1]);

        var s1_ribDir = [-s1_delta[1] / s1_deltaLen * pipeRadius, s1_delta[0] / s1_deltaLen * pipeRadius];
        var s1_r0 = [s1_c[0] + s1_ribDir[0], s1_c[1] + s1_ribDir[1]];
        var s1_r1 = [s1_c[0] - s1_ribDir[0], s1_c[1] - s1_ribDir[1]];

        // Drawing points:
        var x0 = s0_r0[0] * scaleFactor + offset[0];
        var y0 = s0_r0[1] * scaleFactor + offset[1];
        var x1 = s1_r0[0] * scaleFactor + offset[0];
        var y1 = s1_r0[1] * scaleFactor + offset[1];
        var x2 = s0_r1[0] * scaleFactor + offset[0];
        var y2 = s0_r1[1] * scaleFactor + offset[1];
        var x3 = s1_r1[0] * scaleFactor + offset[0];
        var y3 = s1_r1[1] * scaleFactor + offset[1];

        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x3, y3);
    }
    ctx.stroke();
}

window.addEventListener('load', main);
