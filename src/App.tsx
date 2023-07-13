import React, { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/helloTriangle/fragmentShader.frag";
import vertShader from "./shaders/helloTriangle/vertexShader.vert";

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

  return program;
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
  var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(program, "a_Position");
  // 4. assign buffer object to attribute variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 5. enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
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

      var n = initVertexBuffers(gl, program);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.drawArrays(gl.TRIANGLES, 0, n);
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
