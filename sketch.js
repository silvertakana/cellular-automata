var img,
  board,
  pause = false;

var rule = "002100000";

//212222222
//010000000
var speed;
function setup() {
  ruleSeter = createInput("002100000");
  randomp = createButton("genreate random dots");
  randomp.position(50, 150);
  ruleSeter.position(50, 100);

  speed = createSlider(1, 60, 1);
  speed.position(50, 50);
  createCanvas(windowWidth, windowHeight);
  let w = floor(width / 4),
    h = floor(height / 4);
  console.log();
  img = new p5.Image(w, h);
  img.loadPixels();

  board = new Board(w, h);
  randomp.mousePressed(() => {
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        board.game[i][j] = random() > 0.5;
      }
    }
  });

  noSmooth();
  // noLoop();
}

function draw() {
  rule = ruleSeter.value();
  if (round(frameCount % speed.value()) === 0 && !pause) {
    board.update(rule);
    render(img, board);
    img.updatePixels();
    image(img, 0, 0, width, height);
  }
  if (mouseIsPressed) {
    let x = round(map(mouseX, 0, width, 0, img.width)),
      y = round(map(mouseY, 0, height, 0, img.height));

    board.game[x][y] = true;
    render(img, board);
    img.updatePixels();
    image(img, 0, 0, width, height);
  }
}
function keyPressed() {
  if (pause) {
    pause = false;
  } else {
    pause = true;
  }
}
function render(img, board) {
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      var col;
      if (board.game[i][j]) {
        col = color(0);
      } else {
        col = color(255);
      }
      const a = (i + j * img.width) * 4;
      img.pixels[a] = col.levels[0];
      img.pixels[a + 1] = col.levels[1];
      img.pixels[a + 2] = col.levels[2];
      img.pixels[a + 3] = col.levels[3];
    }
  }
}
class Board {
  constructor(w, h) {
    this.game = [];
    for (let i = 0; i < w; i++) {
      this.game[i] = [];
      for (let j = 0; j < h; j++) {
        this.game[i][j] = false;
      }
    }
  }
  update(rule) {
    var Copy = [];
    this.game.forEach((item, id) => {
      Copy[id] = [];
      item.forEach((it, i) => {
        Copy[id][i] = it;
      });
    });
    let w = Copy.length,
      h = Copy[0].length;
    //loop through all cells
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let nc = 0;
        //get count
        const ison = (x, y) => {
          if (Copy[i + x]) {
            if (Copy[i + x][j + y] === undefined) {
              return 0;
            } else {
              return Copy[i + x][j + y] + 0;
            }
          } else {
            return 0;
          }
        };

        nc += ison(0, 1);
        nc += ison(0, -1);
        nc += ison(1, 0);
        nc += ison(-1, 0);
        nc += ison(1, 1);
        nc += ison(-1, 1);
        nc += ison(1, -1);
        nc += ison(-1, -1);

        const become = rule[nc];

        if (become == 0) {
          this.game[i][j] = false;
        }
        if (become == 1) {
          this.game[i][j] = true;
        }
      }
    }
    // console.log((Copy === this.game));
  }
}
