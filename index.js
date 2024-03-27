let score = 0;

let bird = {
  height: 400,
  alive: true,
  spacePressed: false,
  image: new Image(),
  maxHeight: -50,
  minHeight: 995,
  canFly: true,
  drawHitbox: function () {
    gameContext.beginPath();
    gameContext.rect(200, this.height, 60, 60);
    gameContext.stroke();
  },
  checkHeight: function () {
    if (this.alive) {
      if (this.height <= this.maxHeight) {
        this.canFly = false;
      }
    }
    if (this.height >= this.minHeight) {
      this.alive = false;
      this.canFly = false;
      enableRestart();
    }
    if (!this.canFly && this.alive) {
      this.pullBirdDown();
    }
  },
  pullBirdDown: function () {
    this.image.src = "imgs/birdRotatedDead.png";
    this.height += 12.5;
    drawScene();
  },
  applyGravity: function () {
    if (bird.alive && !bird.spacePressed) {
      bird.height += 5;
      updateBirdLoaction();
    } else if (bird.alive && bird.spacePressed) {
      bird.height -= 5;
      updateBirdLoaction();
    }
  },
  loadImg: function () {
    bird.image.src = "imgs/bird.png";
  },
  handleCollision: function () {
    bird.alive = false;
    enableRestart();
  },
};

function updateBirdLoaction() {
  bird.checkHeight();
  drawScene();
}

let obsticalList = [];

class obstical {
  xPosition = 2300;
  yPosition = Math.floor(Math.random() * 150) * -1;
  width = 150;
  height = 600;
  scoreGranted = false;

  constructor() {}

  drawObstical() {
    const pipeImgUpper = new Image();
    pipeImgUpper.src = "imgs/pipeUpper.png";

    gameContext.clearRect(
      this.xPosition + 3.6,
      this.yPosition,
      this.width,
      this.height
    );
    gameContext.drawImage(
      pipeImgUpper,
      this.xPosition,
      this.yPosition,
      this.width,
      this.height
    );

    const pipeImgDown = new Image();
    pipeImgDown.src = "imgs/pipeDown.png";

    gameContext.clearRect(
      this.xPosition + 3.6,
      this.yPosition + 800,
      this.width,
      this.height
    );
    gameContext.drawImage(
      pipeImgDown,
      this.xPosition,
      this.yPosition + 800,
      this.width,
      this.height
    );
  }

  handleCollision() {
    if (bird.alive && bird.canFly) {
      if (
        this.yPosition + this.height + 5 > bird.height &&
        this.xPosition >= 45 &&
        this.xPosition <= 245
      ) {
        bird.handleCollision();
      }

      if (
        this.yPosition + 800 + 10 - 40 < bird.height &&
        this.xPosition >= 45 &&
        this.xPosition <= 245
      ) {
        bird.handleCollision();
      }
    }
  }

  movingObstical() {
    if (this.xPosition <= -300) {
      gameContext.clearRect(-450, gameCanvas.height, this.width, this.height);
    } else {
      this.xPosition -= 3.5;
    }
  }

  handleScore() {
    if (this.xPosition <= 45 && !this.scoreGranted) {
      score += 1;
      this.scoreGranted = true;
    }
  }
}

addEventListener("keypress", (key) => {
  const shouldFlyOnSpace =
    bird.canFly && key.code === "Space" && !bird.spacePressed && bird.alive;
  if (shouldFlyOnSpace) {
    bird.height -= 85;
    bird.image.src = "imgs/birdRotated.png";
    gameContext.clearRect(200, bird.height, 50, 50);
    spacePressed = true;
  }
});

addEventListener("keyup", (key) => {
  if (key.code === "Space") {
    bird.image.src = "imgs/bird.png";
    bird.spacePressed = false;
  }
});

function resizeToDefaultCanvasSize() {
  gameCanvas.width = screen.width;
  gameCanvas.height = screen.height;
}

const STR_PIXEL = "px ";
let gameBackgroundSize =
  screen.width + STR_PIXEL + (screen.height - 70) + STR_PIXEL;
gameCanvas.style.backgroundSize = gameBackgroundSize;

function setUpgameCanvas() {
  const gameCanvas = document.getElementById("gameCanvas");
  resizeToDefaultCanvasSize();

  addEventListener("resize", () => {
    resizeToDefaultCanvasSize();
    bird.checkHeight();
    gameCanvas.style.backgroundSize = gameBackgroundSize;
    if (!bird.alive) {
      drawFrameOfDeath();
    }
  });
}
setUpgameCanvas();
const gameContext = gameCanvas.getContext("2d");

function loadFont() {
  let pixelFont = new FontFace(
    "Pixel sans",
    "url(./Pixelify_Sans/PixelifySans-VariableFont_wght.ttf)"
  );
  document.fonts.add(pixelFont);
  drawScoreUI();
}

loadFont();
bird.loadImg();

let gravityUpdate = setInterval(bird.applyGravity, 20);
gravityUpdate;

function drawScoreUI() {
  let uiXPosition = gameCanvas.width / 2;
  const uiYPosition = 200;
  if (!bird.alive) {
    uiXPosition = gameCanvas.width / 5;
  }
  gameContext.fillStyle = "rgb(237,236,230)";
  gameContext.font = "200px Pixel sans";
  gameContext.fillText(score, uiXPosition, uiYPosition);
  gameContext.strokeStyle = "black";
  gameContext.strokeText(score, uiXPosition, uiYPosition);
}

function drawScene() {
  if (bird.alive) {
    gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
    for (i = 0; i < obsticalList.length - 1; i++) {
      drawScoreUI();
      if (bird.canFly) {
        obsticalList[i].drawObstical();
        obsticalList[i].movingObstical();
        obsticalList[i].handleCollision();
        obsticalList[i].handleScore();
      }
      drawScoreUI();
    }
    drawGround();
    gameContext.drawImage(bird.image, 200, bird.height, 50, 50);
    drawScoreUI();
  }
}

function drawFrameOfDeath() {
  if (!bird.alive) {
    gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
    score = "Click to retry";
    for (i = 0; i < obsticalList.length - 1; i++) {
      obsticalList[i].drawObstical();
    }
    drawScoreUI();
    drawGround();
    gameContext.drawImage(bird.image, 200, bird.height, 50, 50);
    bird.drawHitbox();
  }
}

function spawnObsticals() {
  for (i = 0; i < 8; i++) {
    obsticalList.push(new obstical());
    obsticalList[i].xPosition = 2300 + 875 * i;
  }
}

spawnObsticals();

function enableRestart() {
  if (!bird.alive) {
    let cursorPress = document.getElementById("cursorPressGif");
    cursorPress.style.visibility = "visible";
    gameCanvas.style.opacity = "50%";
    gameCanvas.style.cursor = "pointer";
    addEventListener("click", () => {
      location.reload();
    });
  }
  setTimeout(drawFrameOfDeath(), 800);
}

function drawGround() {
  const groundImg = new Image();
  groundImg.src = "imgs/ground.jpg";
  gameContext.drawImage(
    groundImg,
    0,
    bird.minHeight + 50,
    gameCanvas.width,
    200
  );
}

function refreshGameCanvas() {
  setTimeout(() => {
    let gameCanvasBackgroundSize = gameCanvas.style.backgroundSize;
    resizeToDefaultCanvasSize();
    drawScoreUI();
    gameCanvasBackgroundSize = gameBackgroundSize;
    drawFrameOfDeath();
  }, 750);
}
