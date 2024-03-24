let score = 0;

let bird = {
  height: 400,
  alive: true,
  spacePressed: false,
  image: new Image(),
  maxHeight: -50,
  minHeight: 995,
  canFly: true,
  checkHeight: function () {
    if (this.alive) {
      if (this.height <= this.maxHeight) {
        this.pullBirdDown();
        this.canFly = false;
        enableRestart();
      }
    }
    if (this.height >= this.minHeight) {
      this.alive = false;
      enableRestart();
    }
    if (!this.canFly) {
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
      bird.checkHeight();
      drawScene();
    } else if (bird.alive && bird.spacePressed) {
      bird.height -= 5;
      bird.checkHeight();
      drawScene();
    }
  },
  loadImg: function () {
    bird.image.src = "imgs/bird.png";
  },
};

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
    if (
      this.yPosition + this.height + 5 > bird.height &&
      this.xPosition >= 45 &&
      this.xPosition <= 245
    ) {
      gameContext.drawImage(bird.image, 200, bird.height, 50, 50);
      bird.alive = false;
      enableRestart();
    }

    if (
      this.yPosition + 800 + 5 - 40 < bird.height &&
      this.xPosition >= 45 &&
      this.xPosition <= 245
    ) {
      bird.alive = false;
      enableRestart();
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

function setUpgameCanvas() {
  const gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.width = screen.width;
  gameCanvas.height = screen.height;
  const STR_PIXEL = "px ";
  let gameBackgroundSize =
    screen.width + STR_PIXEL + (screen.height - 70) + STR_PIXEL;
  gameCanvas.style.backgroundSize = gameBackgroundSize;

  addEventListener("resize", () => {
    gameCanvas.width = screen.width;
    gameCanvas.height = screen.height;
    bird.checkHeight();
    gameCanvas.style.backgroundSize = gameBackgroundSize;
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

let obsticalList = [];

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

    gameContext.drawImage(bird.image, 200, bird.height, 50, 50);

    for (i = 0; i < obsticalList.length; i++) {
      obsticalList[i].drawObstical();
      obsticalList[i].movingObstical();
      obsticalList[i].handleCollision();
      obsticalList[i].handleScore();
      drawScoreUI();
    }
    drawScoreUI();
  }
}

function drawFrameOfDeath() {
  this.alive = true;
  gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
  score = "";
  drawScene();
  this.alive = false;
}

let spawnTimer = setInterval(spawnObsticals, 2500);
spawnTimer;

function spawnObsticals() {
  obsticalList.push(new obstical());
}

function enableRestart() {
  setTimeout(drawFrameOfDeath(), 800);
  if (!bird.alive) {
    let cursorPress = document.getElementById("cursorPressGif");
    cursorPress.style.visibility = "visible";
    score = "Click to retry";
    drawScoreUI();
    gameCanvas.style.opacity = "50%";
    gameCanvas.style.cursor = "pointer";
    addEventListener("click", () => {
      location.reload();
    });
  }
}
