import TransformMatrix4 from "./matrix";

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var verticesAndSizes = new Float32Array([
    0.0, 0.3, 10.0, -0.3, -0.3, 20.0, 0.3, -0.3, 30.0,
  ]);
  var n = 3;

  // 1. create buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 2. bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3. write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndSizes, gl.STATIC_DRAW);

  var FSIZE = verticesAndSizes.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(program, "a_Position");
  // 4. assign buffer object to attribute variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  // 5. enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize);

  return n;
}

export default initVertexBuffers;
