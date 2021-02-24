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