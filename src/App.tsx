import { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/clickedPoints/fragmentShader.frag";
import vertShader from "./shaders/clickedPoints/vertexShader.vert";

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("An error occurred creating the shaders");
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders:",
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    console.error("An error occurred creating the program");
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program:",
      gl.getProgramInfoLog(program)
    );
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

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

  // Set up shader program here

  return program;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadShadersAndDraw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log("Canvas is not available.");
        return;
      }
      const gl = canvas.getContext("webgl2");

      if (!gl) {
        console.log("WebGL2 is not available.");
        return;
      }

      const program = await initShaders(gl, vertShader, fragShader);

      if (!program) {
        console.log("Failed to initialize shaders.");
        return;
      }

      var a_Position = gl.getAttribLocation(program, "a_Position");
      var a_PointSize = gl.getAttribLocation(program, "a_PointSize");
      canvas.onmousedown = (handler) => {
        click(handler, gl, canvas, a_Position);
      };
      gl.vertexAttrib1f(a_PointSize, 2.0);
      gl.clearColor(0.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
    };
    loadShadersAndDraw();
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="1000"
      style={{ margin: "10px" }}
      // style={{ border: "10px solid black" }}
      // style={{ padding: "10px" }}
    ></canvas>
  );
}

var g_points: number[][] = [];
function click(
  handler: any,
  gl: any,
  canvas: HTMLCanvasElement,
  a_Position: any
) {
  // get raw xy from top left of browser window
  const viewportX = handler.clientX;
  const viewportY = handler.clientY;
  const rect = handler.target.getBoundingClientRect();

  // handles margin only
  const webglX =
    (viewportX - rect.left - canvas.width / 2) / (canvas.width / 2);

  const webglY =
    -(viewportY - rect.top - canvas.height / 2) / (canvas.height / 2);

  g_points.push([webglX, webglY]);

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (const point of g_points) {
    gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
export default App;
