import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("2d");

    if (!gl) {
      return;
    }

    // Clear the canvas
    gl.fillStyle = "rgba(0, 0, 255, 1.0)";
    gl.fillRect(120, 10, 150, 150);
  }, []);
  return <canvas ref={canvasRef} width="800" height="1000"></canvas>;
}

export default App;
