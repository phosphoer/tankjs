(function (TANK, undefined)
{

  (function (Math, jsMath, undefined)
  {

    Math.angleToPoint = function (fromPoint, toPoint)
    {
      return jsMath.atan2(toPoint[1] - fromPoint[1], toPoint[0] - fromPoint[0]);
    }

    Math.pointDistancePoint = function (pointA, pointB)
    {
      return jsMath.sqrt((pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]));
    }

    Math.pointInRect = function (point, topLeft, bottomRight)
    {
      if (point[0] < topLeft[0] || point[1] < topLeft[1])
        return false;
      if (point[0] > bottomRight[0] || point[1] > bottomRight[1])
        return false;

      return true;
    }

    Math.pointInCircle = function (point, center, radius)
    {
      return Math.pointDistancePoint(point, center) <= radius;
    }

  }(TANK.Math = TANK.Math ||
  {}, Math));

}(this.TANK = this.TANK ||
{}));