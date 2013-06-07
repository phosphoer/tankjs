(function (TankJS, undefined)
{

(function (Math, jsMath, undefined)
{

Math.pointDistancePoint = function(pointA, pointB)
{
  return jsMath.sqrt((pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]));
}

Math.pointInRect = function(point, topLeft, bottomRight)
{
  if (point[0] < topLeft[0] || point[1] < topLeft[1])
    return false;
  if (point[0] > bottomRight[0] || point[1] > bottomRight[1])
    return false;

  return true;
}

Math.pointInCircle = function(point, center, radius)
{
  return Math.pointDistancePoint(point, center) <= radius;
}

} (TankJS.Math = TankJS.Math || {}, Math));

} (window.TankJS = window.TankJS || {}));