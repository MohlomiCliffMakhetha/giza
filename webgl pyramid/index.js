var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

var vertices = [
    -1, -1, 1,
    1, -1, 1,
    0, 1, 0,

    -1, -1, -1,
    1, -1, -1,
    0, 1, 0,

    -1, -1, 1,
    -1, -1, -1,
    0, 1, 0,

    1, -1, 1,
    1, -1, -1,
    0, 1, 0,

    -1, -1, 1,
    -1, -1, -1,
    1, -1, -1,

    -1, -1, 1,
    1, -1, 1,
    1, -1, -1,
];

var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var colors = [
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    1, 0, 1,
    1, 0, 1,
    1, 0, 1,

    0, 1, 1,
    0, 1, 1,
    0, 1, 1,

    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
];

var color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

var texture = [
    0,0,
    1,0,
    1,1,

    0,0,
    1,0,
    1,1,

    0,0,
    1,0,
    1,1,

    0,0,
    1,0,
    1,1,
];

var texPoints_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texPoints_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);

var texture_buffer = gl.createTexture();
var image = new Image();
image.src = "img.png";
image.addEventListener('load', function () {
    gl.bindTexture(gl.TEXTURE_2D, texture_buffer);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // gl.generateMipmap(gl.TEXTURE_2D);
});

var vertCode = `
    float m;
    uniform float ang;
    attribute vec3 coord;
    attribute vec3 color;
    varying vec3 Vcolor;
    attribute vec2 texture;
    varying vec2 vtexture;
    void main(void) {
        float x = coord.x;
        float y = coord.y;
        float z = coord.z;
        m=x;
        x=m*cos(ang)-z*sin(ang);
        z=z*cos(ang)+m*sin(ang);
        /*m=y;
        y=m*cos(ang)-x*sin(ang);
        x=x*cos(ang)+m*sin(ang);*/
        gl_Position = vec4(x,y,z,3);
        Vcolor = color;
        vtexture=texture;
    }`;

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragCode = `
precision mediump float;
varying vec3 Vcolor;
varying vec2 vtexture;
uniform sampler2D fragsamper;
void main(void) {
    gl_FragColor = texture2D(fragsamper,vtexture);
}`;

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var coord = gl.getAttribLocation(shaderProgram, "coord");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
var color = gl.getAttribLocation(shaderProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);

gl.bindBuffer(gl.ARRAY_BUFFER, texPoints_buffer);
var Texture = gl.getAttribLocation(shaderProgram, "texture");
gl.vertexAttribPointer(Texture, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(Texture);

var ang = 0;
function draw() {
    //gl.clearColor(229/255, 184/255, 11/255, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

  

    ang += 0.005;
    gl.uniform1f(gl.getUniformLocation(shaderProgram, 'ang'), ang)
    window.requestAnimationFrame(draw);
}
draw();