import TransformMatrix4 from "./matrix";

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var vertices = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);
  var sizes = new Float32Array([10.0, 20.0, 30.0]);
  var n = vertices.length / 2;

  // 1. create buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  var sizeBuffer = gl.createBuffer();
  if (!sizeBuffer) {
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

  gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  var a_PointSize = gl.getAttribLocation(program, "a_PointSize");
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_PointSize);

  return n;
}

export default initVertexBuffers;
