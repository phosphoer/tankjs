// A mapping of the set of default events that TANK dispatches
(function(TANK)
{
  "use strict";
  TANK.Event = TANK.Event || {};

  // ## Entity events

  // ## Child added
  // Dispatched when a child is added to an entity.
  // The child entity is passed as a parameter.
  TANK.Event.childAdded = "childadded";

  // ## Child removed
  // Dispatched when a child is removed from an entity.
  // The child entity is passed as a parameter.
  TANK.Event.childRemoved = "childremoved";

  // ## Component added
  // Dispatched when a component is added to an entity.
  // The component instance is passed as a parameter.
  TANK.Event.componentAdded = "componentadded";

  // ## Component removed
  // Dispatched when a component is removed from an entity.
  // The component instance is passed as a parameter.
  TANK.Event.componentRemoved = "componentremoved";

})(this.TANK = this.TANK || {});