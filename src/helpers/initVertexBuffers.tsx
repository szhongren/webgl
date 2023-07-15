import TransformMatrix4 from "./matrix";

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

  var transformMatrix = new TransformMatrix4();
  transformMatrix.setRotate(90, 0, 0, 1);

  console.log(transformMatrix.multiply(new TransformMatrix4()).display());
  var u_TransformMatrix = gl.getUniformLocation(program, "u_TransformMatrix");
  gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix.elements);

  return n;
}

export default initVertexBuffers;
