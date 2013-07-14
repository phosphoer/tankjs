TANK.registerComponent("ThreeHierarchy")

.construct(function ()
{
  this.children = [];
})

.initialize(function()
{
  this.attachEntity = function(entity)
  {
    entity.threeParent = this.parent;
    entity.threeHierarchyIndex = this.children.length;
    this.children.push(entity);

    if (this.parent._initialized && !entity._initialized)
      TANK.addEntity(entity);
  };

  this.detachEntity = function(entity)
  {
    this.children.splice(entity.threeHierarchyIndex, 1);
    entity.threeParent = undefined;
  };

  for (var i = 0; i < this.children.length; ++i)
  {
    var entity = this.children[i];
    if (!entity._initialized)
      TANK.addEntity(entity);
  }
})

.destruct(function()
{
  for (var i = 0; i < this.children.length; ++i)
  {
    var entity = this.children[i];
    TANK.removeEntity(entity);
  }
});
