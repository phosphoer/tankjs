TANK.registerComponent("Health")

.construct(function ()
{
  this.value = 1;
  this.max = 1;
  this.deleteAtZero = true;
})

.addFunction("FillHealth", function (amount)
{
  if (amount)
    this.value += amount;
  else
    this.value = this.max;
  if (this.value > this.max)
    this.value = this.max;
})

.addFunction("TakeDamage", function (damage)
{
  this.value -= damage;
  if (this.value <= 0)
  {
    this.value = 0;
    if (this.deleteAtZero)
      this.parent.remove();
  }
});