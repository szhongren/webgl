import createShader from "./createShader";
import createProgram from "./createProgram";

async function initShaders(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): Promise<WebGLProgram | null> {
  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  ) as WebGLShader;
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  ) as WebGLShader;

  const program = createProgram(gl, vertexShader, fragmentShader);

  return program;
}

export default initShaders;
