TANK.registerComponent("Pos3D")

.construct(function ()
{
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.xRotation = 0;
  this.yRotation = 0;
  this.zRotation = 0;

  this.setPosition = function (x,y,z)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.parent.invoke("onTransform", this);
  }

  this.addPosition = function (x,y,z)
  {
    this.x += x;
    this.y += y;
    this.z += z;
    this.parent.invoke("onTransform", this);
  }

  this.setRotation = function (x,y,z)
  {
    this.xRotation = x;
    this.yRotation = y;
    this.zRotation = z;
    this.parent.invoke("onTransform", this);
  }

  this.addRotation = function (x,y,z)
  {
    this.xRotation += x;
    this.yRotation += y;
    this.zRotation += z;
    this.parent.invoke("onTransform", this);
  }
});
