TankJS.addComponent("Collider")

.tags("Collidable")

.includes("Pos2D")

.initFunction(function()
{
  this.width = 50;
  this.height = 50;
  this.isStatic = false;
})

.addFunction("collide", function(other)
{
  var transA = this.parent.Pos2D
  var transB = other.parent.Pos2D

  if (transA.x + this.width / 2 < transB.x - other.width / 2)
    return false;
  if (transA.x - this.width / 2 > transB.x + other.width / 2)
    return false;
  if (transA.y + this.height / 2 < transB.y - other.height / 2)
    return false;
  if (transA.y - this.height / 2 > transB.y + other.height / 2)
    return false;

  var pen = [0, 0];
  var centerA = [transA.x, transA.y];
  var centerB = [transB.x, transB.y];
  if (centerA[0] < centerB[0])
    pen[0] = (centerA[0] + this.width / 2) - (centerB[0] - other.width / 2);
  else
    pen[0] = (centerA[0] - this.width / 2) - (centerB[0] + other.width / 2);

  if (centerA[1] < centerB[1])
    pen[1] = (centerA[1] + this.height / 2) - (centerB[1] - other.height / 2);
  else
    pen[1] = (centerA[1] - this.height / 2) - (centerB[1] + other.height / 2);

  if (Math.abs(pen[0]) < Math.abs(pen[1]))
  {
    transA.x -= pen[0];
  }
  else
  {
    transA.y -= pen[1];
  }

  return true;
});