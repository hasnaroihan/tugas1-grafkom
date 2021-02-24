var lines = [];
lines.push(generateLine(3));
lines.push(generateLine(5));

translateLine(lines[0],[1,0,0]);

var selectedLine = {
    index: 0,
    vIndex: 0,
}

function generateLine(sides, radius = 1) {
    let vertex =[];
    let color = [];
    let theta = (2 * Math.PI)/sides
    for (let i = 0; i < sides; i++) {
        let x = radius * Math.cos(i*theta);
        let y = radius * Math.sin(i * theta);
        vertex.push(x, y, 0);
        color.push(0.0, 1.0, 1.0);
    }
    return {
        vertex: vertex,
        color: color,
        sides: sides,
        anchor: [0.0, 0.0, 0.0],
        updateAnchor: function() {
            let sumX = 0;
            let sumY = 0;
            for (let i = 0; i < this.sides*3; i+=3) {
                sumX += this.vertex[i];
                sumY += this.vertex[i+1];
            }
            this.anchor[0] = sumX/this.sides;
            this.anchor[1] = sumY/this.sides;
        }
    };
}

function translateVertex(vertex, matrix){
    vertex[0] += matrix[0];
    vertex[1] += matrix[1];
    vertex[2] += matrix[2];
}

function translateLine(line, matrix) {
    for (let i = 0; i < line.sides*3; i += 3) {
        line.vertex[i] += matrix[0];
        line.vertex[i+1] += matrix[1];
        line.vertex[i+2] += matrix[2];
    }
}

function rotateLine(line, angle) {
    let invertTS = line.anchor.map(x => x * -1);
    translateLine(line, invertTS);
    let sinVal = Math.sin(angle);
    let cosVal = Math.cos(angle);
    for (let i = 0; i < line.sides*3; i += 3) {
        let x = line.vertex[i];
        let y = line.vertex[i+1];
        line.vertex[i] = x * cosVal - y * sinVal;
        line.vertex[i+1] = x * sinVal + y * cosVal;
    }
    translateLine(line, line.anchor);
}

function changeColor(line, color) {
    for (let i = 0; i < line.sides; i++) {
        line.color[i*3] = color[0];
        line.color[i*3+1] = color[1];
        line.color[i*3+2] = color[2];
    }
}

function nearestLineVertex(cursorX, cursorY) {
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < lines.length; i++) {
        const el = lines[i];
        for (let j = 0; j < el.sides; j++) {
            let x = el.vertex[j*3];
            let y = el.vertex[j*3+1];
            let manDis = Math.abs(cursorX-x) + Math.abs(cursorY-y);
            if (manDis < min) {
                min = manDis;
                selectedLine.index = i;
                selectedLine.vIndex = j;
            }
        }
    }
    return min;
}

function loadLineControl() {
    let dom = document.getElementById('line');
    dom.innerHTML = '<h3>Line</h3>'
    let i = 0;
    lines.forEach(pol => {
        dom.innerHTML += `<div>
            <label for="red-${i}">Merah</label>
            <input type="range" id="red-${i}" min="0" max="100" value="${pol.color[0]*100}" onmousemove="for (let j = 0; j < lines[${i}].sides; j++) {
                lines[${i}].color[j*3] = document.getElementById('red-${i}').value/100;;
            }"><br>
            <label for="green-${i}">Hijau</label>
            <input type="range" id="green-${i}" min="0" max="100" value="${pol.color[1]*100}" onmousemove="for (let j = 0; j < lines[${i}].sides; j++) {
                lines[${i}].color[j*3+1] = document.getElementById('green-${i}').value/100;;
            }"><br>
            <label for="blue-${i}">Biru</label>
            <input type="range" id="blue-${i}" min="0" max="100" value="${pol.color[2]*100}" onmousemove="for (let j = 0; j < lines[${i}].sides; j++) {
                lines[${i}].color[j*3+2] = document.getElementById('blue-${i}').value/100;;
            }"><br>
            <label for="angle-${i}">Sudut (derajat):</label>
            <input type="number" id="angle-${i}" name="sides" min="0" max="360" value="0">
            <button onclick="rotateLine(lines[${i}],document.getElementById('angle-${i}').value*2*Math.PI/360)">rotate</button>
            <button onclick="lines.splice(${i},1);loadLineControl();">delete</button>
            <hr>
        </div>`
        i++;
    });

    dom.innerHTML += `
    <label for="vertex">Jumlah titik:</label>
    <input type="number" id="vertex" name="sides" min="2" value="2">
    <button onclick="lines.push(generateLine(document.getElementById('vertex').value)); loadLineControl();">Add Line</button>
    `
}

loadLineControl()