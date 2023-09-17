import { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/orthoView/fragmentShader.frag";
import vertShader from "./shaders/orthoView/vertexShader.vert";
import initShaders from "./helpers/initShaders";
import initVertexBuffers from "./helpers/initVertexBuffers";
import TransformMatrix4 from "./helpers/matrix";

var g_last = Date.now();
var currentAngle = 0.0;
const ANGLE_STEP = 90.0;
var g_eyeX = 0.2,
  g_eyeY = 0.25,
  g_eyeZ = 0.25; // Eye position
var g_near = 0.0,
  g_far = 0.5;

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
      const nearFar = document.getElementById("nearFar");

      if (!nearFar) {
        console.log("nearFar is not available.");
        return;
      }

      if (!gl) {
        console.log("WebGL2 is not available.");
        return;
      }

      const program = await initShaders(gl, vertShader, fragShader);

      if (!program) {
        console.log("Failed to initialize shaders.");
        return;
      }

      gl.useProgram(program);

      var n = initVertexBuffers(gl, program);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      var u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");

      var projMatrix = new TransformMatrix4();
      document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ProjMatrix, projMatrix, nearFar);
      };

      gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, n);
    };
    loadShadersAndDraw();
  }, []);
  return (
    <>
      <canvas
        ref={canvasRef}
        width="1000"
        height="1000"
        style={{ margin: "10px" }}
        // style={{ border: "10px solid black" }}
        // style={{ padding: "10px" }}
      ></canvas>
      <p id="nearFar">The near and far values are displayed here</p>
    </>
  );
}

function draw(
  gl: WebGLRenderingContext,
  n: number,
  matrix: TransformMatrix4,
  u_Matrix: WebGLUniformLocation | null,
  nearFar: HTMLElement
) {
  // set the orthographic projection matrix
  matrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

  // pass the view matrix to the variable u_ViewMatrix
  gl.uniformMatrix4fv(u_Matrix, false, matrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  nearFar.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far: ${
    Math.round(g_far * 100) / 100
  }`;

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function animate(angle: number) {
  var now = Date.now();
  var time_passed_s = (now - g_last) / 1000.0;
  g_last = now;
  var newAngle = angle + ANGLE_STEP * time_passed_s;
  return newAngle % 360;
}

function keydown(
  ev: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_ViewMatrix: WebGLUniformLocation | null,
  viewMatrix: TransformMatrix4,
  nearFar: HTMLElement
) {
  switch (ev.code) {
    case "ArrowUp":
      g_far += 0.01;
      break;
    case "ArrowDown":
      g_far -= 0.01;
      break;
    case "ArrowRight":
      g_near += 0.01;
      break;
    case "ArrowLeft":
      g_near -= 0.01;
      break;
    default:
      return;
  }
  draw(gl, n, viewMatrix, u_ViewMatrix, nearFar);
}
export default App;
