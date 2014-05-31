(function(TANK)
{
  "use strict";

  TANK.Math2D = TANK.Math2D || {};

  // ## Get the length of a vector
  //
  // `v` - An array in the form [x, y]
  //
  // `return` - The length of the vector
  TANK.Math2D.length = function(v)
  {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  };

  // ## Get the squared length of a vector (faster)
  //
  // `v` - An array in the form [x, y]
  //
  // `return` - The squared length of the vector
  TANK.Math2D.lengthSquared = function(v)
  {
    return v[0] * v[0] + v[1] * v[1];
  };

  // ## Dot two vectors
  //
  // `v1` - An array in the form [x, y]
  //
  // `v2` - An array in the form [x, y]
  //
  // `return` - A scalar representing the dot product
  TANK.Math2D.dot = function(v1, v2)
  {
    return v1[0] * v2[0] + v1[1] * v2[1];
  };

  // ## Cross two vectors
  //
  // `v1` - An array in the form [x, y]
  //
  // `v2` - An array in the form [x, y]
  //
  // `return` - The magnitude of the cross product of v1*v2
  TANK.Math2D.cross = function(v1, v2)
  {
    return v1[0] * v2[1] - v1[1] * v2[0];
  };

  // ## Add two vectors
  //
  // `v1` - An array in the form [x, y]
  //
  // `v2` - An array in the form [x, y]
  //
  // `return` - The resulting vector [x, y]
  TANK.Math2D.add = function(v1, v2)
  {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  };

  // ## Subtract two vectors
  //
  // `v1` - An array in the form [x, y]
  //
  // `v2` - An array in the form [x, y]
  //
  // `return` - The resulting vector v1 - v2 = [x, y]
  TANK.Math2D.subtract = function(v1, v2)
  {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  };

  // ## Scale a vector
  //
  // `v` - An array in the form [x, y]
  //
  // `s` - The scalar to multiply with the vector
  //
  // `return` - The resulting vector [x, y]
  TANK.Math2D.scale = function(v, s)
  {
    return [v[0] * s, v[1] * s];
  };

  // ## Rotate a vector
  //
  // `v` - An array in the form [x, y]
  //
  // `r` - Amount in radians to rotate the vector
  //
  // `return` - The resulting vector [x, y]
  TANK.Math2D.rotate = function(p, r)
  {
    return [p[0] * Math.cos(r) - p[1] * Math.sin(r), p[1] * Math.cos(r) + p[0] * Math.sin(r)];
  };

  // ## Project a vector
  //
  // `v1` - Vector to project onto v2
  //
  // `v2` - Vector to project v1 onto
  //
  // `return` - The resulting vector [x, y]
  TANK.Math2D.project = function(v1, v2)
  {
    return TANK.Math2D.scale(v2, TANK.Math2D.dot(v2, v1) / TANK.Math2D.lengthSquared(v2));
  };

  // ## Get distance between two points
  //
  // `p1` - An array in the form [x, y]
  //
  // `p2` - An array in the form [x, y]
  //
  // `return` - The scalar distance
  TANK.Math2D.pointDistancePoint = function(p1, p2)
  {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
  };

  // ## Test a point against an AABB
  // Test if a given point is inside a rectangle
  //
  // `point` - An array in the form [x, y]
  //
  // `center` - The center point of the rectangle in the form [x, y]
  //
  // `size` - The size of the rectangle in the form [width, height]
  //
  // `return` - True if the point is inside the AABB
  TANK.Math2D.pointInAABB = function(point, center, size)
  {
    var halfSize = [size[0] / 2, size[1] / 2];
    if (point[0] < center[0] - halfSize[0] || point[1] < center[1] - halfSize[1])
      return false;
    if (point[0] > center[0] + halfSize[0] || point[1] > center[1] + halfSize[1])
      return false;
    return true;
  };

  // ## Test a point against an OBB
  // Test if a given point is inside an oriented box.
  //
  // `point` - An array in the form [x, y]
  //
  // `center` - The center point of the box in the form [x, y]
  //
  // `size` - The size of the box in the form [width, height]
  //
  // `angle` - The rotation of the box, in radians
  //
  // `return` - True if the point is inside the OBB
  TANK.Math2D.pointInOBB = function(point, center, size, angle)
  {
    var pointRot = [];
    pointRot[0] = (point[0] - center[0]) * Math.cos(-angle) - (point[1] - center[1]) * Math.sin(-angle) + center[0];
    pointRot[1] = (point[0] - center[0]) * Math.sin(-angle) + (point[1] - center[1]) * Math.cos(-angle) + center[1];
    return TANK.Math2D.pointInAABB(pointRot, center, size);
  };

  // ## Test an AABB against an AABB
  // Test if a given rectangle is intersecting another rectangle
  //
  // `centerA` - The center point of the first rectangle in the form [x, y]
  //
  // `sizeA` - The size of the first rectangle in the form [width, height]
  //
  // `centerB` - The center point of the second rectangle in the form [x, y]
  //
  // `sizeB` - The size of the second rectangle in the form [width, height]
  //
  // `return` - True if there is an intersection
  TANK.Math2D.AABBInAABB = function(centerA, sizeA, centerB, sizeB)
  {
    // Right side is left of left side
    if (centerA[0] + sizeA[0] / 2 < centerB[0] - sizeB[0] / 2)
      return false;

    // Bottom side is above top side
    if (centerA[1] + sizeA[1] / 2 < centerB[1] - sizeB[1] / 2)
      return false;

    // Left side is right of right side
    if (centerA[0] - sizeA[0] / 2 > centerB[0] + sizeB[0] / 2)
      return false;

    // Top side is below bottom side
    if (centerA[1] - sizeA[1] / 2 > centerB[1] + sizeB[1] / 2)
      return false;

    return true;
  };

  // ## Line intersecting
  // Get the point of intersection, if any, between two line segments.
  //
  // `line1A` - Point A on the first line, in the form [x, y]
  //
  // `line1B` - Point B on the first line, in the form [x, y]
  //
  // `line2A` - Point A on the second line, in the form [x, y]
  //
  // `line2B` - Point B on the second line, in the form [x, y]
  //
  // `return` - A point in the form [x, y]
  TANK.Math2D.lineIntersection = function(line1A, line1B, line2A, line2B)
  {
    var r = [line1B[0] - line1A[0], line1B[1] - line1A[1]];
    var rlen = TANK.Math2D.pointDistancePoint(line1A, line1B);
    r[0] /= rlen;
    r[1] /= rlen;

    var s = [line2B[0] - line2A[0], line2B[1] - line2A[1]];
    var slen = TANK.Math2D.pointDistancePoint(line2A, line2B);
    s[0] /= slen;
    s[1] /= slen;

    // Solve for
    // line2A + s * u = line1A + r * t;
    // t = (line1A - line2A) x s / (r x s);
    // u = (line1A - line2A) x r / (r x s);
    var vec = [line2A[0] - line1A[0], line2A[1] - line1A[1]];
    var t = (vec[0] * s[1] - vec[1] * s[0]) / (r[0] * s[1] - r[1] * s[0]);
    var u = (vec[0] * r[1] - vec[1] * r[0]) / (r[0] * s[1] - r[1] * s[0]);

    if (t >= 0 && t <= rlen && u >= 0 && u <= slen)
      return [line1A[0] + r[0] * t, line1A[1] + r[1] * t];

    return null;
  };

  // ## Get direction to point
  // Check if a point is to the left or right of a vector using
  // the cross product.
  //
  // `posA` - The first point in the form [x, y]
  //
  // `rotationA` - The angle of the vector, in radians
  //
  // `posB` - The point to get the direction to, in form [x, y]
  //
  // `return` - A negative value if the direction is left, and a positive
  // value if the direction is right. The return will be 0 if the vector
  // is facing directly at `posB`.
  TANK.Math2D.getDirectionToPoint = function(posA, rotationA, posB)
  {
    var dir = [Math.cos(rotationA), Math.sin(rotationA)];
    var targetAngle = Math.atan2(posB[1] - posA[1], posB[0] - posA[0]);
    var targetDir = [Math.cos(targetAngle), Math.sin(targetAngle)];
    return dir[0] * targetDir[1] - dir[1] * targetDir[0];
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);