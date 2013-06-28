TANK.registerComponent("Sprite")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function ()
{
  this.zdepth = 0;
  this.centered = true;
  this.frames = [];
  this.playing = true;
  this._image = new Image();
  this._timer = 0;
  this._currentFrame = 0;

  addProperty(this, "imagePath", function ()
  {
    return this._image.src;
  }, function (val)
  {
    this._image.src = val;
  });

  addProperty(this, "width", function ()
  {
    return this.frames[this._currentFrame].rectCorner[0] - this.frames[this._currentFrame].rectOrigin[0];
  }, function (val) {});

  addProperty(this, "height", function ()
  {
    return this.frames[this._currentFrame].rectCorner[1] - this.frames[this._currentFrame].rectOrigin[1];
  }, function (val) {});
})

.initialize(function ()
{
  this.addFrame = function (duration, rectOrigin, rectCorner)
  {
    var frame = {};
    frame.duration = duration;
    frame.rectOrigin = rectOrigin;
    frame.rectCorner = rectCorner;
    frame.width = rectCorner[0] - rectOrigin[0];
    frame.height = rectCorner[1] - rectOrigin[1];
    this.frames.push(frame);
  };

  this.addEventListener("OnEnterFrame", function (dt)
  {
    if (this.playing)
      this._timer += dt;

    if (this.frames.length === 0)
      return;

    var frame = this.frames[this._currentFrame];
    if (this._timer >= frame.duration)
    {
      ++this._currentFrame;
      this._timer = 0;
    }
    if (this._currentFrame >= this.frames.length)
    {
      this._currentFrame = 0;
      this.parent.invoke("OnAnimationComplete");
    }
  });

  this.draw = function (ctx)
  {
    if (this.frames.length === 0)
      return;

    var t = this.parent.Pos2D;
    var frame = this.frames[this._currentFrame];
    frame.width = frame.rectCorner[0] - frame.rectOrigin[0];
    frame.height = frame.rectCorner[1] - frame.rectOrigin[1];
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t.rotation)
    if (this.centered)
      ctx.translate(-frame.width / 2, -frame.height / 2);

    ctx.drawImage(this._image, frame.rectOrigin[0], frame.rectOrigin[1], frame.width, frame.height, 0, 0, frame.width, frame.height);

    ctx.restore();
  };
});