//Pre-game loading
let updateFrames = true;

function setUpgameCanvas() {
  const gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.width = screen.width;
  gameCanvas.height = screen.height;
  gameCanvas.style.backgroundSize =
    screen.width + "px " + (screen.height - 70) + "px";

  addEventListener("resize", () => {
    gameCanvas.width = screen.width;
    gameCanvas.height = screen.height;
    bird.checkHeight();
    gameCanvas.style.backgroundSize =
      screen.width + "px " + (screen.height - 70) + "px";
  });
}

function loadFont() {
  let pixelFont = new FontFace(
    "Pixel sans",
    "url(/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf)"
  );
  document.fonts.add(pixelFont);

  if ((pixelFont = FontFace)) {
    setTimeout(drawScoreUI(), 5000);
  }
}

let bird = {
  height: 400,
  alive: true,
  score: 0,
  spacePressed: false,
  birdImg: new Image(),
  checkHeight: function () {
    if (
      this.height >= screen.height - screen.height / 12.5 ||
      this.height <= 0
    ) {
      this.alive = false;
    }

    if (!this.alive && this.height <= screen.height - screen.height / 12.5) {
      this.height += 12.5;
      drawScene();
    }
  },
  applyGravity: function () {
    if (updateFrames) {
      if (bird.alive && !bird.spacePressed) {
        bird.height += 5;
        drawScene();
      } else if (bird.alive && bird.spacePressed) {
        bird.height -= 5;
        drawScene();
      }
    }
    bird.checkHeight();
  },
  loadBirdImg: function () {
    bird.birdImg.src = "imgs/bird.png";
  },
};

addEventListener("keypress", (key) => {
  if (key.code === "Space" && !bird.spacePressed && bird.alive) {
    bird.height -= 85;
    bird.birdImg.src = "imgs/birdRotated.png";
    gameContext.clearRect(200, bird.height, 50, 50);
    spacePressed = true;
  }
});

addEventListener("keyup", (key) => {
  if (key.code === "Space") {
    bird.birdImg.src = "imgs/bird.png";
    bird.spacePressed = false;
  }
});

bird.loadBirdImg();

setUpgameCanvas();
const gameContext = gameCanvas.getContext("2d");

loadFont();

let gravityUpdate = setInterval(bird.applyGravity, 20);
gravityUpdate;

let obsticalList = [];

class obstical {
  constructor() {
    this.xPosition = undefined;
    this.yPosition = Math.floor(Math.random() * 150) * -1;
    this.width = 150;
    this.height = 600;
    this.scoreGranted = false;
  }

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
      gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);

      bird.alive = false;
      updateFrames = false;
    }

    if (
      this.yPosition + 800 + 5 - 40 < bird.height &&
      this.xPosition >= 45 &&
      this.xPosition <= 245
    ) {
      gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);

      bird.alive = false;
      updateFrames = false;
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
      bird.score += 1;
      this.scoreGranted = true;
    }
  }
}

function spawnObsticals() {
  obsticalList.push(new obstical());
  obsticalList[obsticalList.length - 1].xPosition = 2300;
}

let spawnTimer = setInterval(spawnObsticals, 2500);
spawnTimer;
//Loaded game
function updateCursorVisibilty() {
  addEventListener("click", () => {
    if (!bird.alive) {
      gameCanvas.style.cursor = "none";
      location.reload();
    }
  });

  setInterval(() => {
    if (bird.alive) {
      gameCanvas.style.cursor = "pointer";
    }
  }, 1000);
}

function drawLastFrame() {
  gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
  gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);
  drawScoreUI();
}

function drawScene() {
  if (updateFrames) {
    gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
    drawScoreUI();
    gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);

    for (i = 0; i < obsticalList.length; i++) {
      obsticalList[i].drawObstical();
      obsticalList[i].movingObstical();
      obsticalList[i].handleCollision();
      obsticalList[i].handleScore();
      drawScoreUI();
    }
  }
}

function drawScoreUI() {
  gameContext.fillStyle = "rgb(237,236,230)";
  gameContext.font = "200px Pixel sans";
  gameContext.fillText(bird.score, gameCanvas.width / 2, 200);
  gameContext.strokeStyle = "black";
  gameContext.strokeText(bird.score, gameCanvas.width / 2, 200);
}
