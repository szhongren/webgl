import React from "react";

var g_points: number[][] = [];
var g_colors: number[][] = [];
function drawOnClick(
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
  if (webglX >= 0 && webglY >= 0) {
    g_colors.push([1, 0, 0, 1]);
  } else if (webglX < 0 && webglY < 0) {
    g_colors.push([0, 1, 0, 1]);
  } else {
    g_colors.push([1, 1, 1, 1]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < g_points.length; i++) {
    const xy = g_points[i];
    const rgba = g_colors[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

export default drawOnClick;
