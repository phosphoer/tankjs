TANK.registerComponent("ThreeModel")

.requires("ThreePos, ThreeMaterial")

.construct(function ()
{
  this.url = "";
})

.initialize(function()
{
  var that = this;
  this.onModelLoaded = function(object)
  {
    object.traverse(function (child)
    {
      if (child instanceof THREE.Mesh)
      {
        child.material = that.parent.ThreeMaterial.material;
      }
    });

    that.object = object;
    that.parent.ThreePos.object3d.add(object);
  };

  this.onModelProgress = function()
  {
  };

  this.onModelError = function()
  {
  };

  this.loader = new THREE.OBJLoader();
  this.loader.crossOrigin = true;
  this.loader.load(this.url, this.onModelLoaded, this.onModelProgress, this.onModelError);
})

.destruct(function()
{
  this.object.parent.remove(this.object);
});
