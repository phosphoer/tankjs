(function()
{
  "use strict";

  var Particle = function()
  {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.vx = 0;
    this.vy = 0;
    this.vr = 0;
    this.life = 0;
    this.alpha = 1;
    this.scale = 1;
    this.friction = 1;
    this.alphaDecay = 1;
    this.scaleDecay = 1;
  };

  TANK.registerComponent("ParticleEmitter")
  .includes("Pos2D")
  .construct(function()
  {
    this.zdepth = 1;
    this.particleImage = new Image();
    this.blendMode = "lighter";

    this.spawning = true;
    this.spawnOffsetMin = [0, 0];
    this.spawnOffsetMax = [0, 0];
    this.spawnSpeedMin = 10;
    this.spawnSpeedMax = 15;
    this.spawnAngleMin = 0;
    this.spawnAngleMax = Math.PI * 2;
    this.spawnRotationMin = 0;
    this.spawnRotationMax = Math.PI * 2;
    this.spawnAlphaMin = 1;
    this.spawnAlphaMax = 1;
    this.spawnScaleMin = 1;
    this.spawnScaleMax = 1.3;
    this.spawnPerSecond = 10;
    this.spawnDuration = 0;

    this.particleLifeMin = 1;
    this.particleLifeMax = 3;
    this.particleFrictionMin = 0.90;
    this.particleFrictionMax = 0.95;
    this.particleAlphaDecayMin = 0.9;
    this.particleAlphaDecayMax = 0.95;
    this.particleRotateSpeedMin = 0;
    this.particleRotateSpeedMax = 1;
    this.particleScaleDecayMin = 0.95;
    this.particleScaleDecayMax = 0.98;

    this.alignRotationToSpawnAngle = false;
    this.globalForce = [0, 0];
    this.particleUpdateFunc = null;
    this.particleDrawFunc = null;

    this.particles = [];
    this.deleted = [];
    this.spawnTimer = 0;
    this.spawnAccum = 0;
  })
  .initialize(function()
  {
    var t = this._entity.Pos2D;

    // Check if we can find a render manager to register with
    if (!this._entity._parent)
    {
      console.error("The Entity the ParticleEmitter was added to has no parent");
      return;
    }
    else if (!this._entity._parent.Renderer2D)
    {
      console.error("The ParticleEmitter couldn't find a Renderer2D to register with");
      return;
    }

    // Add ourselves to render manager
    this._entity._parent.Renderer2D.add(this);

    this.update = function(dt)
    {
      // Timers
      this.spawnTimer += dt;

      // Stop spawning after specified duration
      if (this.spawnTimer > this.spawnDuration && this.spawnDuration > 0)
        this.spawning = false;

      // Spawn new particles
      if (this.spawning)
      {
        this.spawnAccum += this.spawnPerSecond * dt;
        if (this.spawnAccum >= 1)
        {
          var spawnCount = Math.floor(this.spawnAccum);
          for (var i = 0; i < spawnCount; ++i)
          {
            var p = new Particle();
            var dir = this.spawnAngleMin + Math.random() * (this.spawnAngleMax - this.spawnAngleMin);
            var speed = this.spawnSpeedMin + Math.random() * (this.spawnSpeedMax - this.spawnSpeedMin);
            p.vx = Math.cos(dir) * speed;
            p.vy = Math.sin(dir) * speed;
            p.life = this.particleLifeMin + Math.random() * (this.particleLifeMax - this.particleLifeMin);
            p.x = t.x + this.spawnOffsetMin[0] + Math.random() * (this.spawnOffsetMax[0] - this.spawnOffsetMin[0]);
            p.y = t.y + this.spawnOffsetMin[1] + Math.random() * (this.spawnOffsetMax[1] - this.spawnOffsetMin[1]);
            p.r = this.spawnRotationMin + Math.random() * (this.spawnRotationMax - this.spawnRotationMin);
            p.vr = this.particleRotateSpeedMin + Math.random() * (this.particleRotateSpeedMax - this.particleRotateSpeedMin);
            p.alpha = this.spawnAlphaMin + Math.random() * (this.spawnAlphaMax - this.spawnAlphaMin);
            p.scale = this.spawnScaleMin + Math.random() * (this.spawnScaleMax - this.spawnScaleMin);
            p.friction = this.particleFrictionMin + Math.random() * (this.particleFrictionMax - this.particleFrictionMin);
            p.alphaDecay = this.particleAlphaDecayMin + Math.random() * (this.particleAlphaDecayMax - this.particleAlphaDecayMin);
            p.scaleDecay = this.particleScaleDecayMin + Math.random() * (this.particleScaleDecayMax - this.particleScaleDecayMin);
            if (this.alignRotationToSpawnAngle)
              p.r = dir;
            this.particles.push(p);
          }
          this.spawnAccum -= spawnCount;
        }
      }

      // Update existing particles
      for (var i = 0; i < this.particles.length; ++i)
      {
        var p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vx += this.globalForce[0] * dt;
        p.vy += this.globalForce[1] * dt;
        p.alpha *= p.alphaDecay;
        p.scale *= p.scaleDecay;
        if (this.particleUpdateFunc)
          this.particleUpdateFunc(p, dt);
        if (p.life < 0)
          this.deleted.push(i);
      }

      // Delete dead particles
      for (var i = 0; i < this.deleted.length; ++i)
        this.particles.splice(this.deleted[i], 1);
      this.deleted = [];
    };

    this.draw = function(ctx, camera, dt)
    {
      // Draw particles
      for (var i = 0; i < this.particles.length; ++i)
      {
        ctx.save();
        ctx.globalCompositeOperation = this.blendMode;
        var p = this.particles[i];

        ctx.translate(p.x - camera.x, p.y - camera.y);
        ctx.scale(p.scale, p.scale);
        ctx.rotate(p.r);
        if (this.particleImage.width)
          ctx.translate(-this.particleImage.width / 2, -this.particleImage.height / 2);
        ctx.globalAlpha = p.alpha;

        if (this.particleDrawFunc)
          this.particleDrawFunc(p, ctx, camera, dt);
        else
          ctx.drawImage(this.particleImage, 0, 0);

        ctx.restore();
      }
    };
  });

})();