let updateFrames = true;

function setUpgameCanvas() {
  const gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;

  addEventListener("resize", () => {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    drawLastFrame();
    drawScene();
  });
}

setUpgameCanvas();
const gameContext = gameCanvas.getContext("2d");

let bird = {
  height: 400,
  alive: true,
  score: 0,
  birdImg: new Image(),
  checkHeight: function () {
    if (this.height >= 825 || this.height <= 0) {
      this.alive = false;
    }

    if (!this.alive && this.height <= 825) {
      this.height += 25;
      drawScene();
    }
  },
  applyGravity: function () {
    if (updateFrames) {
      if (bird.alive && !spacePressed) {
        bird.height += 5;
        drawScene();
      } else if (bird.alive && spacePressed) {
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

bird.loadBirdImg();

let gravityUpdate = setInterval(bird.applyGravity, 20);
gravityUpdate;

class obstical {
  constructor() {
    this.xPosition = undefined;
    this.yPosition = Math.floor(Math.random() * 250) * -1;
    this.width = 150;
    this.height = 500;
    this.scoreGranted = false;
  }

  handleObstical() {
    //Drawing the obsticals
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

    //Handle collisions
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

    //Despawning and moving the obsticals
    if (this.xPosition <= -300) {
      gameContext.clearRect(-450, gameCanvas.height, this.width, this.height);
    } else {
      this.xPosition -= 3.5;
    }

    //bird.score sytem
    if (this.xPosition <= 45 && this.scoreGranted === false) {
      bird.score += 1;
      this.scoreGranted = true;
    }
  }
}

let spawnTimer = setInterval(spawnObsticals, 2500);
spawnTimer;

let obsticalList = [];

function spawnObsticals() {
  obsticalList.push(new obstical());
  obsticalList[obsticalList.length - 1].xPosition = 2300;
}

function drawScene() {
  if (updateFrames === true) {
    gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
    drawScoreUI();
    gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);

    for (i = 0; i < obsticalList.length; i++) {
      obsticalList[i].handleObstical();
      drawScoreUI();
    }
  }
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

loadFont();

function drawScoreUI() {
  gameContext.fillStyle = "rgb(237,236,230)";
  gameContext.font = "200px Pixel sans";
  gameContext.fillText(bird.score, gameCanvas.width / 2, 200);
  gameContext.strokeStyle = "black";
  gameContext.strokeText(bird.score, gameCanvas.width / 2, 200);
}

function updateCursorVisibilty() {
  addEventListener("click", () => {
    if (bird.alive === false) {
      gameCanvas.style.cursor = "none";
      location.reload();
    }
  });

  setInterval(() => {
    if (bird.alive === false) {
      gameCanvas.style.cursor = "pointer";
    }
  }, 70);
}

function drawLastFrame() {
  gameContext.clearRect(0, 0, gameCanvas.height, gameCanvas.width);
  gameContext.drawImage(bird.birdImg, 200, bird.height, 50, 50);
  drawScoreUI();
}

let spacePressed = false;

addEventListener("keypress", function (key) {
  if (key.code === "Space" && spacePressed === false && bird.alive === true) {
    bird.height -= 65;
    bird.birdImg.src = "imgs/birdRotated.png";
    gameContext.clearRect(200, bird.height, 50, 50);
    spacePressed = true;
    setTimeout((e) => {
      spacePressed = false;
    }, 100);
  }
});

addEventListener("keyup", function (key) {
  if (key.code === "Space") {
    bird.birdImg.src = "imgs/bird.png";
    spacePressed = false;
  }
});
