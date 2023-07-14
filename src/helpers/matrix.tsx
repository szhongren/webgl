class TransformMatrix4 {
  elements: Float32Array;

  constructor() {
    this.elements = new Float32Array(16);
    this.setIdentity();
  }

  set(src: TransformMatrix4) {
    this.elements = new Float32Array(src.elements);
    return this;
  }

  setIdentity() {
    this.elements = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      //
      0.0, 1.0, 0.0, 0.0,
      //
      0.0, 0.0, 1.0, 0.0,
      //
      0.0, 0.0, 0.0, 1.0,
    ]);
    return this;
  }

  setTranslate(x: number, y: number, z: number) {
    this.elements = new Float32Array([
      1.0,
      0.0,
      0.0,
      0.0,
      //
      0.0,
      1.0,
      0.0,
      0.0,
      //
      0.0,
      0.0,
      1.0,
      0.0,
      //
      x,
      y,
      z,
      1.0,
    ]);
    return this;
  }

  setRotate(angle: number, x: number, y: number, z: number) {
    var radian = (Math.PI * angle) / 180.0; // Convert to radians
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    if (x !== 0 && y === 0 && z === 0) {
      if (x < 0) {
        sinB = -sinB;
      }
      this.elements = new Float32Array([
        1.0,
        0.0,
        0.0,
        0.0,
        //
        0.0,
        cosB,
        sinB,
        0.0,
        //
        0.0,
        -sinB,
        cosB,
        0.0,
        //
        0.0,
        0.0,
        0.0,
        1.0,
      ]);
    } else if (x === 0 && y !== 0 && z === 0) {
      if (y < 0) {
        sinB = -sinB;
      }
      this.elements = new Float32Array([
        cosB,
        0.0,
        -sinB,
        0.0,
        //
        0.0,
        1.0,
        0.0,
        0.0,
        //
        sinB,
        0.0,
        cosB,
        0.0,
        //
        0.0,
        0.0,
        0.0,
        1.0,
      ]);
    } else if (x === 0 && y === 0 && z !== 0) {
      if (z < 0) {
        sinB = -sinB;
      }

      this.elements = new Float32Array([
        cosB,
        sinB,
        0.0,
        0.0,
        //
        -sinB,
        cosB,
        0.0,
        0.0,
        //
        0.0,
        0.0,
        1.0,
        0.0,
        //
        0.0,
        0.0,
        0.0,
        1.0,
      ]);
    } else {
      var len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        var rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
      }
      var cosBNot = 1 - cosB;
      var xy = x * y;
      var yz = y * z;
      var zx = z * x;
      var xSinB = x * sinB;
      var ySinB = y * sinB;
      var zSinB = z * sinB;

      this.elements = new Float32Array([
        x * x * cosBNot + cosB,
        xy * cosBNot + zSinB,
        zx * cosBNot - ySinB,
        0,
        //
        xy * cosBNot - zSinB,
        y * y * cosBNot + cosB,
        yz * cosBNot + xSinB,
        0,
        //
        zx * cosBNot + ySinB,
        yz * cosBNot - xSinB,
        z * z * cosBNot + cosB,
        0,
        //
        0,
        0,
        0,
        1,
      ]);
    }
    return this;
  }

  setScale(x: number, y: number, z: number) {
    this.elements = new Float32Array([
      x,
      0.0,
      0.0,
      0.0,
      //
      0.0,
      y,
      0.0,
      0.0,
      //
      0.0,
      0.0,
      z,
      0.0,
      //
      0.0,
      0.0,
      0.0,
      1.0,
    ]);
    return this;
  }

  addTranslate(x: number, y: number, z: number) {}

  addRotate(angle: number, x: number, y: number, z: number) {}

  addScale(x: number, y: number, z: number) {}

  private multiply(other: TransformMatrix4) {}
}

export default TransformMatrix4;
