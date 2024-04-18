/**
 * Class defining the board arrangement of the jigsaw pieces.
 */
class Board {
  /**
   * Constructor.
   * @param {number} x x coord of board.
   * @param {number} y y coord of board.
   * @param {number} rows Number of rows on this board.
   * @param {number} columns Number of columns on this board.
   * @param {number} edgeLength Edge length of triangle.
   * @param {number} notchDisplacement Notch displacement from edge.
   * @param {number} notchEdge Size of the notch.
   * @param {number} playerStop Number that the player stops pulling cards at.
   * @param {number} dealerStop Number that the dealer stops pulling cards at.
   */
  constructor(x, y, rows, columns, edgeLength, notchDisplacement, notchEdge, playerStop=19, dealerStop=17) {
    this.deck = Card.createDeck();

    this.playerStop = playerStop;
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
        );
        this.pullInitialCards(jp, this.deck);
        currentRow.push(jp);
      }
      this.jigsawPieces.push(currentRow);
    }
  }

  pullRandom(deck) {
    return deck[ Math.floor( Math.random() * deck.length ) ];
  }

  addToHand(competitor, card) {
    competitor.addCardToHand(card);
  }

  /**
   * 50/50 Chance of either returning true (heads) or false (tails).
   * @returns {boolean} Outcome of coin flip.
   */
  coinFlip() {
    return Math.random() < 0.5;
  }

  pullInitialCards(piece, deck) {
    this.addToHand(piece.player, this.pullRandom(deck));
    this.addToHand(piece.player, this.pullRandom(deck));
    this.addToHand(piece.dealer, this.pullRandom(deck));
    this.addToHand(piece.dealer, this.pullRandom(deck));
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

  _calculatePointTransform(point, rotationPoint, rotationTransform, xScale, yScale, mapTo) {
    let transformedPoint = this._rotatePoint(point, rotationPoint, rotationTransform * Math.PI/180);
    transformedPoint[0] = map(xScale, 0, 100, transformedPoint[0], mapTo[0]);
    transformedPoint[1] = map(yScale, 0, 100, transformedPoint[1], mapTo[1]);

    return transformedPoint;
  }

  compete() {
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        let player = jp.player;
        let dealer = jp.dealer;

        // Player and dealer AI 

        // The player, like in actual black jack, can only see the dealer's first card.
        while (player.score < this.playerStop) {
          // If the player's score is less than 11, it will pull.
          if (player.score < 11) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15 but the dealer's visible card is a 10 or ace, panic pull.
          if (player.score < 15 && dealer.hand[0].value >= 10) { this.addToHand(player, this.pullRandom(this.deck)); }

          // If the player's score is less than 15, flip a coin to either pull again or stop.
          if (player.score < 15 && this.coinFlip()) { this.addToHand(player, this.pullRandom(this.deck)); }
          else { break; }
        }

        // Dealer simply pulls until its score reaches 17 or higher, unless the player has gone bust.
        while (dealer.score < this.dealerStop && player.score < 22) {
          this.addToHand(dealer, this.pullRandom(this.deck));
        }

        // Player bust
        if (player.score > 21) {
          player.gameOutcome = "BUST";
          dealer.gameOutcome = "WIN";
        }
        // Dealer bust
        else if (dealer.score > 21) {
          player.gameOutcome = "WIN";
          dealer.gameOutcome = "BUST";
        }
        // Draw
        else if (player.score === dealer.score) {
          player.gameOutcome = "DRAW";
          dealer.gameOutcome = "DRAW";
        }
        // Player win
        else if (player.score > dealer.score) {
          player.gameOutcome = "WIN";
          dealer.gameOutcome = "LOSE";

          // Player blackjack
          if (player.score === 21 && player.hand.length === 2) {
            player.gameOutcome = "BLACKJACK";
          }
        }
        // Dealer win
        else if (player.score < dealer.score) {
          player.gameOutcome = "LOSE";
          dealer.gameOutcome = "WIN";

          // Dealer blackjack
          if (dealer.score === 21 && dealer.hand.length === 2) {
            dealer.gameOutcome = "BLACKJACK";
          }
        }

        // Generate faces based on outcome.
        jp.generateFace("player");
        jp.generateFace("dealer");
      }
    }
  }

  draw(rotationTransform, xScale, yScale, ...args) {
    push();
    angleMode(RADIANS);

    // Get the first piece.
    let firstPiece = this.jigsawPieces[0][0];
    let edgeLength = firstPiece.edgeLength;
    let firstCenter = [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2];
    

    // Apply transforms to the first piece's top right corner.
    let firstTopRightCorner = this._calculatePointTransform(
      [firstPiece.x + edgeLength, firstPiece.y], 
      firstCenter, rotationTransform, 
      xScale, yScale, [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2]
    );

    // Apply transforms to the first piece's bottom left corner.
    let firstBottomLeftCorner = this._calculatePointTransform(
      [firstPiece.x, firstPiece.y + edgeLength], 
      firstCenter, rotationTransform, 
      xScale, yScale, [firstPiece.x + edgeLength/2, firstPiece.y + edgeLength/2]
    );
    
    // Initialize variables for storing adjacent (one to the right, one below) jigsaw pieces.
    let secondRowPiece;
    let secondColPiece;

    // These must be initialized outside of the if statements in case there is only 1 row and/or 1 col.
    let secondRowTopLeftCorner = [0, 0];
    let secondColTopLeftCorner = [0, 0];
    
    if (this.jigsawPieces[0][1] !== undefined) {
      // Get the piece that comes directly after the first piece in the row.
      secondRowPiece = this.jigsawPieces[0][1]; 

      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondRowPiece.x + edgeLength/2, secondRowPiece.y + edgeLength/2];
      secondRowTopLeftCorner = this._calculatePointTransform(
        [secondRowPiece.x, secondRowPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale, [secondRowPiece.x + edgeLength/2, secondRowPiece.y + edgeLength/2]
      );
    }
    
    if (this.jigsawPieces[1] !== undefined) { 
      // Get the piece that comes directly after the first piece in the column. 
      secondColPiece = this.jigsawPieces[1][0];
      
      // Apply transforms to the second piece's top right corner.
      let secondCenter = [secondColPiece.x + edgeLength/2, secondColPiece.y + edgeLength/2];

      secondColTopLeftCorner = this._calculatePointTransform(
        [secondColPiece.x, secondColPiece.y], 
        secondCenter, rotationTransform, 
        xScale, yScale, [secondColPiece.x + edgeLength/2, secondColPiece.y + edgeLength/2]
      );
    }

    // Calculate the amount needed to move subsequent pieces after the first piece to its new correct position;
    let translationXY = [
      Math.abs(firstTopRightCorner[0] - secondRowTopLeftCorner[0]), // Row transition length x
      Math.abs(firstTopRightCorner[1] - secondRowTopLeftCorner[1]), // Row transition length y

      Math.abs(firstBottomLeftCorner[0] - secondColTopLeftCorner[0]), // Column transition length x
      Math.abs(firstBottomLeftCorner[1] - secondColTopLeftCorner[1]), // Column transition length y
    ];

    // Shadow pass
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
        jp.draw(
          r * -translationXY[0] - c * translationXY[2], 
          r * translationXY[1] - c * translationXY[3], 
          rotationTransform, xScale, yScale, "shadow", ...args
        );
        
      }
    }

    // Object pass
    for (let c=0; c<this.jigsawPieces.length; c++) {
      for (let r=0; r<this.jigsawPieces[0].length; r++) {
        let jp = this.jigsawPieces[c][r];
         jp.draw(
           r * -translationXY[0] - c * translationXY[2], 
           r * translationXY[1] - c * translationXY[3], 
           rotationTransform, xScale, yScale, "object", 0, 0
         );
        
      }
    }
    pop();
  }

  _rotatePoint(point, centre, angle) {
    let newPointX = (point[0] - centre[0]) * Math.cos(angle) - (point[1] - centre[1]) * Math.sin(angle) + centre[0];
    let newPointY = (point[0] - centre[0]) * Math.sin(angle) + (point[1] - centre[1]) * Math.cos(angle) + centre[1];

    return [newPointX, newPointY];
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
const COLS = 4;
const EDGE_LENGTH = 110;
let rot = 0;
let xScale = 0;
let yScale = 0;
const board = new Board(canvasWidth/4, 10, ROWS, COLS, EDGE_LENGTH, 8, 5);
board.generateNotches();
board.compete(20);

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
  background(255);
  // drawTable(canvasWidth, canvasHeight);
  board.draw(rot, xScale, yScale, -10, 10); 
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

