var canvas = document.getElementById('canvas');

var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
 
if(!gl) {
  // ada masalah, entah tidak support WebGL atau masalah lainnya...
  alert('Inisiasi WebGL gagal');
}

createShader = function(shaderSource, shaderType) {
    // membuat objek WebGLShader dengan input type shader
    var glShader = gl.createShader(shaderType);
   
    // menentukan kode GLSL untuk shader
    gl.shaderSource(glShader, shaderSource);
   
    // kompilasi shader
      gl.compileShader(glShader);
   
      // periksa status kompilasi shader
      // jika kompilasi berhasil, lanjut ke langkah 8
      if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
        // kompilasi gagal. Dapatkan log info shader
        var infoLog = gl.getShaderInfoLog(glShader);
   
        // hapus shader
        gl.deleteShader(glShader);
        glShader = null;
   
        // lempar error
          throw Error('Error compile shader\r\n' + infoLog);
      }
   
      // kembalikan objek WebGLShader
    return glShader;
  }

// string kode source untuk vertex shader
var vshSrc = document.getElementById('shader-vertex').textContent;
// string kode source untuk fragment shader
var fshSrc = document.getElementById('shader-fragment').textContent;
 
// WebGLShader untuk vertex shader
var glVertexShader = createShader(vshSrc, gl.VERTEX_SHADER);
// WebGLShader untuk fragment shader
var glFragmentShader = createShader(fshSrc, gl.FRAGMENT_SHADER);

// membuat objek WebGLProgram
var glProgram = gl.createProgram();
// menentukan vertex dan fragment shader yang akan digunakan
gl.attachShader(glProgram, glVertexShader);
gl.attachShader(glProgram, glFragmentShader);

// link program
gl.linkProgram(glProgram);
// check status link
if(!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
  // link gagal, dapatkan info log program
    var infoLog = gl.getProgramInfoLog(glProgram);
 
    // hapus program
    gl.deleteProgram(glProgram);
    glProgram = null;
 
    // lempar error
    throw Error('Could not initialize program\r\n' + infoLog);
}

var verticesCount = 5;
var line = generateLine(verticesCount);
// rotatePolygon(poligon,Math.PI/6);
var dataVertex = new Float32Array(line.vertex);
var dataColor = new Float32Array(line.color);

// membuat objeck WebGLBuffer
var vertex_buffer = gl.createBuffer();

// membuat objeck WebGLBuffer
var color_buffer = gl.createBuffer();


/*===========associating attributes to vertex shader ============*/

var Pmatrix = gl.getUniformLocation(glProgram, "Pmatrix");
var Vmatrix = gl.getUniformLocation(glProgram, "Vmatrix");
var Mmatrix = gl.getUniformLocation(glProgram, "Mmatrix");

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// setting data WebGLBuffer menggunakan ArrayBufferView
gl.bufferData(gl.ARRAY_BUFFER, dataVertex, gl.STATIC_DRAW)
var position = gl.getAttribLocation(glProgram, "position");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ; //position
gl.enableVertexAttribArray(position);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
// setting data WebGLBuffer menggunakan ArrayBufferView
gl.bufferData(gl.ARRAY_BUFFER, dataColor, gl.STATIC_DRAW);
var color = gl.getAttribLocation(glProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ; //color
gl.enableVertexAttribArray(color);
gl.useProgram(glProgram);

/*========================= MATRIX ========================= */

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

//translating z
view_matrix[14] = view_matrix[14]-6; //zoom

function translateView(dx, dy) {
    mov_matrix[12] += dx;
    mov_matrix[13] -= dy;
}

/*=======================rotation========================*/
function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8]; 

    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];
    m[1] = c*m[1]+s*mv0;
    m[5] = c*m[5]+s*mv4;
    m[9] = c*m[9]+s*mv8;
}

////////////// MOuse Interaction //////////////////////
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
        // console.log(cursorX+','+cursorY);
        invView = inverse(view_matrix);
        invProj = inverse(proj_matrix);
        invMov = inverse(mov_matrix);
        realPos = mul(mul(mul(invMov,invView),invProj),[cursorX, cursorY, 0, 0])
        // console.log(realPos)
        nearestVertex(realPos[0], -realPos[1]);
        oldCursorX = cursorX;
        oldCursorY = cursorY;
    }
    return false;
};

var mouseUp = function(e){
    // drag = false;
    move = false;
    lines[selectedLine.index].updateAnchor();
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
        cursorX = -(x - rect.width/2)*scale*2/rect.width;
        cursorY = -(y - rect.height/2)*scale*2/rect.height;
        realPos = mul(mul(mul(invMov,invView),invProj),[cursorX , cursorY , 4, -scale])
        lines[selectedLine.index].vertex[selectedLine.vIndex*3] = realPos[0];
        lines[selectedLine.index].vertex[selectedLine.vIndex*3+1] = - realPos[1];
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

/*=================Drawing===========================*/

var time_old = 0;
var animate = function(time) {
    // var dt = time-time_old;
    // rotateZ(mov_matrix, dt*0.002);
    // time_old = time;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

    lines.forEach(el => {
        dataVertex = new Float32Array(el.vertex);
        dataColor = new Float32Array(el.color);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        // setting data WebGLBuffer menggunakan ArrayBufferView
        gl.bufferData(gl.ARRAY_BUFFER, dataVertex, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        // setting data WebGLBuffer menggunakan ArrayBufferView
        gl.bufferData(gl.ARRAY_BUFFER, dataColor, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.drawArrays(gl.LINES, 0, el.sides);
    });
    window.requestAnimationFrame(animate);
}
animate(0);