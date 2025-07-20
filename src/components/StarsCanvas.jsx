import { useEffect, useRef } from 'react';

const StarsCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Helpers
    function lineToAngle(x1, y1, length, radians) {
      const x2 = x1 + length * Math.cos(radians);
      const y2 = y1 + length * Math.sin(radians);
      return { x: x2, y: y2 };
    }

    function randomRange(min, max) {
      return min + Math.random() * (max - min);
    }

    function degreesToRads(degrees) {
      return degrees / 180 * Math.PI;
    }

    // Particle factory
    const particle = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,

      create: function(x, y, speed, direction) {
        const obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        obj.vx = Math.cos(direction) * speed;
        obj.vy = Math.sin(direction) * speed;
        return obj;
      },

      getSpeed: function() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      },

      setSpeed: function(speed) {
        const heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
      },

      getHeading: function() {
        return Math.atan2(this.vy, this.vx);
      },

      setHeading: function(heading) {
        const speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
      },

      update: function() {
        this.x += this.vx;
        this.y += this.vy;
      }
    };

    // Canvas and settings
    const context = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const stars = [];
    const shootingStars = [];
    const layers = [
      { speed: 0.015, scale: 0.2, count: 320 },
      { speed: 0.03, scale: 0.5, count: 50 },
      { speed: 0.05, scale: 0.75, count: 30 }
    ];
    const shootingStarOpacityDelta = 0.01;
    const trailLengthDelta = 0.01;
    const shootingStarLifeTime = 500;
    const maxTrailLength = 300;
    const starBaseRadius = 2;
    const shootingStarRadius = 3;
    let paused = false;

    const settings = {
      shootingStartInterval: function() {
        return randomRange(600, 4000); // Half as frequent
      },
      starsAngle: {
        min: 135,
        max: 180
      },
      shootingStarSpeed: {
        min: 15,
        max: 20
      }
    };

    function starsAngleRange() {
      return randomRange(settings.starsAngle.min, settings.starsAngle.max);
    }

    // Create all stars
    for (let j = 0; j < layers.length; j += 1) {
      const layer = layers[j];
      for (let i = 0; i < layer.count; i += 1) {
        const star = particle.create(randomRange(0, width), randomRange(0, height), 0, 0);
        star.radius = starBaseRadius * layer.scale;
        star.setSpeed(layer.speed);
        star.setHeading(degreesToRads(starsAngleRange()));
        stars.push(star);
      }
    }

    function createShootingStar() {
      // Vary the starting position
      const startX = randomRange(0, width);
      const startY = randomRange(0, height / 2);
      
      const shootingStar = particle.create(startX, startY, 0, 0);
      shootingStar.setSpeed(randomRange(settings.shootingStarSpeed.min, settings.shootingStarSpeed.max));
      
      // Random direction: either down-left (135-180) or down-right (0-45)
      let angle;
      if (Math.random() < 0.5) {
        angle = randomRange(135, 180); // down-left (original)
      } else {
        angle = randomRange(0, 45);   // down-right
      }
      
      shootingStar.setHeading(degreesToRads(angle));
      shootingStar.radius = shootingStarRadius;
      shootingStar.opacity = 0;
      shootingStar.trailLengthDelta = 0;
      shootingStar.isSpawning = true;
      shootingStar.isDying = false;
      shootingStars.push(shootingStar);
    }

    function killShootingStar(shootingStar) {
      setTimeout(function() {
        shootingStar.isDying = true;
      }, shootingStarLifeTime);
    }

    function update() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#282a3a";
      context.fillRect(0, 0, width, height);
      context.fill();

      // Always update and draw background stars, even when paused
      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        if (!paused) {
          star.update();
        }
        drawStar(star);
        if (!paused) {
          if (star.x > width) {
            star.x = 0;
          }
          if (star.x < 0) {
            star.x = width;
          }
          if (star.y > height) {
            star.y = 0;
          }
          if (star.y < 0) {
            star.y = height;
          }
        }
      }

      // Always update shooting stars to finish their animations
      for (let i = 0; i < shootingStars.length; i += 1) {
        const shootingStar = shootingStars[i];
        if (shootingStar.isSpawning) {
          shootingStar.opacity += shootingStarOpacityDelta;
          if (shootingStar.opacity >= 1.0) {
            shootingStar.isSpawning = false;
            killShootingStar(shootingStar);
          }
        }
        if (shootingStar.isDying) {
          shootingStar.opacity -= shootingStarOpacityDelta;
          if (shootingStar.opacity <= 0.0) {
            shootingStar.isDying = false;
            shootingStar.isDead = true;
          }
        }
        shootingStar.trailLengthDelta += trailLengthDelta;

        shootingStar.update();
        if (shootingStar.opacity > 0.0) {
          drawShootingStar(shootingStar);
        }
      }

      // Delete dead shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (shootingStars[i].isDead) {
          shootingStars.splice(i, 1);
        }
      }
      
      requestAnimationFrame(update);
    }

    function drawStar(star) {
      context.fillStyle = "rgb(255, 221, 157)";
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
      context.fill();
    }

    function drawShootingStar(p) {
      const x = p.x;
      const y = p.y;
      const currentTrailLength = (maxTrailLength * p.trailLengthDelta);
      const pos = lineToAngle(x, y, -currentTrailLength, p.getHeading());

      context.fillStyle = "rgba(255, 255, 255, " + p.opacity + ")";
      const starLength = 5;
      context.beginPath();
      context.moveTo(x - 1, y + 1);

      context.lineTo(x, y + starLength);
      context.lineTo(x + 1, y + 1);

      context.lineTo(x + starLength, y);
      context.lineTo(x + 1, y - 1);

      context.lineTo(x, y + 1);
      context.lineTo(x, y - starLength);

      context.lineTo(x - 1, y - 1);
      context.lineTo(x - starLength, y);

      context.lineTo(x - 1, y + 1);
      context.lineTo(x - starLength, y);

      context.closePath();
      context.fill();

      // Trail
      context.fillStyle = "rgba(255, 221, 157, " + p.opacity + ")";
      context.beginPath();
      context.moveTo(x - 1, y - 1);
      context.lineTo(pos.x, pos.y);
      context.lineTo(x + 1, y + 1);
      context.closePath();
      context.fill();
    }

    // Start animation
    update();

    let shootingStarTimer = null;

    function shootStar() {
      if (paused) return;
      createShootingStar();
      shootingStarTimer = setTimeout(shootStar, settings.shootingStartInterval());
    }

    function startShootingStars() {
      if (shootingStarTimer) {
        clearTimeout(shootingStarTimer);
      }
      shootStar();
    }

    function stopShootingStars() {
      if (shootingStarTimer) {
        clearTimeout(shootingStarTimer);
        shootingStarTimer = null;
      }
    }

    startShootingStars();

    const handleFocus = () => {
      paused = false;
      startShootingStars();
    };

    const handleBlur = () => {
      paused = true;
      stopShootingStars();
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      if (shootingStarTimer) {
        clearTimeout(shootingStarTimer);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
};

export default StarsCanvas;