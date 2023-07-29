import TransformMatrix4 from "./matrix";

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var verticesAndTextureCoords = new Float32Array([
    -0.5, 0.5, -0.3, 1.7,
    //
    -0.5, -0.5, -0.3, -0.2,
    //
    0.5, 0.5, 1.7, 1.7,
    //
    0.5, -0.5, 1.7, -0.2,
  ]);
  var n = 4;

  // 1. create buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 2. bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3. write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndTextureCoords, gl.STATIC_DRAW);

  var FSIZE = verticesAndTextureCoords.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(program, "a_Position");
  // 4. assign buffer object to attribute variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  // 5. enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  var a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
}

export default initVertexBuffers;
