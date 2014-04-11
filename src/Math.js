(function(TANK)
{
  "use strict";

  TANK.Math = TANK.Math || {};

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
  TANK.Math.pointInAABB = function(point, center, size)
  {
    var halfSize = [size[0] / 2, size[1] / 2];
    if (point[0] < center[0] - halfSize[0] || point[1] < center[1] - halfSize[1])
      return false;
    if (point[0] > center[0] + halfSize[0] || point[1] > center[1] + halfSize[1])
      return false;
    return true;
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
  TANK.Math.AABBInAABB = function(centerA, sizeA, centerB, sizeB)
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
  TANK.Math.pointInOBB = function(point, center, size, angle)
  {
    var pointRot = [];
    pointRot[0] = (point[0] - center[0]) * Math.cos(-angle) - (point[1] - center[1]) * Math.sin(-angle) + center[0];
    pointRot[1] = (point[0] - center[0]) * Math.sin(-angle) + (point[1] - center[1]) * Math.cos(-angle) + center[1];
    return TANK.Math.pointInAABB(pointRot, center, size);
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
  TANK.Math.lineIntersection = function(line1A, line1B, line2A, line2B)
  {
    var r = [line1B[0] - line1A[0], line1B[1] - line1A[1]];
    var rlen = TANK.Math.pointDistancePoint(line1A, line1B);
    r[0] /= rlen;
    r[1] /= rlen;

    var s = [line2B[0] - line2A[0], line2B[1] - line2A[1]];
    var slen = TANK.Math.pointDistancePoint(line2A, line2B);
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
  TANK.Math.getDirectionToPoint = function(posA, rotationA, posB)
  {
    var dir = [Math.cos(rotationA), Math.sin(rotationA)];
    var targetAngle = Math.atan2(posB[1] - posA[1], posB[0] - posA[0]);
    var targetDir = [Math.cos(targetAngle), Math.sin(targetAngle)];
    return dir[0] * targetDir[1] - dir[1] * targetDir[0];
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);