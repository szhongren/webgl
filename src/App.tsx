import React, { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/coloredPoints/fragmentShader.frag";
import vertShader from "./shaders/coloredPoints/vertexShader.vert";

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
      var u_FragColor = gl.getUniformLocation(program, "u_FragColor");
      canvas.onmousedown = (event) => {
        click(event, gl, canvas, a_Position, u_FragColor);
      };
      gl.vertexAttrib1f(a_PointSize, 2.0);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
var g_colors: number[][] = [];
function click(
  event: MouseEvent,
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  a_Position: number,
  u_FragColor: WebGLUniformLocation | null
) {
  // get raw xy from top left of browser window
  const reactMouseEvent =
    event as unknown as React.MouseEvent<HTMLCanvasElement>;
  const viewportX = reactMouseEvent.clientX;
  const viewportY = reactMouseEvent.clientY;
  const rect = reactMouseEvent?.currentTarget.getBoundingClientRect();

  // handles margin only
  const webglX =
    (viewportX - rect.left - canvas.width / 2) / (canvas.width / 2);

  const webglY =
    -(viewportY - rect.top - canvas.height / 2) / (canvas.height / 2);

  g_points.push([webglX, webglY]);
  if (webglX >= 0.0 && webglY >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (webglX < 0.0 && webglY < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < g_points.length; i++) {
    const xy = g_points[i];
    const rgba = g_colors[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
export default App;
