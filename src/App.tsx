import { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/lookAtTrianglesWithKeys/fragmentShader.frag";
import vertShader from "./shaders/lookAtTrianglesWithKeys/vertexShader.vert";
import initShaders from "./helpers/initShaders";
import initVertexBuffers from "./helpers/initVertexBuffers";
import TransformMatrix4 from "./helpers/matrix";

var g_last = Date.now();
var currentAngle = 0.0;
const ANGLE_STEP = 90.0;

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

      gl.useProgram(program);

      var n = initVertexBuffers(gl, program);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      var u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");

      var viewMatrix = new TransformMatrix4().setLookAt(
        g_eyeX,
        g_eyeY,
        g_eyeZ,
        0,
        0,
        0,
        0,
        1,
        0
      );
      document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
      };

      gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, n);
    };
    loadShadersAndDraw();
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width="1000"
      height="1000"
      style={{ margin: "10px" }}
      // style={{ border: "10px solid black" }}
      // style={{ padding: "10px" }}
    ></canvas>
  );
}

function draw(
  gl: WebGLRenderingContext,
  n: number,
  matrix: TransformMatrix4,
  u_Matrix: WebGLUniformLocation | null
) {
  // set the eye point and line of sight
  matrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // pass the view matrix to the variable u_ViewMatrix
  gl.uniformMatrix4fv(u_Matrix, false, matrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function animate(angle: number) {
  var now = Date.now();
  var time_passed_s = (now - g_last) / 1000.0;
  g_last = now;
  var newAngle = angle + ANGLE_STEP * time_passed_s;
  return newAngle % 360;
}

var g_eyeX = 0.2,
  g_eyeY = 0.25,
  g_eyeZ = 0.25; // Eye position
function keydown(
  ev: KeyboardEvent,
  gl: WebGL2RenderingContext,
  n: number,
  u_ViewMatrix: WebGLUniformLocation | null,
  viewMatrix: TransformMatrix4
) {
  if (ev.code === "ArrowUp") {
    g_eyeY += 0.01;
  } else if (ev.code === "ArrowDown") {
    g_eyeY -= 0.01;
  } else if (ev.code === "ArrowRight") {
    g_eyeX += 0.01;
  } else if (ev.code === "ArrowLeft") {
    g_eyeX -= 0.01;
  } else {
    return;
  }
  draw(gl, n, viewMatrix, u_ViewMatrix);
}
export default App;
