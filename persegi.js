const canvas = document.getElementById("gl-canvas")
canvas.width = 500
canvas.height = 500
const gl = canvas.getContext('experimental-webgl')

if(!gl) {
    alert('Your browser does not support WebGL')
}

persegi(-0.5, 0.5)

/*function initiateSqr() {
    gl.clearColor(1,1,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    persegi(-0.5, 0.5)
}*/

const sqr = document.getElementById("transformscale")
sqr.onclick = () => {
    let x = document.getElementById("xscale").value
    let y = document.getElementById("yscale").value

    console.log(x)
    console.log(y)

    persegi(x,y)
}

function persegi(initSquare,x, y) {
    gl.clearColor(1,1,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const square = initSquare
    const scale_cor = [
        x, y
    ]

    var x_scale = scale_cor[0]/square[0]
    var y_scale = scale_cor[1]/square[1]

    const scale_mat = [
        x_scale, 0, 0,
        0, y_scale, 0,
        0, 0, 1
    ]

    const vertex = `attribute vec2 a_pos;
    uniform mat3 scale_matrix;
    
    void main() {
        vec2 pos = (scale_matrix * vec3(a_pos, 1)).xy;
    gl_Position = vec4(pos, 0, 1);
    }`
    const fragment = `precision mediump float;
    uniform vec4 u_fragColor;
    
    void main(){
        gl_FragColor = u_fragColor;
    }`

    const shaderProgram = createShaderProgram(gl, vertex, fragment)
    
    // Binding data to GL

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW)

    // Draw Square

    gl.useProgram(shaderProgram)
    const vertex_pos = gl.getAttribLocation(shaderProgram, 'a_pos')
    const frag_pos = gl.getUniformLocation(shaderProgram, 'u_fragColor')
    const scale_pos = gl.getUniformLocation(shaderProgram, 'scale_matrix')

    gl.vertexAttribPointer(vertex_pos, 2, gl.FLOAT, false, 0, 0)
    gl.uniform4fv(frag_pos, [1.0, 0.0, 0.0, 1.0])
    gl.uniformMatrix3fv(scale_pos, false, scale_mat)

    gl.enableVertexAttribArray(vertex_pos)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.length/2)
}

// Shader program below

function createShaderProgram(gl, vSource, fSource) {
    // Create vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vSource)
    gl.compileShader(vertexShader)

    // Create fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fSource)
    gl.compileShader(fragmentShader)

    // Create the shader program
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    return shaderProgram
}

/* --------------- MATRIX -------------------- */
function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
        0.5/ang, 0 , 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax+zMin)/(zMax-zMin), -1,
        0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
    ];
}

var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

/* --------------- MOUSE INTERACTION -------------------- */
var drag = false;
var move = false;
var old_x, old_y;
var dX = 0, dY = 0;
var scale = view_matrix[14];
var cursorX = 0, cursorY = 0;
var oldCursorX = 0, oldCursorY = 0;

var invView = inverse(view_matrix);
var invProj = inverse(proj_matrix);
var invMov = inverse(mov_matrix);
var realPos = mul(mul(mul(invProj,invView),invMov),[cursorX, -cursorY, 0, 1])



var mouseDown = function(e) {
    // if (e.which == 2) {
    //     drag = true;
    //     old_x = e.pageX, old_y = e.pageY;
    //     e.preventDefault();
    //     return false;
    // }
    if (e.which == 1) {
        move = true;

        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        cursorX = -(x - rect.width/2)*scale*2/rect.width;
        cursorY = -(y - rect.height/2)*scale*2/rect.height;
        console.log(cursorX+','+cursorY);
        invView = inverse(view_matrix);
        invProj = inverse(proj_matrix);
        invMov = inverse(mov_matrix);
        realPos = mul(mul(mul(invMov,invView),invProj),[cursorX, cursorY, 0, 0])
        console.log(realPos)
        nearestVertex(realPos[0], -realPos[1]);
        oldCursorX = cursorX;
        oldCursorY = cursorY;
    }
    return false;
};

