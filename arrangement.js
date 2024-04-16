/**
 * Class defining the board arrangement of the jigsaw pieces.
 */
class Board {
  /**
   * Inner card class.
   */
  Card = class {
    /**
     * Constructor.
     * @param {string} suit The suit of the card.
     * @param {string} symbol The symbol of the card.
     * @param {number} value The value of the card.
     */
    constructor(suit, symbol, value) {
      this.suit = suit;
      this.symbol = symbol;
      this.value = value;
    }
  }

  /**
   * Constructor.
   * @param {number} x x coord of board.
   * @param {number} y y coord of board.
   * @param {number} rows Number of rows on this board.
   * @param {number} columns Number of columns on this board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchEdge Size of the notch.
   * @param {boolean} scatter Boolean controlling whether pieces will be scattered.
   * @param {number|Array<number>} winColor Colour of the winner.
   * @param {number|Array<number>} loseColor  Colour of the loser.
   * @param {number} dealerStop Number that the dealer stops pulling cards at.
   */
  constructor(x, y, rows, columns, edgeLength, notchDisplacement, notchEdge, scatter, winColor, loseColor, dealerStop=17) {
    // Generates a full deck of cards, sans the jokers.
    // Admittedly this is overkill given that the faces will 
    // only play once to determine its features, but oh well.
    let suits = ["spade", "heart", "club", "diamond"];
    let symbols = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    this.deck = [];

    for (let suit of suits) for (let i=0; i<symbols.length; i++) {
      this.deck.push(new this.Card(suit, symbols[i], values[i]));
    }

    this.scatter = scatter;

    this.winColor = winColor;
    this.loseColor = loseColor;

    this.dealerStop = dealerStop;

    // Create new JigsawPiece objects.
    this.jigsawPieces = [];
    let currentRow;
    for (let c=0; c<columns; c++) {
      currentRow = [];
      for (let r=0; r<rows; r++) {
        let jp = new JigsawPiece(
          x + r * edgeLength, 
          y + c * edgeLength, 
          [r, c],
          edgeLength,
          notchDisplacement,
          notchEdge,
          scatter
        );
        jp.pullInitialCards(this.deck);
        currentRow.push(jp);
      }
      this.jigsawPieces.push(currentRow);
    }

    // later
    // this.bjColor
    // this.bustCol
  }

  generateNotches() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];

        // Player
        if (r - 1 < 0) { jp.compareTo(undefined, "L"); }
        else { jp.compareTo(this.jigsawPieces[c][r - 1], "L"); }

        if (c + 1 > this.jigsawPieces.length - 1) { jp.compareTo(undefined, "D"); }
        else { jp.compareTo(this.jigsawPieces[c + 1][r], "D"); }

        // Dealer
        if (r + 1 > this.jigsawPieces[0].length - 1) { jp.compareTo(undefined, "R"); }
        else { jp.compareTo(this.jigsawPieces[c][r + 1], "R"); }

        if (c - 1 < 0) { jp.compareTo(undefined, "U"); }
        else { jp.compareTo(this.jigsawPieces[c - 1][r], "U"); }
        
      }
    }
  }

  draw() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        jp.draw(this.winColor, this.loseColor);
      }
    }
  }
}


/*
 * This program draws your arrangement of faces on the canvas.
 */
const canvasWidth = 960;
const canvasHeight = 500;
let curRandomSeed = 0;

let lastSwapTime = 0;
const millisPerSwap = 3000;

const ROWS = 3;
const COLS = 5;

const board = new Board(canvasWidth/2 - 200, canvasHeight/3 - 150, ROWS, COLS, 90, 8, 5, true, [255, 255, 255], [0, 0, 0]);
board.generateNotches();

// global variables for colors
const bg_color1 = [71, 222, 219];

function setup () {
  // create the drawing canvas, save the canvas element
  let main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  curRandomSeed = int(random(0, 1000));

  // rotation in degrees
  angleMode(DEGREES);
}

function changeRandomSeed() {
  curRandomSeed = curRandomSeed + 1;
  lastSwapTime = millis();
}

function mouseClicked() {
  changeRandomSeed();
}

function draw() {
  drawTable(canvasWidth, canvasHeight);

  board.draw();
}

function drawTable(width, height) {
  push();
  strokeWeight(3);
  stroke(0);
  fill([50, 30, 15]);
  rect(width * 2/3, 0, width, height);

  fill([30, 20, 10]);
  noStroke();
  triangle(
    width * 2/3, 0,
    width * 2/3, height,
    width, height
  );

  pop();

  push();
  noStroke();
  fill([164, 116, 36]);
  rect(0, 0, width * 2/3, height);
  
  strokeWeight(10);
  strokeCap(SQUARE);
  stroke([96, 59, 42]);

  line(width * 2/3, 0, width * 2/3, height);

  pop();
}


function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}


// LEGACY
// function draw () {
//   if(millis() > lastSwapTime + millisPerSwap) {
//     changeRandomSeed();
//   }

//   // reset the random number generator each time draw is called
//   randomSeed(curRandomSeed);

//   // clear screen
//   background(bg_color1);
//   noStroke();

//   // draw a 7x4 grid of faces
//   let w = canvasWidth / 7;
//   let h = canvasHeight / 4;
//   for(let i=0; i<4; i++) {
//     for(let j=0; j<7; j++) {
//       let y = h/2 + h*i;
//       let x = w/2 + w*j;
     
//         // center face
//         let eye_value = int(random(2,4));
//         let tilt_value = random(-45, 45);
//         let mouth_value = random(3,4);
//         let is_cyclops = random(0, 100);

//         if(is_cyclops < 10) {
//           eye_value = 1;
//           tilt_value = random(-5, 5);
//           mouth_value = random(0, 1.7);
//         }

//         push();
//         translate(x, y);
//         scale(w/25, h/25);
        
//         orangeAlienFace(tilt_value, eye_value, mouth_value);
//         pop();
      
//     }
//   }
// }

