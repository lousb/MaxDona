import React, { useEffect, useRef, useState } from "react";

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [screen, setScreen] = useState(null);
  const invaderSize = 8; // Size of each invader
  const playerSize = 30; // Size of the player
  const invaderSpawnDelay = 1000; // Delay for spawning new invaders
  let kills = 0; // Keep track of kills
  const projectiles = [];
  const [gameStarted, setGameStarted] = useState(false); // Track game state
  const invaderImage = new Image(); // Image for the invaders
  invaderImage.src = "/404.png"; // Path to the invader image

  const resetGame = () => {
    kills = 0; // Reset kills
    projectiles.length = 0; // Clear projectiles
    setGameStarted(false); // Reset game started state
  };

  const gameStartedRef = useRef(gameStarted);

  useEffect(() => {
    gameStartedRef.current = gameStarted; // Update the ref whenever gameStarted changes
  }, [gameStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    ctx.imageSmoothingEnabled = false;


    setScreen(ctx);
    const player = new Player(width / 2 - playerSize / 2, height - playerSize - 10);
    const invaders = createInvaders(); // Create invaders based on the image
    const invaderManager = new InvaderManager(invaders);

    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault(); // Prevent the page from scrolling
        if (!gameStarted) {
          setGameStarted(true);
          return; // Prevent further actions until the game starts
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      player.update(ctx);
      player.draw(ctx);

      if (!gameStartedRef.current) {
        drawStartScreen(ctx); // Draw the start screen
      }

      invaderManager.move(); // Move all invaders collectively

      // Check for collisions between invaders and projectiles
      invaders.forEach((invader) => {
        invader.checkCollision(projectiles); // Check each invader against all projectiles
        invader.draw(ctx); // Draw each invader
      });

      // Pass the invaders array to the player's checkCollision method
      player.checkCollision(invaders);

      // Draw projectiles
      projectiles.forEach((proj) => {
        proj.update(ctx);
      });

      // Check for victory
      if (invaderManager.allInvadersKilled()) {
        alert("Success! All invaders have been defeated!");
        // resetGame(); // Reset the game on collision
        return; // Exit the loop if all invaders are killed
      }

      requestAnimationFrame(loop);
    };

    invaderImage.onload = () => {
      loop(); // Start the game loop after the image has loaded
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener("resize", () => {});
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Invader class
  class Invader {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = invaderSize;
      this.height = invaderSize;
      this.active = true;
    }

    draw(ctx) {
      if (this.active) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    checkCollision(projectiles) {
      projectiles.forEach((proj) => {
        if (
          proj.active &&
          this.active && // Ensure the invader is active
          proj.x < this.x + this.width &&
          proj.x + proj.width > this.x &&
          proj.y < this.y + this.height &&
          proj.y + proj.height > this.y
        ) {
          proj.active = false; // Deactivate the projectile
          this.active = false; // Deactivate the invader
          kills++; // Increment kills
        }
      });
    }
  }

  const drawStartScreen = (ctx) => {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press Space to Play", canvasRef.current.width / 2, canvasRef.current.height / 2);
  };

  class InvaderManager {
    constructor(invaders) {
      this.invaders = invaders;
      this.direction = 1; // 1 for right, -1 for left
      this.speed = 1.5; // Speed of invader movement
    }

    allInvadersKilled() {
      return this.invaders.every((invader) => !invader.active); // Check if all invaders are inactive
    }

    move() {
      if (!gameStartedRef.current) return;

      // Move only active invaders
      this.invaders.forEach((invader) => {
        if (invader.active) {
          invader.x += this.direction * this.speed; // Move left or right

          // If the invader goes off the right side, move it to the left side
          if (invader.x > canvasRef.current.width) {
            invader.x = -invader.width; // Move it off the left side
            invader.y += invaderSize * 10; // Move it down one step
          }

          // If the invader goes off the left side, move it to the right side
          if (invader.x + invader.width < 0) {
            invader.x = canvasRef.current.width; // Move it off the right side
            invader.y += invaderSize; // Move it down one step
          }
        }
      });
    }
  }

  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = playerSize;
      this.height = playerSize;
      this.active = true;

      this.moveLeft = false;
      this.moveRight = false;
      this.isShooting = false;

      window.addEventListener("keydown", (e) => {
        if (!gameStartedRef.current) return; // Prevent actions until game starts

        if (e.key === "ArrowLeft") {
          this.moveLeft = true; // Set left movement flag
        } else if (e.key === "ArrowRight") {
          this.moveRight = true; // Set right movement flag
        } else if (e.key === " ") {
          if (!this.isShooting) {
            this.isShooting = true; // Set shooting flag
            // Shoot
            const projectile = new Projectile(this.x + this.width / 2, this.y);
            projectiles.push(projectile);
          }
        }
      });

      // Reset movement flags on keyup
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") {
          this.moveLeft = false; // Reset left movement flag
        } else if (e.key === "ArrowRight") {
          this.moveRight = false; // Reset right movement flag
        } else if (e.key === " ") {
          this.isShooting = false; // Reset shooting flag when space is released
        }
      });
    }

    // Check for collisions with invaders
    checkCollision(invaders) {
      invaders.forEach((invader) => {
        if (
          invader.active &&
          invader.x < this.x + this.width &&
          invader.x + invader.width > this.x &&
          invader.y < this.y + this.height &&
          invader.y + invader.height > this.y
        ) {
          alert("You big stinker!"); // Alert on collision
          resetGame(); // Reset the game on collision
          invader.active = false; // Deactivate invader on collision
        }
      });
    }

    update(ctx) {
      if (this.moveLeft && this.x > 0) {
        this.x -= 2; // Move left
      }
      if (this.moveRight && this.x < canvasRef.current.width - this.width) {
        this.x += 2; // Move right
      }

      // Remove inactive projectiles
      projectiles.forEach((proj, index) => {
        if (!proj.active) {
          projectiles.splice(index, 1);
        }
      });

      // Update the projectiles
      projectiles.forEach((proj) => {
        proj.update(ctx);
      });
    }

    draw(ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x, this.y, this.width, this.height); // Draw the player
    }
  }

  class Projectile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 5;
      this.height = 10;
      this.active = true;
    }

    update(ctx) {
      this.y -= 4; // Move the projectile up
      if (this.y < 0) {
        this.active = false; // Deactivate if it goes off the top of the screen
      }
      this.draw(ctx);
    }

    draw(ctx) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height); // Draw the projectile
    }
  }

  // Function to create invaders based on the image
  // Function to create invaders based on the image
  const createInvaders = () => {
      const invaders = [];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = invaderImage.width; // Set the canvas width
      canvas.height = invaderImage.height; // Set the canvas height

      // Draw the invader image onto the off-screen canvas
      ctx.drawImage(invaderImage, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const invaderSpacingX = 0; // Horizontal spacing
      const invaderSpacingY = 0; // Vertical spacing

      // Calculate how many invaders can fit in the canvas
      const invadersPerRow = Math.floor(canvas.width / (invaderSize + invaderSpacingX));
      const invadersPerColumn = Math.floor(canvas.height / (invaderSize + invaderSpacingY));

      // Calculate total dimensions for centered positioning
      const totalInvaderWidth = invadersPerRow * (invaderSize + invaderSpacingX);
      const totalInvaderHeight = invadersPerColumn * (invaderSize + invaderSpacingY);

      // Calculate the starting x and y position to center the invaders
      const startX = (canvasRef.current.width - totalInvaderWidth) / 2; // Center horizontally

      for (let y = 0; y < invadersPerColumn; y++) {
        for (let x = 0; x < invadersPerRow; x++) {
          const index = (y * (invaderSize + invaderSpacingY) * canvas.width + x * (invaderSize + invaderSpacingX)) * 4; // Get pixel index
          const alpha = data[index + 3]; // Get alpha value

          // Only create an invader if the pixel is not fully transparent
          if (alpha > 0) {
            
            // Calculate the centered x and y position for each invader
            invaders.push(new Invader(Math.round(startX + x * (invaderSize + invaderSpacingX)), Math.round( y * (invaderSize + invaderSpacingY))));
          }
        }
      }

      return invaders; // Return the array of invaders
    };
  
  



  
  

  return <canvas ref={canvasRef} />;
};

export default SpaceInvaders;
