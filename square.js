var squares = [];

squares.push(generateSquare(2));
squares[0].translate([1,1,0]);

var selectedSquare = 0

function generateSquare(radius) {
    return {
        side: radius,
        anchor: [0.0, 0.0, 0.0],
        color: [0,1,1,
            0,1,1,
            0,1,1,
            0,1,1],
        vertex: function() {
            return [this.anchor[0]+this.side/2,this.anchor[1]+this.side/2, 0,
            this.anchor[0]-this.side/2,this.anchor[1]+this.side/2, 0,
            this.anchor[0]+this.side/2,this.anchor[1]-this.side/2, 0,
            this.anchor[0]-this.side/2,this.anchor[1]-this.side/2, 0]
        },
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
    let dom = document.getElementById('square');
    dom.innerHTML = '<h3>Square</h3>'
    let i = 0;
    squares.forEach(pol => {
        dom.innerHTML += `<div>
            <label for="reds-${i}">Merah</label>
            <input type="range" id="reds-${i}" min="0" max="100" value="${pol.color[0]*100}" onmousemove="for (let j = 0; j < 4; j++) {
                squares[${i}].color[j*3] = document.getElementById('reds-${i}').value/100;;
            }"><br>
            <label for="greens-${i}">Hijau</label>
            <input type="range" id="greens-${i}" min="0" max="100" value="${pol.color[1]*100}" onmousemove="for (let j = 0; j < 4; j++) {
                squares[${i}].color[j*3+1] = document.getElementById('greens-${i}').value/100;;
            }"><br>
            <label for="blues-${i}">Biru</label>
            <input type="range" id="blues-${i}" min="0" max="100" value="${pol.color[2]*100}" onmousemove="for (let j = 0; j < 4; j++) {
                squares[${i}].color[j*3+2] = document.getElementById('blues-${i}').value/100;;
            }"><br>
            <label>Panjang sisi:</label>
            <input type="number" name="sides" min="0.1" value="1" step="0.01" onchange="squares[${i}].side = this.value">
            <hr>
        </div>`
        i++;
    });

    dom.innerHTML += `
    <label for="sidess">Panjang sisi:</label>
    <input type="number" id="sidess" name="sides" min="0.1" value="1" step="0.01">
    <button onclick="squares.push(generateSquare(document.getElementById('sidess').value)); loadSquareControl();">Add Square</button>
    `
}

loadSquareControl()