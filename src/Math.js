(function(TANK)
{
  "use strict";

  TANK.Math = TANK.Math || {};

  TANK.Math.pointInAABB = function(point, center, size)
  {
    var halfSize = [size[0] / 2, size[1] / 2];
    if (point[0] < center[0] - halfSize[0] || point[1] < center[1] - halfSize[1])
      return false;
    if (point[0] > center[0] + halfSize[0] || point[1] > center[1] + halfSize[1])
      return false;
    return true;
  };

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

  TANK.Math.pointInOBB = function(point, center, size, angle)
  {
    var pointRot = [];
    pointRot[0] = (point[0] - center[0]) * Math.cos(-angle) - (point[1] - center[1]) * Math.sin(-angle) + center[0];
    pointRot[1] = (point[0] - center[0]) * Math.sin(-angle) + (point[1] - center[1]) * Math.cos(-angle) + center[1];
    return TANK.Math.pointInAABB(pointRot, center, size);
  };

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

  TANK.Math.getDirectionToPoint = function(posA, rotationA, posB)
  {
    var dir = [Math.cos(rotationA), Math.sin(rotationA)];
    var targetAngle = Math.atan2(posB[1] - posA[1], posB[0] - posA[0]);
    var targetDir = [Math.cos(targetAngle), Math.sin(targetAngle)];
    return dir[0] * targetDir[1] - dir[1] * targetDir[0];
  };

})(this.TANK = this.TANK || {});