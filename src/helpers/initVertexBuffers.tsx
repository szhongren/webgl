var ANGLE = 90.0;

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  var n = vertices.length / 2;

  // 1. create buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 2. bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3. write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(program, "a_Position");
  // 4. assign buffer object to attribute variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 5. enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var radian = (Math.PI * ANGLE) / 180.0; // Convert to radians
  var cosB = Math.cos(radian);
  var sinB = Math.sin(radian);

  // colum major order, each column down first, then across
  var transformMatrix = new Float32Array([
    cosB,
    sinB,
    0.0,
    0.0,
    //
    -sinB,
    cosB,
    0.0,
    0.0,
    //
    0.0,
    0.0,
    1.0,
    0.0,
    //
    0.0,
    0.0,
    0.0,
    1.0,
  ]);

  var u_TransformMatrix = gl.getUniformLocation(program, "u_TransformMatrix");
  gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix);

  return n;
}

export default initVertexBuffers;
