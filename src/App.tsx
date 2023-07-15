import { useEffect, useRef } from "react";
import "./App.css";
import fragShader from "./shaders/rotatingTriangle/fragmentShader.frag";
import vertShader from "./shaders/rotatingTriangle/vertexShader.vert";
import initShaders from "./helpers/initShaders";
import initVertexBuffers from "./helpers/initVertexBuffers";
import TransformMatrix4 from "./helpers/matrix";
import { draw } from "./helpers/animation";

var g_last = Date.now();
const ANGLE_STEP = 25.0;

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
      var u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");

      var currentAngle = 0.0;
      var modelMatrix = new TransformMatrix4();

      var tick = function () {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
      };

      tick();
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

function animate(angle: number) {
  var now = Date.now();
  if (now === g_last) {
    return angle;
  }
  var time_passed_s = (now - g_last) / 1000.0;
  g_last = now;
  var newAngle = angle + ANGLE_STEP * time_passed_s;
  return newAngle % 360;
}

export default App;
