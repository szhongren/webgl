var logged = 0;
class TransformMatrix4 {
  elements: Float32Array;

  constructor(elements?: Float32Array) {
    this.elements = new Float32Array(16);
    if (typeof elements !== "undefined") {
      this.elements = new Float32Array(elements);
    } else {
      this.setIdentity();
    }
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

  addTranslate(x: number, y: number, z: number) {
    var translationMatrix = new TransformMatrix4().setTranslate(x, y, z);
    this.elements = translationMatrix.multiply(this).elements;
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

  addRotate(angle: number, x: number, y: number, z: number) {
    var rotationMatrix = new TransformMatrix4().setRotate(angle, x, y, z);
    this.elements = rotationMatrix.multiply(this).elements;
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

  addScale(x: number, y: number, z: number) {
    var scaleMatrix = new TransformMatrix4().setScale(x, y, z);
    this.elements = scaleMatrix.multiply(this).elements;
    return this;
  }

  setLookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    upX: number,
    upY: number,
    upZ: number
  ) {
    let e,
      forwardX,
      forwardY,
      forwardZ,
      forwardNormalizationFactor,
      rightX,
      rightY,
      rightZ,
      rightNormalizationFactor,
      newUpX,
      newUpY,
      newUpZ;

    // forward = normalize(center - eye)
    forwardX = centerX - eyeX;
    forwardY = centerY - eyeY;
    forwardZ = centerZ - eyeZ;

    forwardNormalizationFactor =
      1 /
      Math.sqrt(
        forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ
      );
    forwardX *= forwardNormalizationFactor;
    forwardY *= forwardNormalizationFactor;
    forwardZ *= forwardNormalizationFactor;

    // right = normalize(cross(forward, up))
    rightX = forwardY * upZ - forwardZ * upY;
    rightY = forwardZ * upX - forwardX * upZ;
    rightZ = forwardX * upY - forwardY * upX;

    rightNormalizationFactor =
      1 / Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ);
    rightX *= rightNormalizationFactor;
    rightY *= rightNormalizationFactor;
    rightZ *= rightNormalizationFactor;

    // up = cross(right, forward), right is already normalized
    newUpX = rightY * forwardZ - rightZ * forwardY;
    newUpY = rightZ * forwardX - rightX * forwardZ;
    newUpZ = rightX * forwardY - rightY * forwardX;

    e = this.elements;
    e[0] = rightX;
    e[1] = newUpX;
    e[2] = -forwardX;
    e[3] = 0;

    e[4] = rightY;
    e[5] = newUpY;
    e[6] = -forwardY;
    e[7] = 0;

    e[8] = rightZ;
    e[9] = newUpZ;
    e[10] = -forwardZ;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    return this.addTranslate(-eyeX, -eyeY, -eyeZ);
  }

  addLookAt(
    eyeX: number,
    eyeY: number,
    eyeZ: number,
    centerX: number,
    centerY: number,
    centerZ: number,
    upX: number,
    upY: number,
    upZ: number
  ) {
    var lookAtMatrix = new TransformMatrix4().setLookAt(
      eyeX,
      eyeY,
      eyeZ,
      centerX,
      centerY,
      centerZ,
      upX,
      upY,
      upZ
    );
    this.elements = lookAtMatrix.multiply(this).elements;
    return this;
  }

  multiply(other: TransformMatrix4, debug?: boolean) {
    // matrix multiplication is the same as composition, but composing a after b means b * a * point
    if (typeof debug !== "undefined" && debug) {
      console.log(this.display());
      console.log("*");
      console.log(other.display());
    }
    this.elements = new Float32Array([
      this.elements[0] * other.elements[0] +
        this.elements[4] * other.elements[1] +
        this.elements[8] * other.elements[2] +
        this.elements[12] * other.elements[3],
      this.elements[1] * other.elements[0] +
        this.elements[5] * other.elements[1] +
        this.elements[9] * other.elements[2] +
        this.elements[13] * other.elements[3],
      this.elements[2] * other.elements[0] +
        this.elements[6] * other.elements[1] +
        this.elements[10] * other.elements[2] +
        this.elements[14] * other.elements[3],
      this.elements[3] * other.elements[0] +
        this.elements[7] * other.elements[1] +
        this.elements[11] * other.elements[2] +
        this.elements[15] * other.elements[3],
      //
      this.elements[0] * other.elements[4] +
        this.elements[4] * other.elements[5] +
        this.elements[8] * other.elements[6] +
        this.elements[12] * other.elements[7],
      this.elements[1] * other.elements[4] +
        this.elements[5] * other.elements[5] +
        this.elements[9] * other.elements[6] +
        this.elements[13] * other.elements[7],
      this.elements[2] * other.elements[4] +
        this.elements[6] * other.elements[5] +
        this.elements[10] * other.elements[6] +
        this.elements[14] * other.elements[7],
      this.elements[3] * other.elements[4] +
        this.elements[7] * other.elements[5] +
        this.elements[11] * other.elements[6] +
        this.elements[15] * other.elements[7],
      //
      this.elements[0] * other.elements[8] +
        this.elements[4] * other.elements[9] +
        this.elements[8] * other.elements[10] +
        this.elements[12] * other.elements[11],
      this.elements[1] * other.elements[8] +
        this.elements[5] * other.elements[9] +
        this.elements[9] * other.elements[10] +
        this.elements[13] * other.elements[11],
      this.elements[2] * other.elements[8] +
        this.elements[6] * other.elements[9] +
        this.elements[10] * other.elements[10] +
        this.elements[14] * other.elements[11],
      this.elements[3] * other.elements[8] +
        this.elements[7] * other.elements[9] +
        this.elements[11] * other.elements[10] +
        this.elements[15] * other.elements[11],
      //
      this.elements[0] * other.elements[12] +
        this.elements[4] * other.elements[13] +
        this.elements[8] * other.elements[14] +
        this.elements[12] * other.elements[15],
      this.elements[1] * other.elements[12] +
        this.elements[5] * other.elements[13] +
        this.elements[9] * other.elements[14] +
        this.elements[13] * other.elements[15],
      this.elements[2] * other.elements[12] +
        this.elements[6] * other.elements[13] +
        this.elements[10] * other.elements[14] +
        this.elements[14] * other.elements[15],
      this.elements[3] * other.elements[12] +
        this.elements[7] * other.elements[13] +
        this.elements[11] * other.elements[14] +
        this.elements[15] * other.elements[15],
    ]);
    return this;
  }

  display() {
    return `${this.elements[0]} ${this.elements[4]} ${this.elements[8]} ${this.elements[12]}\n${this.elements[1]} ${this.elements[5]} ${this.elements[9]} ${this.elements[13]}\n${this.elements[2]} ${this.elements[6]} ${this.elements[10]} ${this.elements[14]}\n${this.elements[3]} ${this.elements[7]} ${this.elements[11]} ${this.elements[15]}`;
  }
}

export default TransformMatrix4;
