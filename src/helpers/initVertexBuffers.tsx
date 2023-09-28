import TransformMatrix4 from "./matrix";

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var verticesAndColors = new Float32Array([
    // Three triangles on the right side
    0.75,
    1.0,
    -4.0,
    0.4,
    1.0,
    0.4, // The back green one
    0.25,
    -1.0,
    -4.0,
    0.4,
    1.0,
    0.4,
    1.25,
    -1.0,
    -4.0,
    1.0,
    0.4,
    0.4,

    //
    0.75,
    1.0,
    -2.0,
    1.0,
    1.0,
    0.4, // The middle yellow one
    0.25,
    -1.0,
    -2.0,
    1.0,
    1.0,
    0.4,
    1.25,
    -1.0,
    -2.0,
    1.0,
    0.4,
    0.4,

    //
    0.75,
    1.0,
    0.0,
    0.4,
    0.4,
    1.0, // The front blue one
    0.25,
    -1.0,
    0.0,
    0.4,
    0.4,
    1.0,
    1.25,
    -1.0,
    0.0,
    1.0,
    0.4,
    0.4,

    // Three triangles on the left side
    -0.75,
    1.0,
    -4.0,
    0.4,
    1.0,
    0.4, // The back green one
    -1.25,
    -1.0,
    -4.0,
    0.4,
    1.0,
    0.4,
    -0.25,
    -1.0,
    -4.0,
    1.0,
    0.4,
    0.4,

    //
    -0.75,
    1.0,
    -2.0,
    1.0,
    1.0,
    0.4, // The middle yellow one
    -1.25,
    -1.0,
    -2.0,
    1.0,
    1.0,
    0.4,
    -0.25,
    -1.0,
    -2.0,
    1.0,
    0.4,
    0.4,

    //
    -0.75,
    1.0,
    0.0,
    0.4,
    0.4,
    1.0, // The front blue one
    -1.25,
    -1.0,
    0.0,
    0.4,
    0.4,
    1.0,
    -0.25,
    -1.0,
    0.0,
    1.0,
    0.4,
    0.4,
  ]);
  var n = 18;

  // 1. create buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 2. bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3. write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndColors, gl.STATIC_DRAW);

  var FSIZE = verticesAndColors.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(program, "a_Position");
  // 4. assign buffer object to attribute variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  // 5. enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(program, "a_Color");
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

export default initVertexBuffers;
