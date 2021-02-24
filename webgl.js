const canvas = document.getElementById("gl-canvas")
canvas.width = 500
canvas.height = 500
const gl = canvas.getContext('experimental-webgl')

var sqrbool = true

if(!gl) {
    alert('Your browser does not support WebGL')
}

gl.clearColor(1,1,1,1)
gl.clear(gl.COLOR_BUFFER_BIT)

persegi(-0.5, 0.5)

const sqr = document.getElementById("transformscale")
sqr.onclick = () => {
    let x = document.getElementById("xscale").value
    let y = document.getElementById("yscale").value

    console.log(x)
    console.log(y)

    persegi(x,y)
}

function persegi(x, y) {
    gl.clearColor(1,1,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const square = [
        -0.5, 0.5,
    0.5, 0.5,
    -0.5, -0.5,
    0.5,  -0.5
    ]
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





