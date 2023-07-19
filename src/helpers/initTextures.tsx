function initTextures(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  n: number
) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  var u_Sampler = gl.getUniformLocation(program, "u_Sampler");

  var image = new Image();
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };
  image.src = "sky.jpg";
  return true;
}

function loadTexture(
  gl: WebGLRenderingContext,
  n: number,
  texture: WebGLTexture | null,
  u_Sampler: WebGLUniformLocation | null,
  image: HTMLImageElement
) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

export default initTextures;
