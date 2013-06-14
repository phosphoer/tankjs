TankJS.registerComponent("InvokeOnCollide")

.construct(function ()
{
  this.requiredComponent = "";
  this.invokeSelf = "";
  this.argSelf = undefined;
  this.invokeOther = "";
  this.argOther = undefined;
})

.addFunction("OnCollide", function (obj)
{
  if (this.requiredComponent && !obj.getComponent(this.requiredComponent))
    return;

  if (this.invokeSelf)
    this.parent.invoke(this.invokeSelf, this.argSelf);
  if (this.invokeOther)
    obj.invoke(this.invokeOther, this.argOther);
});