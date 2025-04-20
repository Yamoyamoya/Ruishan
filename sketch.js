let words = [];
let input, button;
let presetTexts = ["HELLO", "AI", "互动", "艺术", "表达", "情绪", "🌟", "🚀", "🧠", "🎨", "EMOTION", "RIGHTS", "REGULATIONS", "HOW","WHY", "LISTEN"];
let video;
let gravity = 0.2;
let shakeThreshold = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);

  input = createInput('');
  input.attribute('placeholder', 'TYPE IN YOUR REFL-AI-CTION');
  input.position(20, 20);
  input.size(200, 40);

  button = createButton('DROP');
  button.position(input.x + input.width + 10, 20);
  button.size(100, 40);
  button.mousePressed(addInputWords);

  video = createVideo(['video.mp4'], videoLoaded);
  video.hide();
  video.volume(0);
  video.loop();

  setInterval(() => {
    addPresetWord(random(presetTexts));
  }, 800);
}

function videoLoaded() {
  video.size(200, 150);
}

function draw() {
  background('#F9A800');

  push();
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(video, 0, 0);
  pop();

  for (let word of words) {
    word.update();
    word.display();
    word.checkCollision(words);
    word.checkVideoCollision(width / 2, height / 2, 200, 150);
  }

  // 清空堆满的文字
  if (words.length > 150) {
    words = [];
  }
}

function addPresetWord(txt) {
  words.push(new WordBlock(txt, random(width), -20));
}

function addInputWords() {
  let txt = input.value().trim();
  if (txt === '') return;

  let tokens = txt.match(/[\u4e00-\u9fa5]|[\w\']+|[^\s\w]/g); // 中英文分词
  if (tokens) {
    for (let t of tokens) {
      words.push(new WordBlock(t, random(width), -20));
    }
  }

  input.value('');
}

function deviceShaken() {
  for (let word of words) {
    word.vx += random(-5, 5);
    word.vy += random(-5, 5);
  }
}

class WordBlock {
  constructor(txt, x, y) {
    this.txt = txt;
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = 0;
    this.size = random(20, 40);
    this.font = random(['Georgia', 'Arial', 'Courier New', 'sans-serif']);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.stuck = false;
  }

  update() {
    if (!this.stuck) {
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.y + this.size / 2 > height) {
        this.y = height - this.size / 2;
        this.vy = 0;
        this.stuck = true;
      }

      if (this.x < 0 || this.x > width) {
        this.vx *= -0.5;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    textSize(this.size);
    fill(0);
    textFont(this.font);
    textAlign(CENTER, CENTER);
    text(this.txt, 0, 0);
    pop();
  }

  checkCollision(others) {
    for (let other of others) {
      if (other === this || other.stuck === false) continue;

      let dx = this.x - other.x;
      let dy = this.y - other.y;
      let distSq = dx * dx + dy * dy;
      let minDist = (this.size + other.size) / 2;

      if (distSq < minDist * minDist) {
        this.vx *= -0.3;
        this.vy = 0;
        this.y = other.y - this.size;
        this.stuck = true;
        break;
      }
    }
  }

  checkVideoCollision(vx, vy, vw, vh) {
    if (
      this.x > vx - vw / 2 &&
      this.x < vx + vw / 2 &&
      this.y > vy - vh / 2 &&
      this.y < vy + vh / 2
    ) {
      this.vx *= -0.5;
      this.vy *= -0.5;
      this.stuck = true;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}