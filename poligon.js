var poligons = [];
poligons.push(generatePolygon(3));
poligons.push(generatePolygon(5));

translatePolygon(poligons[0],[1,0,0]);

var selectedPoligon = {
    index: 0,
    vIndex: 0,
}

function generatePolygon(sides, radius = 1) {
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

function translatePolygon(polygon, matrix) {
    for (let i = 0; i < polygon.sides*3; i += 3) {
        polygon.vertex[i] += matrix[0];
        polygon.vertex[i+1] += matrix[1];
        polygon.vertex[i+2] += matrix[2];
    }
}

function rotatePolygon(polygon, angle) {
    let invertTS = polygon.anchor.map(x => x * -1);
    translatePolygon(polygon, invertTS);
    let sinVal = Math.sin(angle);
    let cosVal = Math.cos(angle);
    for (let i = 0; i < polygon.sides*3; i += 3) {
        let x = polygon.vertex[i];
        let y = polygon.vertex[i+1];
        polygon.vertex[i] = x * cosVal - y * sinVal;
        polygon.vertex[i+1] = x * sinVal + y * cosVal;
    }
    translatePolygon(polygon, polygon.anchor);
}

function changeColor(polygon, color) {
    for (let i = 0; i < polygon.sides; i++) {
        polygon.color[i*3] = color[0];
        polygon.color[i*3+1] = color[1];
        polygon.color[i*3+2] = color[2];
    }
}

function nearestVertex(cursorX, cursorY) {
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < poligons.length; i++) {
        const el = poligons[i];
        for (let j = 0; j < el.sides; j++) {
            let x = el.vertex[j*3];
            let y = el.vertex[j*3+1];
            let manDis = Math.abs(cursorX-x) + Math.abs(cursorY-y);
            if (manDis < min) {
                min = manDis;
                selectedPoligon.index = i;
                selectedPoligon.vIndex = j;
            }
        }
    }
    return min;
}

function loadPoligonControl() {
    let dom = document.getElementById('poligon');
    dom.innerHTML = '<h3>Poligon</h3>'
    let i = 0;
    poligons.forEach(pol => {
        dom.innerHTML += `<div>
            jumlah sisi: ${pol.sides}<br>
            <label for="red-${i}">Merah</label>
            <input type="range" id="red-${i}" min="0" max="100" value="${pol.color[0]*100}" onmousemove="for (let j = 0; j < poligons[${i}].sides; j++) {
                poligons[${i}].color[j*3] = document.getElementById('red-${i}').value/100;;
            }"><br>
            <label for="green-${i}">Hijau</label>
            <input type="range" id="green-${i}" min="0" max="100" value="${pol.color[1]*100}" onmousemove="for (let j = 0; j < poligons[${i}].sides; j++) {
                poligons[${i}].color[j*3+1] = document.getElementById('green-${i}').value/100;;
            }"><br>
            <label for="blue-${i}">Biru</label>
            <input type="range" id="blue-${i}" min="0" max="100" value="${pol.color[2]*100}" onmousemove="for (let j = 0; j < poligons[${i}].sides; j++) {
                poligons[${i}].color[j*3+2] = document.getElementById('blue-${i}').value/100;;
            }"><br>
            <label for="angle-${i}">Sudut (derajat):</label>
            <input type="number" id="angle-${i}" name="sides" min="0" max="360" value="0">
            <button onclick="rotatePolygon(poligons[${i}],document.getElementById('angle-${i}').value*2*Math.PI/360)">rotate</button><br>
            <label for="x-${i}">X :</label>
            <input type="number" id="x-${i}" name="sides" step="0.01" value="0">
            <label for="y-${i}">Y :</label>
            <input type="number" id="y-${i}" name="sides" step="0.01" value="0">
            <button onclick="translatePolygon(poligons[${i}],[parseFloat(document.getElementById('x-${i}').value), parseFloat(document.getElementById('y-${i}').value), 0])">translate</button><br>
            <button onclick="poligons.splice(${i},1);loadPoligonControl();">delete</button>
            <hr>
        </div>`
        i++;
    });

    dom.innerHTML += `
    <label for="sides">Jumlah sisi:</label>
    <input type="number" id="sides" name="sides" min="3" value="3">
    <button onclick="poligons.push(generatePolygon(document.getElementById('sides').value)); loadPoligonControl();">Add Polygon</button>
    `
}

loadPoligonControl()