var mouseUp = function(e){
    // drag = false;
    move = false;
    poligons[selectedPoligon.index].updateAnchor();
    // translatePolygon(poligons[1],[cursorX - oldCursorX, - cursorY + oldCursorY,0])
    // dataVertex = new Float32Array(poligons[1].vertex);
    // dataColor = new Float32Array(poligons[1].color);
    
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // // setting data WebGLBuffer menggunakan ArrayBufferView
    // gl.bufferData(gl.ARRAY_BUFFER, dataVertex, gl.STATIC_DRAW)

    // gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // // setting data WebGLBuffer menggunakan ArrayBufferView
    // gl.bufferData(gl.ARRAY_BUFFER, dataColor, gl.STATIC_DRAW);
};

var mouseMove = function(e) {
    if (move) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        cursorX = -(x - rect.width/2);
        cursorY = -(y - rect.height/2);
        realPos = mul(mul(mul(invMov,invView),invProj),[cursorX , cursorY , 4, -scale])
        poligons[selectedPoligon.index].vertex[selectedPoligon.vIndex*3] = realPos[0];
        poligons[selectedPoligon.index].vertex[selectedPoligon.vIndex*3+1] = - realPos[1];
    }
    // else if (drag) {
    //     // dX = (e.pageX-old_x)*(-scale)*2/canvas.width,
    //     // dY = (e.pageY-old_y)*(-scale)*2/canvas.height;
    //     // translateView(dX, dY);
    //     // old_x = e.pageX, old_y = e.pageY;

    //     let rect = canvas.getBoundingClientRect();
    //     let x = e.clientX - rect.left;
    //     let y = e.clientY - rect.top;
    //     dX = -(x - old_x)*scale*2/rect.width;
    //     dY = -(y - old_y)*scale*2/rect.height;
    //     translateView(dX, dY);
    //     old_y = y, old_x = x;
    // }
    e.preventDefault();
};

var zoom = function(e) {
    e.preventDefault();
    scale -= (e.deltaY * -0.1);
    view_matrix[14] = scale;
    // rotatePolygon(poligon,e.deltaY*0.1);
    // dataVertex = new Float32Array(poligon.vertex)
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // setting data WebGLBuffer menggunakan ArrayBufferView
    // gl.bufferData(gl.ARRAY_BUFFER, dataVertex, gl.STATIC_DRAW)
    // gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ; //position
    // gl.enableVertexAttribArray(position);
}

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("wheel", zoom, false);


function inverse(A) {
    _A = A.slice();
    let temp,
    E = Array(16).fill(0);
   
    for (i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        E[i*4 + j] = 0;
        if (i == j)
          E[i*4+j] = 1;
      }
   
    for (let k = 0; k < 4; k++) {
      temp = _A[k*4 + k];
   
      for (let j = 0; j < 4; j++)
      {
        _A[k*4 + j] /= temp;
        E[k*4 + j] /= temp;
      }
   
      for (let i = k + 1; i < 4; i++)
      {
        temp = _A[i*4 + k];
   
        for (let j = 0; j < 4; j++)
        {
          _A[i*4 + j] -= _A[k*4 + j] * temp;
          E[i*4 + j] -= E[k*4 + j] * temp;
        }
      }
    }
   
    for (let k = 4 - 1; k > 0; k--)
    {
      for (let i = k - 1; i >= 0; i--)
      {
        temp = _A[i*4 + k];
   
        for (let j = 0; j < 4; j++)
        {
          _A[i*4 + j] -= _A[k*4 + j] * temp;
          E[i*4 + j] -= E[k*4 + j] * temp;
        }
      }
    }
   
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        _A[i*4 + j] = E[i*4 + j];
    return _A;
}

function mul(a,b) {
    if (b.length == 4) {
        let res = [0, 0, 0, 1];
        for (let i = 0; i < 4; i++) {
            res[i] = a[i] * b[0] + a[i+4] * b[1] + a[i+8] * b[2] + a[i+12] * b[3]
        }
        return res;
    }
    else{
        let res = Array(16);
        res.fill(0);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res[j*4+i] += a[i]*b[j*4] + b[j*4+1]*a[i+4] + b[j*4+2]*a[i+8] + b[j*4+3]*a[i+12];
            }
        }
        return res;
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
}