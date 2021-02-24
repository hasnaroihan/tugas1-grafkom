var squares = [];

squares.push(generateSquare(2));
squares[0].translate([1,1,0]);

var selectedSquare = 0

function generateSquare(radius) {
    return {
        side: radius,
        anchor: [0.0, 0.0, 0.0],
        vertex: function() {
            return [this.anchor[0]+this.side/2,this.anchor[1]+this.side/2, 0,
            this.anchor[0]-this.side/2,this.anchor[1]+this.side/2, 0,
            this.anchor[0]+this.side/2,this.anchor[1]-this.side/2, 0,
            this.anchor[0]-this.side/2,this.anchor[1]-this.side/2, 0]
        },
        color: [0,1,1,
            0,1,1,
            0,1,1,
            0,1,1],
        translate: function(matrix) {
            this.anchor[0] += matrix[0];
            this.anchor[1] += matrix[1];
            this.anchor[2] += matrix[2];
        },
        changeColor: function(matrix) {
            if (matrix.length == 3) {
                let temp = []
                temp.concat(matrix);
                temp.concat(matrix);
                temp.concat(matrix);
                temp.concat(matrix);
                this.color = temp;
            }
            else{
                this.color = matrix;
            }
        },
    };
}

function nearestAnchor(cursorX, cursorY) {
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < squares.length; i++) {
        const el = squares[i];
        let x = el.anchor[0];
        let y = el.anchor[1];
        let manhatanDistance = Math.abs(x-cursorX)+Math.abs(y-cursorY);
        if (manhatanDistance<min) {
            selectedSquare = i;
            min = manhatanDistance;
        }
    }
    return min;
}

function loadSquareControl() {
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

// loadSquareControl()