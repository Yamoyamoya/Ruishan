let texts = [];
let gravity = 0.4;
let shakeForce = 5;
let canvasW, canvasH;

let input, button;
let userWords = [];
let clearing = false;
let clearSpeed = 5;

let presetWords = ["AI", "心灵", "未来", "探索", "世界", "信息", "技术"];

function setup() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  createCanvas(canvasW, canvasH);
  textAlign(CENTER, CENTER);
  noStroke();

  // 输入栏和按钮
  input = createInput("TYPE IN YOUR REL-AI-CTION");
  input.position(30, 80);
  input.size(canvasW - 120);

  button = createButton("Drop");
  button.position(input.x + input.width + 10, 80);
  button.mousePressed(startDropping);
}

function draw() {
  background('#F9A800');

  // 为输入栏腾出空间
  translate(0, 50);

  if (!clearing) {
    if (frameCount % 20 === 0) {
      let word = random(presetWords);
      texts.push(new FallingText(word, random(width), -30));
    }
    if (frameCount % 30 === 0 && userWords.length > 0) {
      let word = userWords.shift();
      texts.push(new FallingText(word, random(width), -30));
    }
    if (isOverflowing()) clearing = true;
  }

  for (let t of texts) {
    if (!clearing) {
      if (t.moving) {
        t.update();
        t.checkCollision();
      }
    } else {
      t.y += clearSpeed;
    }
    t.display();
  }

  if (clearing && allCleared()) {
    texts = [];
    clearing = false;
  }
}

function startDropping() {
  let inputText = input.value().trim();
  if (inputText.length > 0) {
    userWords = userWords.concat(inputText.split(" "));
  }
}

function deviceShaken() {
  for (let t of texts) {
    t.x += random(-shakeForce, shakeForce);
    t.y += random(-shakeForce, shakeForce);
  }
}

function isOverflowing() {
  if (texts.length > 80) return true;
  for (let t of texts) {
    if (!t.moving && t.y - t.h / 2 < 10) return true;
  }
  return false;
}

function allCleared() {
  for (let t of texts) {
    if (t.y - t.h / 2 < height) return false;
  }
  return true;
}

function windowResized() {
  canvasW = windowWidth;
  canvasH = windowHeight;
  resizeCanvas(canvasW, canvasH);
  input.size(canvasW - 120);
  button.position(input.x + input.width + 10, 10);
}

class FallingText {
  constructor(word, x, y) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.moving = true;

    this.size = random(18, 36);
    this.font = random(["Georgia", "Courier", "Helvetica", "Times", "Arial", "Comic Sans MS"]);

    textSize(this.size);
    textFont(this.font);
    this.w = textWidth(this.word) + 4;
    this.h = this.size;
  }

  update() {
    this.vy += gravity;
    this.y += this.vy;
  }

  stop() {
    this.moving = false;
    this.vy = 0;
  }

  display() {
    fill(0);
    textSize(this.size);
    textFont(this.font);
    text(this.word, this.x, this.y);
  }

  checkCollision() {
    for (let other of texts) {
      if (this === other || !other) continue;
      if (!other.moving && this.collidesWith(other)) {
        this.y = other.y - other.h / 2 - this.h / 2;
        this.stop();
        return;
      }
    }

    if (this.y + this.h / 2 >= height) {
      this.y = height - this.h / 2;
      this.stop();
    }
  }

  collidesWith(other) {
    return !(
      this.x + this.w / 2 < other.x - other.w / 2 ||
      this.x - this.w / 2 > other.x + other.w / 2 ||
      this.y + this.h / 2 < other.y - other.h / 2 ||
      this.y - this.h / 2 > other.y + other.h / 2
    );
  }
}